import { NextRequest } from "next/server";
import { proxyCatalogGet } from "@/lib/demo-bff";

export async function GET(request: NextRequest) {
  return proxyCatalogGet(request, "/v1/explore/home", {
    allowedParams: [
      "country",
      "ageBand",
      "lang",
      "prefLang",
      "favoriteLanguages",
      "variant",
    ],
    /** Align with Redis Explore TTL (~5h); one layout per ageBand × site language. */
    revalidate: 1800,
  });
}
