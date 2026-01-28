import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Review } from "../types/review";

const ReviewDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    loading,
    error,
    data: review,
  } = useFetch<Review>(`http://localhost:1337/api/reviews/${id}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading review!</p>;

  return (
    <div className="review-details">
      <div className="rating-badge">{review?.rating}</div>
      <h1>{review?.title}</h1>

      <div className="content">
        {review?.body?.map((block: any, index: number) => (
          <p key={index}>{block.children?.[0]?.text}</p>
        ))}
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Go Back
      </button>
    </div>
  );
};

export default ReviewDetails;
