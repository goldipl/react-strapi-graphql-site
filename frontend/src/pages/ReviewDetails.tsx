import { useParams, useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Review } from "../types/review";

const GET_REVIEW_DETAILS = gql`
  query GetReviewDetails($id: ID!) {
    review(documentId: $id) {
      documentId
      title
      rating
      body
    }
  }
`;

const ReviewDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery<{ review: Review }>(
    GET_REVIEW_DETAILS,
    {
      variables: { id },
      skip: !id,
    },
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading review: {error.message}
      </div>
    );

  const review = data?.review;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors group"
      >
        <svg
          className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to reviews
      </button>

      {/* Header Section */}
      <header className="mb-10">
        <div className="inline-block bg-indigo-600 text-white font-bold px-4 py-1 rounded-lg mb-4">
          Rating: {review?.rating} / 10
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          {review?.title}
        </h1>
      </header>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
        {review?.body?.map((block: any, index: number) => (
          <p key={index} className="text-xl">
            {block.children?.[0]?.text}
          </p>
        ))}
      </div>

      {/* Bottom Divider */}
      <div className="mt-16 pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm italic">
          Thanks for reading this review!
        </p>
      </div>
    </article>
  );
};

export default ReviewDetails;
