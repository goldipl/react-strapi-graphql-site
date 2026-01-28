import { gql } from "@apollo/client";

export const GET_REVIEWS = gql`
  query GetReviews {
    reviews {
      documentId
      title
      rating
      body
    }
  }
`;

export const GET_REVIEW_DETAILS = gql`
  query GetReview($id: ID!) {
    review(documentId: $id) {
      documentId
      title
      rating
      body
    }
  }
`;
