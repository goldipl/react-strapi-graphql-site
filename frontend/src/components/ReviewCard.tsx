import { Link } from "react-router-dom";
import { formatDate, getExcerpt, getReadingTime } from "../lib/format";
import { Review } from "../types/review";
import CoverImage from "./CoverImage";
import { RatingBadge } from "./RatingBadge";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const publishedAt = formatDate(review.publishedAt);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-[16/9] overflow-hidden">
        <CoverImage
          cover={review.cover}
          title={review.title}
          className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
        />
        <RatingBadge rating={review.rating} overlay className="absolute right-3 top-3 backdrop-blur" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {review.categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
            {review.categories.map((category) => (
              <span
                key={category.documentId}
                className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-lg font-bold leading-snug">
          <Link
            to={`/reviews/${review.documentId}`}
            className="transition-colors after:absolute after:inset-0 group-hover:text-brand-600 dark:group-hover:text-brand-400"
          >
            {review.title}
          </Link>
        </h2>

        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {getExcerpt(review.body)}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
          <span>
            {publishedAt && <time dateTime={review.publishedAt ?? undefined}>{publishedAt}</time>}
            {publishedAt && " · "}
            {getReadingTime(review.body)} min read
          </span>
          <span className="font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5 dark:text-brand-400">
            Read →
          </span>
        </div>
      </div>
    </article>
  );
};

export const ReviewCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div className="skeleton aspect-[16/9] rounded-none" />
    <div className="space-y-3 p-5">
      <div className="skeleton h-3 w-20" />
      <div className="skeleton h-5 w-3/4" />
      <div className="space-y-2 pt-1">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
      </div>
      <div className="skeleton mt-4 h-3 w-1/3" />
    </div>
  </div>
);

export default ReviewCard;
