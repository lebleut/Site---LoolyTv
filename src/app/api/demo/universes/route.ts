import { NextRequest } from "next/server";
import { proxyCatalogGet } from "@/lib/demo-bff";

export async function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get("kind");

  if (kind === "orphan-channels") {
    return proxyCatalogGet(request, "/v1/explore/orphan-channels", {
      allowedParams: ["limit", "offset", "country", "prefLang", "lang", "ageBand"],
      revalidate: 600,
    });
  }

  return proxyCatalogGet(request, "/v1/explore/universes", {
    allowedParams: ["limit", "offset", "country", "prefLang", "lang", "ageBand"],
    revalidate: 600,
  });
}
