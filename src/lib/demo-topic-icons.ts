/** Decorative icons for YouTube parent topic slugs (and fallback for children). */
const PARENT_TOPIC_ICONS: Record<string, string> = {
  music: "🎵",
  gaming: "🎮",
  sports: "⚽",
  entertainment: "🎬",
  lifestyle: "🏡",
  society: "🌍",
  knowledge: "📚",
};

const FALLBACK_TOPIC_ICON = "🏷️";

export function topicIconForSlug(
  slug: string | null | undefined,
  parentSlug?: string | null,
): string {
  if (!slug) return FALLBACK_TOPIC_ICON;
  if (PARENT_TOPIC_ICONS[slug]) return PARENT_TOPIC_ICONS[slug];
  if (parentSlug && PARENT_TOPIC_ICONS[parentSlug]) {
    return PARENT_TOPIC_ICONS[parentSlug];
  }
  return FALLBACK_TOPIC_ICON;
}

export function withTopicIcon(label: string, icon: string): string {
  return `${icon} ${label}`;
}
