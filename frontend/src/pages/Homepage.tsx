import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { REVIEWS_PER_PAGE } from "../config";
import { GET_CATEGORIES, GET_REVIEWS, GET_REVIEW_STATS } from "../graphql/queries";
import useDebounce from "../hooks/useDebounce";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { Category, PageInfo, Review } from "../types/review";
import Pagination from "../components/Pagination";
import ReviewCard, { ReviewCardSkeleton } from "../components/ReviewCard";
import StateMessage from "../components/StateMessage";
import { CloseIcon, SearchIcon } from "../components/icons";

export const SORT_OPTIONS = [
  { value: "publishedAt:desc", label: "Newest first" },
  { value: "publishedAt:asc", label: "Oldest first" },
  { value: "rating:desc", label: "Highest rated" },
  { value: "rating:asc", label: "Lowest rated" },
  { value: "title:asc", label: "Title A–Z" },
];
const DEFAULT_SORT = SORT_OPTIONS[0].value;

interface ReviewsData {
  reviews_connection: { nodes: Review[]; pageInfo: PageInfo };
}

interface StatsData {
  reviews_connection: {
    nodes: Pick<Review, "documentId" | "rating">[];
    pageInfo: Pick<PageInfo, "total">;
  };
}

const Stat = ({ label, value }: { label: string; value?: string | number }) => (
  <div>
    <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {label}
    </dt>
    <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">
      {value ?? <span className="skeleton inline-block h-7 w-12 align-middle" />}
    </dd>
  </div>
);

const Homepage = () => {
  useDocumentTitle();
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const sortParam = searchParams.get("sort");
  const sort = SORT_OPTIONS.some((o) => o.value === sortParam) ? sortParam! : DEFAULT_SORT;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  /** Updates URL params; any filter change resets pagination. */
  const updateParams = (changes: Record<string, string | null>, resetPage = true) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        Object.entries(changes).forEach(([key, value]) =>
          value ? next.set(key, value) : next.delete(key),
        );
        if (resetPage) next.delete("page");
        return next;
      },
      { replace: true },
    );
  };

  // Local input state, debounced into the URL so we don't query on every keystroke.
  const [searchInput, setSearchInput] = useState(q);
  const debouncedSearch = useDebounce(searchInput.trim(), 350);

  useEffect(() => {
    if (debouncedSearch !== q) updateParams({ q: debouncedSearch || null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep the input in sync when the URL changes from elsewhere (e.g. the search dialog).
  useEffect(() => {
    setSearchInput((current) => (current.trim() === q ? current : q));
  }, [q]);

  const filters = useMemo(() => {
    const result: Record<string, unknown> = {};
    if (q) result.title = { containsi: q };
    if (category) result.categories = { slug: { eq: category } };
    return result;
  }, [q, category]);

  const { data, previousData, loading, error, refetch } = useQuery<ReviewsData>(GET_REVIEWS, {
    variables: {
      filters,
      sort: [sort],
      pagination: { page, pageSize: REVIEWS_PER_PAGE },
    },
  });

  const { data: statsData } = useQuery<StatsData>(GET_REVIEW_STATS);
  const { data: categoriesData } = useQuery<{ categories: Category[] }>(GET_CATEGORIES, {
    errorPolicy: "ignore",
  });

  const stats = useMemo(() => {
    if (!statsData) return null;
    const ratings = statsData.reviews_connection.nodes.map((r) => r.rating);
    const average = ratings.length
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
    return {
      total: statsData.reviews_connection.pageInfo.total,
      average: average ? average.toFixed(1) : "—",
      topRated: ratings.filter((rating) => rating >= 8).length,
    };
  }, [statsData]);

  const categories = categoriesData?.categories ?? [];
  const current = data ?? previousData;
  const reviews = current?.reviews_connection.nodes ?? [];
  const pageInfo = current?.reviews_connection.pageInfo;
  const isRefetching = loading && !data && !!previousData;
  const hasFilters = Boolean(q || category);

  const clearFilters = () => {
    setSearchInput("");
    updateParams({ q: null, category: null });
  };

  const goToPage = (nextPage: number) => {
    updateParams({ page: nextPage > 1 ? String(nextPage) : null }, false);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeCategoryName = categories.find((c) => c.slug === category)?.name;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-slate-950">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-brand-200/60 via-fuchsia-200/40 to-sky-200/50 blur-3xl dark:from-brand-500/15 dark:via-fuchsia-500/10 dark:to-sky-500/10"
        />
        <div className="container-page relative py-16 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Fresh takes, every week
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Reviews worth{" "}
            <span className="bg-gradient-to-r from-brand-600 to-fuchsia-500 bg-clip-text text-transparent">
              your time.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            In-depth, no-nonsense verdicts on games, films and everything in between —
            so you can decide what deserves your evening.
          </p>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-slate-200 pt-6 dark:border-slate-800">
            <Stat label="Reviews" value={stats?.total} />
            <Stat label="Avg. score" value={stats?.average} />
            <Stat label="Rated 8+" value={stats?.topRated} />
          </dl>
        </div>
      </section>

      {/* Listing */}
      <section ref={resultsRef} className="container-page scroll-mt-20 pt-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Filter by title…"
              aria-label="Filter reviews by title"
              className="input pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="shrink-0 text-sm text-slate-500">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(event) =>
                updateParams({
                  sort: event.target.value === DEFAULT_SORT ? null : event.target.value,
                })
              }
              className="input w-auto cursor-pointer pr-8"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {categories.length > 0 && (
          <div
            className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
            role="group"
            aria-label="Filter by category"
          >
            {[{ documentId: "all", name: "All", slug: "" }, ...categories].map((item) => {
              const active = item.slug === category;
              return (
                <button
                  key={item.documentId}
                  type="button"
                  onClick={() => updateParams({ category: item.slug || null })}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex min-h-[1.5rem] items-center justify-between text-sm text-slate-500">
          {pageInfo && (
            <p aria-live="polite">
              {pageInfo.total === 0
                ? "No results"
                : `${pageInfo.total} ${pageInfo.total === 1 ? "review" : "reviews"}`}
              {q && (
                <>
                  {" "}
                  for “<span className="font-medium text-slate-900 dark:text-white">{q}</span>”
                </>
              )}
              {activeCategoryName && (
                <>
                  {" "}
                  in <span className="font-medium text-slate-900 dark:text-white">{activeCategoryName}</span>
                </>
              )}
            </p>
          )}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="mt-4">
          {error && !current ? (
            <StateMessage
              variant="error"
              title="Couldn't load reviews"
              description={
                <>
                  Make sure the Strapi server is running and reachable.
                  <span className="mt-2 block font-mono text-xs opacity-75">{error.message}</span>
                </>
              }
              action={
                <button type="button" onClick={() => refetch()} className="btn-primary">
                  Try again
                </button>
              }
            />
          ) : !current ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <ReviewCardSkeleton key={i} />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <StateMessage
              title="No reviews found"
              description={
                hasFilters
                  ? "Try a different search term or category."
                  : "Nothing has been published yet. Add your first review in the Strapi admin panel."
              }
              action={
                hasFilters && (
                  <button type="button" onClick={clearFilters} className="btn-secondary">
                    Clear filters
                  </button>
                )
              }
            />
          ) : (
            <div
              className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
                isRefetching ? "pointer-events-none opacity-60" : ""
              }`}
              aria-busy={isRefetching}
            >
              {reviews.map((review) => (
                <div key={review.documentId} className="flex animate-fade-in [&>*]:flex-1">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          )}
        </div>

        {pageInfo && (
          <div className="mt-12">
            <Pagination page={page} pageCount={pageInfo.pageCount} onChange={goToPage} />
          </div>
        )}
      </section>
    </>
  );
};

export default Homepage;
