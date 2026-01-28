import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_REVIEWS } from "../graphql/queries";
import { Review } from "../types/review";

const Homepage = () => {
  const { loading, error, data } = useQuery<{ reviews: Review[] }>(GET_REVIEWS);

  if (loading) return <p className="status">Loading latest reviews...</p>;
  if (error) return <p className="status error">Error: {error.message}</p>;

  const reviews = data?.reviews || [];

  return (
    <div className="homepage">
      <h1>Latest Reviews</h1>
      <div className="reviews-grid">
        {reviews.map((review) => {
          const previewText = review.body?.[0]?.children?.[0]?.text || "";

          return (
            <div key={review.documentId} className="review-card">
              <div className="rating-badge">{review.rating}</div>
              <h2>{review.title}</h2>
              <p>
                {previewText.length > 300
                  ? `${previewText.substring(0, 300)}...`
                  : previewText}
              </p>
              <Link to={`/details/${review.documentId}`} className="read-more">
                Read full review
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Homepage;
