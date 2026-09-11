import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/site";
import { verifyRecaptchaToken } from "@/lib/recaptcha-server";

type ProxyOptions = {
  upstreamPath: string;
  expectedAction: string;
};

export async function proxyPublicFormPost(
  request: NextRequest,
  options: ProxyOptions,
): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const captcha = await verifyRecaptchaToken({
    token: body.captchaToken,
    expectedAction: options.expectedAction,
  });

  if (!captcha.ok) {
    const status =
      captcha.reason === "missing_config" || captcha.reason === "missing_token"
        ? 400
        : 403;
    return NextResponse.json(
      { message: "Captcha verification failed", reason: captcha.reason },
      { status },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip before upstream
  const { captchaToken, ...forwardBody } = body;

  try {
    const upstream = await fetch(`${API_URL}${options.upstreamPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(request.headers.get("user-agent")
          ? { "User-Agent": request.headers.get("user-agent")! }
          : {}),
        ...(request.headers.get("x-forwarded-for")
          ? { "X-Forwarded-For": request.headers.get("x-forwarded-for")! }
          : {}),
      },
      body: JSON.stringify(forwardBody),
      cache: "no-store",
    });

    const text = await upstream.text();
    const contentType = upstream.headers.get("content-type") || "application/json";

    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch {
    return NextResponse.json({ message: "Upstream unavailable" }, { status: 502 });
  }
}
