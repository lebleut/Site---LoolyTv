import { NextRequest } from "next/server";
import { proxyPublicFormPost } from "@/lib/public-form-bff";

export async function POST(request: NextRequest) {
  return proxyPublicFormPost(request, {
    upstreamPath: "/v1/public/contact",
    expectedAction: "contact",
  });
}
