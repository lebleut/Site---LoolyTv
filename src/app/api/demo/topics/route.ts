import { NextRequest } from "next/server";
import { proxyCatalogGet } from "@/lib/demo-bff";

export async function GET(request: NextRequest) {
  return proxyCatalogGet(request, "/v1/topics", {
    allowedParams: ["lang"],
    revalidate: 600,
  });
}
