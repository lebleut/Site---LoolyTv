import { NextRequest } from "next/server";
import { proxyCatalogGet } from "@/lib/demo-bff";

export async function GET(request: NextRequest) {
  return proxyCatalogGet(request, "/v1/playlists/search", {
    allowedParams: [
      "q",
      "topic",
      "ageBands",
      "lang",
      "prefLang",
      "country",
      "sort",
      "page",
      "pageSize",
    ],
    revalidate: 0,
  });
}
