"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import type {
  AppPlaylist,
  CatalogTopicsResponse,
  ExploreBrowsePage,
  ExploreHomeResponse,
  ExploreUniverseItem,
  PlaylistSearchResponse,
  PlaylistSort,
} from "@/lib/catalog-types";
import {
  DemoApiError,
  fetchDemoHome,
  fetchDemoSearch,
  fetchDemoTopics,
  fetchDemoUniverses,
} from "@/lib/demo-api";
import {
  DEFAULT_DEMO_AGE_BAND,
  DEMO_AGE_BANDS,
  demoCountryForLocale,
  demoLangForLocale,
} from "@/lib/demo-locale";
import { trackEvent } from "@/lib/analytics";
import { HorizontalRow } from "./HorizontalRow";
import { PlaylistCard } from "./PlaylistCard";
import { PlaylistDialog } from "./PlaylistDialog";
import { DemoCta } from "./DemoCta";
import styles from "./demo.module.css";

const SEARCH_DEBOUNCE_MS = 350;
const MIN_SEARCH_LENGTH = 2;

function buildBaseQuery(locale: string, ageBand: string) {
  return new URLSearchParams({
    country: demoCountryForLocale(locale),
    lang: demoLangForLocale(locale),
    prefLang: demoLangForLocale(locale),
    ageBand,
  });
}

export function DemoApp() {
  const t = useTranslations("demo");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const qParam = searchParams.get("q") ?? "";
  const topicParam = searchParams.get("topic") ?? "";
  const ageParam = searchParams.get("age") ?? DEFAULT_DEMO_AGE_BAND;
  const sortParam = (searchParams.get("sort") as PlaylistSort | null) ?? "relevance";
  const pageParam = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const playlistParam = searchParams.get("playlist") ?? "";

  const [queryInput, setQueryInput] = useState(qParam);
  const [home, setHome] = useState<ExploreHomeResponse | null>(null);
  const [universes, setUniverses] = useState<ExploreUniverseItem[]>([]);
  const [topics, setTopics] = useState<CatalogTopicsResponse | null>(null);
  const [searchResults, setSearchResults] = useState<AppPlaylist[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [loadingHome, setLoadingHome] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultsAnnouncement, setResultsAnnouncement] = useState("");

  const searchAbortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);
  const openedRef = useRef(false);

  const isSearching =
    qParam.trim().length >= MIN_SEARCH_LENGTH || topicParam.trim().length > 0;
  const parentTopics = useMemo(
    () => (topics?.tree ?? []).filter((topic) => topic.isParent !== false),
    [topics],
  );
  const childTopics = useMemo(() => {
    if (!topicParam) return [];
    const parent = parentTopics.find(
      (topic) => topic.slug === topicParam || topic.children?.some((child) => child.slug === topicParam),
    );
    return parent?.children ?? [];
  }, [parentTopics, topicParam]);

  const replaceParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value == null || value === "") params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const openPlaylist = useCallback(
    (playlist: AppPlaylist) => {
      replaceParams({ playlist: playlist.id });
    },
    [replaceParams],
  );

  const closePlaylist = useCallback(() => {
    replaceParams({ playlist: null });
  }, [replaceParams]);

  useEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    trackEvent("demo_open", { locale });
  }, [locale]);

  useEffect(() => {
    setQueryInput(qParam);
  }, [qParam]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBrowseData() {
      setLoadingHome(true);
      setError(null);

      const base = buildBaseQuery(locale, ageParam);

      try {
        const [homeData, universeData, topicsData] = await Promise.all([
          fetchDemoHome(base.toString(), { signal: controller.signal }),
          fetchDemoUniverses(`${base.toString()}&limit=24`, { signal: controller.signal }),
          fetchDemoTopics(`lang=${demoLangForLocale(locale)}`, { signal: controller.signal }),
        ]);

        setHome(homeData as ExploreHomeResponse);
        setUniverses((universeData as ExploreBrowsePage).items);
        setTopics(topicsData as CatalogTopicsResponse);
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof DemoApiError && err.status === 429) {
          setError(t("errors.rateLimit"));
        } else {
          setError(t("errors.loadHome"));
        }
      } finally {
        if (!controller.signal.aborted) setLoadingHome(false);
      }
    }

    loadBrowseData();
    return () => controller.abort();
  }, [ageParam, locale, t]);

  useEffect(() => {
    if (!isSearching) {
      setSearchResults([]);
      setSearchTotal(0);
      setResultsAnnouncement("");
      return;
    }

    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;

    async function runSearch() {
      setLoadingSearch(true);
      setError(null);

      const params = buildBaseQuery(locale, ageParam);
      params.set("q", qParam.trim());
      params.set("sort", sortParam);
      params.set("page", String(pageParam));
      params.set("pageSize", "15");
      if (topicParam) params.set("topic", topicParam);

      try {
        const data = (await fetchDemoSearch(params.toString(), {
          signal: controller.signal,
        })) as PlaylistSearchResponse;

        setSearchResults((prev) =>
          pageParam > 1 ? [...prev, ...data.items] : data.items,
        );
        setSearchTotal(data.total);
        setResultsAnnouncement(t("resultsCount", { count: data.total }));
        trackEvent("demo_search", {
          query_length: qParam.trim().length,
          has_topic: Boolean(topicParam),
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof DemoApiError && err.status === 429) {
          setError(t("errors.rateLimit"));
        } else {
          setError(t("errors.search"));
        }
      } finally {
        if (!controller.signal.aborted) setLoadingSearch(false);
      }
    }

    runSearch();
    return () => controller.abort();
  }, [ageParam, isSearching, locale, pageParam, qParam, sortParam, t, topicParam]);

  const onQueryChange = (value: string) => {
    setQueryInput(value);

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      replaceParams({ q: value.trim() || null, page: null });
    }, SEARCH_DEBOUNCE_MS);
  };

  const onFilterChange = (key: string, value: string) => {
    trackEvent("demo_filter_apply", { filter: key, value });
    const updates: Record<string, string | null> = { page: null };
    updates[key] = value || null;
    if (key === "topic") updates.page = null;
    replaceParams(updates);
  };

  return (
    <div className={styles.wrap}>
      <div className="container">
        <div className={styles.intro}>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
          <p>{t("parentNote")}</p>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchRow}>
            <label className={`field ${styles.searchInput}`}>
              <span className="sr-only">{t("searchLabel")}</span>
              <input
                type="search"
                name="q"
                value={queryInput}
                placeholder={t("searchPlaceholder")}
                autoComplete="off"
                onChange={(event) => onQueryChange(event.target.value)}
              />
            </label>
          </div>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label htmlFor="demo-age">{t("filters.age")}</label>
              <select
                id="demo-age"
                value={ageParam}
                onChange={(event) => onFilterChange("age", event.target.value)}
              >
                {DEMO_AGE_BANDS.map((band) => (
                  <option key={band} value={band}>
                    {t(`ageBands.${band}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="demo-topic">{t("filters.mainTopic")}</label>
              <select
                id="demo-topic"
                value={parentTopics.some((topic) => topic.slug === topicParam) ? topicParam : ""}
                onChange={(event) => onFilterChange("topic", event.target.value)}
              >
                <option value="">{t("filters.allTopics")}</option>
                {parentTopics.map((topic) => (
                  <option key={topic.slug} value={topic.slug}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>

            {childTopics.length > 0 ? (
              <div className={styles.filterGroup}>
                <label htmlFor="demo-subtopic">{t("filters.subtopic")}</label>
                <select
                  id="demo-subtopic"
                  value={childTopics.some((topic) => topic.slug === topicParam) ? topicParam : ""}
                  onChange={(event) => onFilterChange("topic", event.target.value)}
                >
                  <option value="">{t("filters.allSubtopics")}</option>
                  {childTopics.map((topic) => (
                    <option key={topic.slug} value={topic.slug}>
                      {topic.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {isSearching ? (
              <div className={styles.filterGroup}>
                <label htmlFor="demo-sort">{t("filters.sort")}</label>
                <select
                  id="demo-sort"
                  value={sortParam}
                  onChange={(event) => onFilterChange("sort", event.target.value)}
                >
                  <option value="relevance">{t("sort.relevance")}</option>
                  <option value="views">{t("sort.views")}</option>
                  <option value="videos">{t("sort.videos")}</option>
                  <option value="avgDuration">{t("sort.avgDuration")}</option>
                </select>
              </div>
            ) : null}
          </div>

          <div className={styles.status} aria-live="polite">
            {loadingSearch ? t("searching") : null}
            {!loadingSearch && resultsAnnouncement ? (
              <span className={styles.statusLive}>{resultsAnnouncement}</span>
            ) : null}
            {error ? <span className={styles.statusError}>{error}</span> : null}
          </div>
        </div>

        {isSearching ? (
          <>
            {loadingSearch && searchResults.length === 0 ? (
              <div className={styles.skeletonGrid} aria-hidden="true">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={styles.skeletonCard} />
                ))}
              </div>
            ) : null}

            {!loadingSearch && searchResults.length === 0 ? (
              <div className={styles.empty}>{t("emptySearch")}</div>
            ) : (
              <div className={styles.grid}>
                {searchResults.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} onOpen={openPlaylist} />
                ))}
              </div>
            )}

            {searchResults.length < searchTotal ? (
              <div className={styles.loadMore}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={loadingSearch}
                  onClick={() => replaceParams({ page: String(pageParam + 1) })}
                >
                  {loadingSearch ? t("loadingMore") : t("loadMore")}
                </button>
              </div>
            ) : null}
          </>
        ) : loadingHome ? (
          <div className={styles.skeletonGrid} aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={styles.skeletonCard} />
            ))}
          </div>
        ) : (
          <>
            {home?.recommendations?.length ? (
              <HorizontalRow
                title={t("sections.recommendations")}
                playlists={home.recommendations}
                onOpenPlaylist={openPlaylist}
              />
            ) : null}

            {home?.topicRows?.map((row) => (
              <HorizontalRow
                key={row.slug}
                title={row.title}
                playlists={row.playlists}
                onOpenPlaylist={openPlaylist}
              />
            ))}

            {universes.length > 0 ? (
              <section className={styles.section} aria-label={t("sections.universes")}>
                <div className={styles.sectionHead}>
                  <h2>{t("sections.universes")}</h2>
                </div>
                <ul className={styles.rowTrack}>
                  {universes.map((item) => (
                    <li key={`${item.kind}-${item.id}`} className={styles.universeCard}>
                      <div className={styles.card}>
                        <div className={styles.cardMedia}>
                          {item.thumbnail ? (
                            <Image
                              src={item.thumbnail}
                              alt=""
                              width={640}
                              height={360}
                              unoptimized
                            />
                          ) : null}
                        </div>
                        <div className={styles.cardBody}>
                          <h3>{item.kind === "universe" ? item.name : item.title}</h3>
                          <p className={styles.cardMeta}>
                            {item.kind === "universe"
                              ? t("meta.channels", { count: item.channelCount })
                              : t("sections.channel")}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        )}

        <DemoCta />
      </div>

      {playlistParam ? (
        <PlaylistDialog
          playlistId={playlistParam}
          country={demoCountryForLocale(locale)}
          onClose={closePlaylist}
        />
      ) : null}
    </div>
  );
}
