import { getRatingLabel, getRatingTone, RatingTone } from "../lib/format";
import { StarIcon } from "./icons";

const toneClasses: Record<RatingTone, string> = {
  excellent:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  good: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-400 dark:ring-sky-400/20",
  mixed:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20",
  poor: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-400/20",
};

const barClasses: Record<RatingTone, string> = {
  excellent: "bg-emerald-500",
  good: "bg-sky-500",
  mixed: "bg-amber-500",
  poor: "bg-rose-500",
};

const starClasses: Record<RatingTone, string> = {
  excellent: "text-emerald-500",
  good: "text-sky-500",
  mixed: "text-amber-500",
  poor: "text-rose-500",
};

interface RatingBadgeProps {
  rating: number;
  className?: string;
  /** Solid surface for placing the badge over images. */
  overlay?: boolean;
}

/** Compact pill, used on cards and in lists. */
export const RatingBadge = ({ rating, className = "", overlay = false }: RatingBadgeProps) => {
  const tone = getRatingTone(rating);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${
        overlay
          ? "bg-white/95 text-slate-900 shadow-sm dark:bg-slate-900/90 dark:text-white"
          : `ring-1 ring-inset ${toneClasses[tone]}`
      } ${className}`}
      title={`${getRatingLabel(rating)} — ${rating} out of 10`}
    >
      <StarIcon className={`h-3.5 w-3.5 ${overlay ? starClasses[tone] : ""}`} />
      {rating}
      <span className="sr-only"> out of 10</span>
    </span>
  );
};

/** Large score panel, used on the review page. */
export const RatingScore = ({ rating }: { rating: number }) => {
  const tone = getRatingTone(rating);

  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl ring-1 ring-inset ${toneClasses[tone]}`}
      >
        <span className="font-display text-2xl font-extrabold leading-none tabular-nums">
          {rating}
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider opacity-70">
          / 10
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {getRatingLabel(rating)}
        </p>
        <div
          className="mt-2 h-1.5 w-40 max-w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={rating}
          aria-label="Rating"
        >
          <div
            className={`h-full rounded-full ${barClasses[tone]}`}
            style={{ width: `${rating * 10}%` }}
          />
        </div>
      </div>
    </div>
  );
};
