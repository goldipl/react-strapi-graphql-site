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
      skip: !id, // Don't run the query if id is missing
    },
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading review: {error.message}</p>;

  const review = data?.review;

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
