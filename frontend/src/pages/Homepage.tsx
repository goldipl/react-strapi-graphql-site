import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Review } from "../types/review";

const Homepage = () => {
  const {
    loading,
    error,
    data: reviews,
  } = useFetch<Review[]>("http://localhost:1337/api/reviews");

  if (loading) return <p>Loading latest reviews...</p>;
  if (error) return <p>Error fetching reviews.</p>;

  return (
    <div className="homepage">
      <h1>Latest Reviews</h1>

      {reviews &&
        reviews.map((review) => {
          const previewText = review.body?.[0]?.children?.[0]?.text || "";

          return (
            <div key={review.id} className="review-card">
              <div className="rating-badge">{review.rating}</div>
              <h2>{review.title}</h2>

              <p>{previewText.substring(0, 300)}...</p>

              <Link to={`/details/${review.documentId}`} className="read-more">
                Read full review
              </Link>
            </div>
          );
        })}
    </div>
  );
};

export default Homepage;
