import "server-only";
import { API_URL } from "./site";

type CatalogFetchOptions = {
  installId?: string;
  revalidate?: number;
};

export async function catalogFetch(
  path: string,
  options: CatalogFetchOptions = {},
): Promise<Response> {
  const apiKey = process.env.LOOLY_API_KEY?.trim() ?? "";
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (apiKey) {
    headers["X-Api-Key"] = apiKey;
  }

  const installId = options.installId?.trim();
  if (installId) {
    headers["X-Install-Id"] = installId;
  }

  return fetch(`${API_URL}${path}`, {
    headers,
    next: { revalidate: options.revalidate ?? 300 },
  });
}
