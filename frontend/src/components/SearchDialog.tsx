import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { SEARCH_REVIEWS } from "../graphql/queries";
import useDebounce from "../hooks/useDebounce";
import { Category } from "../types/review";
import { RatingBadge } from "./RatingBadge";
import { ArrowRightIcon, SearchIcon } from "./icons";

interface SearchResult {
  documentId: string;
  title: string;
  rating: number;
  categories: Pick<Category, "documentId" | "name">[];
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const MIN_QUERY_LENGTH = 2;

const SearchDialog = ({ open, onClose }: SearchDialogProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const debouncedQuery = useDebounce(query.trim(), 250);

  const { data, loading } = useQuery<{ reviews: SearchResult[] }>(SEARCH_REVIEWS, {
    variables: { query: debouncedQuery },
    skip: !open || debouncedQuery.length < MIN_QUERY_LENGTH,
  });

  const results = debouncedQuery.length >= MIN_QUERY_LENGTH ? data?.reviews ?? [] : [];

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => setActiveIndex(0), [debouncedQuery]);

  if (!open) return null;

  const goTo = (documentId: string) => {
    onClose();
    navigate(`/reviews/${documentId}`);
  };

  const showAllResults = () => {
    onClose();
    navigate(`/?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (results[activeIndex]) goTo(results[activeIndex].documentId);
      else if (query.trim()) showAllResults();
    } else if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search reviews"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in dark:bg-black/60"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-scale-in dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-slate-800">
          <SearchIcon className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search reviews by title…"
            className="h-14 w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
            aria-controls="search-results"
            aria-activedescendant={results[activeIndex] ? `search-result-${activeIndex}` : undefined}
            role="combobox"
            aria-expanded={results.length > 0}
          />
          <kbd className="hidden rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block dark:border-slate-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length < MIN_QUERY_LENGTH ? (
            <p className="px-4 py-10 text-center text-sm text-slate-500">
              Type at least {MIN_QUERY_LENGTH} characters to search.
            </p>
          ) : loading && results.length === 0 ? (
            <div className="space-y-2 p-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-12" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-slate-500">
              No reviews match “{query.trim()}”.
            </p>
          ) : (
            <ul id="search-results" role="listbox" className="p-2">
              {results.map((result, index) => (
                <li
                  key={result.documentId}
                  id={`search-result-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <button
                    type="button"
                    onClick={() => goTo(result.documentId)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      index === activeIndex ? "bg-slate-100 dark:bg-slate-800" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {result.title}
                      </p>
                      {result.categories.length > 0 && (
                        <p className="truncate text-xs text-slate-500">
                          {result.categories.map((c) => c.name).join(" · ")}
                        </p>
                      )}
                    </div>
                    <RatingBadge rating={result.rating} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {query.trim().length >= MIN_QUERY_LENGTH && (
          <button
            type="button"
            onClick={showAllResults}
            className="flex w-full items-center justify-between border-t border-slate-100 px-4 py-3 text-sm font-medium text-brand-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-brand-400 dark:hover:bg-slate-800/50"
          >
            See all results for “{query.trim()}”
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchDialog;
