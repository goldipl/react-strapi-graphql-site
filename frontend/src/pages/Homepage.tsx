import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_REVIEWS } from "../graphql/queries";
import { Review } from "../types/review";

const Homepage = () => {
  const { loading, error, data } = useQuery<{ reviews: Review[] }>(GET_REVIEWS);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500 animate-pulse font-medium">
          Loading latest reviews...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );

  const reviews = data?.reviews || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
        Latest <span className="text-indigo-600">Reviews</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => {
          const previewText = review.body?.[0]?.children?.[0]?.text || "";

          return (
            <div
              key={review.documentId}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-sm">
                ⭐ {review.rating}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                {review.title}
              </h2>

              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                {previewText.length > 200
                  ? `${previewText.substring(0, 200)}...`
                  : previewText}
              </p>

              <Link
                to={`/details/${review.documentId}`}
                className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
              >
                Read full review
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Homepage;
