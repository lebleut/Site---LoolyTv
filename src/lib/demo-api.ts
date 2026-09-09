import { getOrCreateInstallId } from "./install-id";

export class DemoApiError extends Error {
  status: number;
  retryAfterSeconds?: number;

  constructor(status: number, message: string, retryAfterSeconds?: number) {
    super(message);
    this.name = "DemoApiError";
    this.status = status;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

type DemoFetchOptions = {
  signal?: AbortSignal;
};

async function demoFetch<T>(path: string, options: DemoFetchOptions = {}): Promise<T> {
  const installId = getOrCreateInstallId();
  const res = await fetch(path, {
    signal: options.signal,
    headers: {
      Accept: "application/json",
      "X-Demo-Install-Id": installId,
    },
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new DemoApiError(
      res.status,
      typeof payload.message === "string" ? payload.message : "Request failed",
      typeof payload.retryAfterSeconds === "number" ? payload.retryAfterSeconds : undefined,
    );
  }

  return payload as T;
}

export function fetchDemoHome(query: string, options?: DemoFetchOptions) {
  return demoFetch(`/api/demo/home?${query}`, options);
}

export function fetchDemoUniverses(query: string, options?: DemoFetchOptions) {
  return demoFetch(`/api/demo/universes?${query}`, options);
}

export function fetchDemoUniverse(id: string, query: string, options?: DemoFetchOptions) {
  return demoFetch(`/api/demo/universes/${encodeURIComponent(id)}?${query}`, options);
}

export function fetchDemoTopics(query: string, options?: DemoFetchOptions) {
  return demoFetch(`/api/demo/topics?${query}`, options);
}

export function fetchDemoSearch(query: string, options?: DemoFetchOptions) {
  return demoFetch(`/api/demo/search?${query}`, options);
}

export function fetchDemoPlaylist(id: string, query: string, options?: DemoFetchOptions) {
  return demoFetch(`/api/demo/playlists/${encodeURIComponent(id)}?${query}`, options);
}

export function fetchDemoPlaylistVideos(
  id: string,
  query: string,
  options?: DemoFetchOptions,
) {
  return demoFetch(
    `/api/demo/playlists/${encodeURIComponent(id)}/videos?${query}`,
    options,
  );
}
