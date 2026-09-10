/** Mirror of Backend packages/contracts catalog types for the web demo. */

export type AgeBand = "AGE_2_4" | "AGE_5_8" | "AGE_9_12";

export type AppPlaylist = {
  id: string;
  title: string;
  description?: string | null;
  channelId?: string | null;
  channelTitle?: string | null;
  channelThumbnail?: string | null;
  subscriberCount?: number | null;
  videoCount: number;
  viewCount?: number | null;
  thumbnail?: string | null;
  language?: string | null;
  ageBands?: AgeBand[];
  topics?: string[];
  avgDurationSeconds?: number | null;
  nonMadeForKidsCount?: number;
  madeForKidsCount?: number;
  blockedVideoCount?: number;
  playableCount?: number;
  nonEmbeddableCount?: number;
  unavailableCount?: number;
  countryBlockedCount?: number;
  unplayableReason?:
    | "empty"
    | "all_non_embeddable"
    | "all_country_blocked"
    | "all_unavailable"
    | "mixed_unplayable"
    | null;
};

export type AppVideo = {
  id: string;
  youtubeId: string;
  title: string;
  duration: number;
  thumbnail?: string | null;
  channelTitle?: string | null;
  playlistTitle?: string | null;
  madeForKids?: boolean;
  embedBlocked?: boolean;
  position?: number;
};

export type CatalogTopic = {
  id: string;
  slug: string;
  label: string;
  parentSlug?: string | null;
  isParent?: boolean;
};

export type CatalogTopicsResponse = {
  items: CatalogTopic[];
  tree: Array<CatalogTopic & { children?: CatalogTopic[] }>;
  lang: string;
};

export type ExploreUniverseItem =
  | {
      kind: "universe";
      id: string;
      slug: string;
      name: string;
      thumbnail: string | null;
      channelCount: number;
    }
  | {
      kind: "channel";
      id: string;
      title: string;
      thumbnail: string | null;
      subscriberCount?: number | null;
    };

export type ExploreHomeTopicRow = {
  slug: string;
  title: string;
  playlists: AppPlaylist[];
};

export type ExploreHomeResponse = {
  universes: ExploreUniverseItem[];
  recommendations: AppPlaylist[];
  mostRequested: AppPlaylist[];
  topicRows: ExploreHomeTopicRow[];
  ageBand: AgeBand | null;
  country: string;
  lang: string;
};

export type ExploreBrowsePage = {
  items: ExploreUniverseItem[];
  total: number;
  hasMore: boolean;
};

export type UniverseDetailResponse = {
  id: string;
  slug: string;
  name: string;
  thumbnail: string | null;
  channels: Array<{
    id: string;
    title: string;
    thumbnail: string | null;
    subscriberCount?: number | null;
    playlistCount: number;
  }>;
  playlists: AppPlaylist[];
  playlistTotal: number;
  playlistsCapped: boolean;
};

export type PlaylistSearchResponse = {
  items: AppPlaylist[];
  page: number;
  pageSize: number;
  total: number;
};

export type PlaylistVideosResponse = {
  items: AppVideo[];
  probeItems: AppVideo[];
};

export type PlaylistSort = "relevance" | "views" | "videos" | "avgDuration";
