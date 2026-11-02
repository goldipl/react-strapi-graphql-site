import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_RELATED_REVIEWS, GET_REVIEW_DETAILS } from "../graphql/queries";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { formatDate, getReadingTime } from "../lib/format";
import { Review } from "../types/review";
import BlocksRenderer from "../components/BlocksRenderer";
import CoverImage from "../components/CoverImage";
import { RatingScore } from "../components/RatingBadge";
import ReadingProgress from "../components/ReadingProgress";
import ReviewCard from "../components/ReviewCard";
import ShareButton from "../components/ShareButton";
import StateMessage from "../components/StateMessage";
import { ArrowLeftIcon, CalendarIcon, ChevronRightIcon, ClockIcon } from "../components/icons";

const DetailsSkeleton = () => (
  <div className="container-page max-w-3xl py-10" aria-busy="true" aria-label="Loading review">
    <div className="skeleton h-4 w-48" />
    <div className="skeleton mt-8 h-4 w-24" />
    <div className="skeleton mt-4 h-10 w-3/4" />
    <div className="skeleton mt-4 h-4 w-56" />
    <div className="skeleton mt-8 aspect-[16/9] w-full rounded-2xl" />
    <div className="mt-10 space-y-3">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className={`skeleton h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  </div>
);

const RelatedReviews = ({ review }: { review: Review }) => {
  const slugs = review.categories.map((category) => category.slug);

  const { data } = useQuery<{ reviews: Review[] }>(GET_RELATED_REVIEWS, {
    variables: {
      filters: {
        documentId: { ne: review.documentId },
        ...(slugs.length > 0 && { categories: { slug: { in: slugs } } }),
      },
    },
  });

  const related = data?.reviews ?? [];
  if (related.length === 0) return null;

  return (
    <section className="border-t border-slate-200 pt-12 dark:border-slate-800" aria-labelledby="related-heading">
      <div className="flex items-end justify-between">
        <h2 id="related-heading" className="text-2xl font-bold">
          {slugs.length > 0 ? "More like this" : "You might also like"}
        </h2>
        <Link
          to="/"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          All reviews →
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <ReviewCard key={item.documentId} review={item} />
        ))}
      </div>
    </section>
  );
};

const ReviewDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { loading, error, data, refetch } = useQuery<{ review: Review | null }>(
    GET_REVIEW_DETAILS,
    { variables: { id }, skip: !id },
  );

  const review = data?.review;
  useDocumentTitle(review?.title ?? (loading ? "Loading…" : "Review not found"));

  if (loading && !review) return <DetailsSkeleton />;

  if (error)
    return (
      <StateMessage
        variant="error"
        title="Couldn't load this review"
        description={error.message}
        action={
          <div className="flex gap-3">
            <Link to="/" className="btn-secondary">
              Back to reviews
            </Link>
            <button type="button" onClick={() => refetch()} className="btn-primary">
              Try again
            </button>
          </div>
        }
      />
    );

  if (!review)
    return (
      <StateMessage
        title="Review not found"
        description="It may have been unpublished or the link is incorrect."
        action={
          <Link to="/" className="btn-primary">
            Browse all reviews
          </Link>
        }
      />
    );

  const publishedAt = formatDate(review.publishedAt);
  const primaryCategory = review.categories[0];

  return (
    <>
      <ReadingProgress />

      <article className="container-page max-w-3xl pt-8 animate-fade-in">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white">
                <ArrowLeftIcon className="h-4 w-4" />
                Reviews
              </Link>
            </li>
            {primaryCategory && (
              <li className="flex items-center gap-1.5">
                <ChevronRightIcon className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                <Link
                  to={`/?category=${primaryCategory.slug}`}
                  className="hover:text-slate-900 dark:hover:text-white"
                >
                  {primaryCategory.name}
                </Link>
              </li>
            )}
            <li className="flex min-w-0 items-center gap-1.5">
              <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-slate-300 dark:text-slate-600" />
              <span aria-current="page" className="max-w-[16rem] truncate text-slate-900 dark:text-slate-200">
                {review.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mt-8">
          {review.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {review.categories.map((category) => (
                <Link
                  key={category.documentId}
                  to={`/?category=${category.slug}`}
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 transition-colors hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {review.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            {publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={review.publishedAt ?? undefined}>{publishedAt}</time>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              {getReadingTime(review.body)} min read
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
            <RatingScore rating={review.rating} />
            <ShareButton title={review.title} />
          </div>
        </header>

        {review.cover && (
          <CoverImage
            cover={review.cover}
            title={review.title}
            eager
            className="mt-10 aspect-[16/9] w-full rounded-2xl shadow-card"
          />
        )}

        {/* Body */}
        <div className="mt-10">
          <BlocksRenderer content={review.body ?? []} />
        </div>

        {/* Verdict */}
        <aside className="mt-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-lg sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">The verdict</p>
          <div className="mt-3 flex items-end justify-between gap-6">
            <p className="font-display text-2xl font-bold text-white">{review.title}</p>
            <p className="shrink-0 font-display text-5xl font-extrabold tabular-nums leading-none text-white">
              {review.rating}
              <span className="text-xl font-semibold text-brand-200">/10</span>
            </p>
          </div>
        </aside>
      </article>

      <div className="container-page mt-20">
        <RelatedReviews review={review} />
      </div>
    </>
  );
};

export default ReviewDetails;
