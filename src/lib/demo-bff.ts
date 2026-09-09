import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { catalogFetch } from "./api-server";

type ProxyOptions = {
  allowedParams: readonly string[];
  revalidate?: number;
};

function pickQueryParams(
  request: NextRequest,
  allowedParams: readonly string[],
): URLSearchParams {
  const source = request.nextUrl.searchParams;
  const params = new URLSearchParams();

  for (const key of allowedParams) {
    const value = source.get(key);
    if (value != null && value.trim() !== "") {
      params.set(key, value.trim());
    }
  }

  return params;
}

function readInstallId(request: NextRequest): string | undefined {
  const value = request.headers.get("x-demo-install-id")?.trim();
  return value || undefined;
}

export async function proxyCatalogGet(
  request: NextRequest,
  apiPath: string,
  options: ProxyOptions,
): Promise<NextResponse> {
  const params = pickQueryParams(request, options.allowedParams);
  const query = params.toString();
  const path = query ? `${apiPath}?${query}` : apiPath;

  try {
    const upstream = await catalogFetch(path, {
      installId: readInstallId(request),
      revalidate: options.revalidate,
    });

    if (upstream.status === 429) {
      const retryAfter = upstream.headers.get("Retry-After") ?? "60";
      return NextResponse.json(
        { message: "Too many requests", retryAfterSeconds: Number(retryAfter) || 60 },
        { status: 429, headers: { "Retry-After": retryAfter } },
      );
    }

    if (!upstream.ok) {
      const body = await upstream.text().catch(() => "");
      return NextResponse.json(
        { message: body || "Upstream error" },
        { status: upstream.status >= 400 ? upstream.status : 502 },
      );
    }

    const data = await upstream.json();
    const cacheSeconds = options.revalidate ?? 300;

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 2}`,
      },
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
