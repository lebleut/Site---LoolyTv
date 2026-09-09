type ThumbnailSize = "hq" | "sd" | "maxres";

const YTIMG_FILE: Record<ThumbnailSize, string> = {
  hq: "hqdefault.jpg",
  sd: "sddefault.jpg",
  maxres: "maxresdefault.jpg",
};

const GGPHT_PX: Record<ThumbnailSize, number> = {
  hq: 240,
  sd: 480,
  maxres: 800,
};

const YTIMG_VI =
  /^(https?:\/\/i\.ytimg\.com\/vi(?:_webp)?\/[\w-]+)\/(?:maxresdefault|sddefault|hqdefault|mqdefault|default)(?:\.jpg|\.webp)(\?.*)?$/i;

const GGPHT_S =
  /^(https?:\/\/(?:yt3\.(?:ggpht|googleusercontent)\.com|lh3\.googleusercontent\.com)\/.+?=s)\d+/i;

export function upgradeThumbnail(
  url: string | null | undefined,
  size: ThumbnailSize = "sd",
): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const ytimg = trimmed.match(YTIMG_VI);
  if (ytimg) {
    return `${ytimg[1]}/${YTIMG_FILE[size]}${ytimg[2] ?? ""}`;
  }

  if (GGPHT_S.test(trimmed)) {
    return trimmed.replace(GGPHT_S, `$1${GGPHT_PX[size]}`);
  }

  return trimmed;
}
