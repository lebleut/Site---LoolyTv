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

const LANGUAGE_COUNTRY: Record<string, string> = {
  en: "US",
  fr: "FR",
  ar: "SA",
  es: "ES",
};

/** Browser/OS locale region. A client country query is never trusted. */
export function countryFromAcceptLanguage(header: string | null): string {
  const tags = (header ?? "")
    .split(",")
    .map((part) => part.split(";")[0]?.trim())
    .filter((tag): tag is string => !!tag);
  for (const tag of tags) {
    const region = tag.split("-")[1];
    if (region && /^[A-Za-z]{2}$/.test(region)) return region.toUpperCase();
  }
  for (const tag of tags) {
    const language = tag.split("-")[0]?.toLowerCase() ?? "";
    if (LANGUAGE_COUNTRY[language]) return LANGUAGE_COUNTRY[language];
  }
  return "US";
}

export async function proxyCatalogGet(
  request: NextRequest,
  apiPath: string,
  options: ProxyOptions,
): Promise<NextResponse> {
  const params = pickQueryParams(request, options.allowedParams);
  if (options.allowedParams.includes("country")) {
    params.set("country", countryFromAcceptLanguage(request.headers.get("accept-language")));
  }
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
