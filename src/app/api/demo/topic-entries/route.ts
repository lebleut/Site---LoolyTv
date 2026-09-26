import { NextRequest } from "next/server";
import { proxyCatalogGet } from "@/lib/demo-bff";

export async function GET(request: NextRequest) {
  return proxyCatalogGet(request, "/v1/explore/topic-entries", {
    allowedParams: ["topic", "limit", "country", "prefLang", "lang", "ageBand"],
    revalidate: 60,
  });
}
