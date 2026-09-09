import { NextRequest } from "next/server";
import { proxyCatalogGet } from "@/lib/demo-bff";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;
  return proxyCatalogGet(request, `/v1/playlists/${encodeURIComponent(id)}`, {
    allowedParams: ["country"],
    revalidate: 300,
  });
}
