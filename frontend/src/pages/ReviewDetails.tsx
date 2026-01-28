import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useFetch(
    `http://localhost:1337/api/reviews/${id}`,
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading review!</p>;

  const review = data;

  return (
    <div className="review-details">
      <div className="rating-badge">{review?.rating}</div>
      <h1>{review?.title}</h1>

      <div className="content">
        {review?.body?.map((block: any, index: number) => (
          <p key={index}>{block.children?.[0]?.text}</p>
        ))}
      </div>

      {/* --- Back Button --- */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Go Back
      </button>
    </div>
  );
};

export default ReviewDetails;
