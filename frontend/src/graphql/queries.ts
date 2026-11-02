import { gql } from "@apollo/client";

const REVIEW_FIELDS = gql`
  fragment ReviewFields on Review {
    documentId
    title
    rating
    body
    publishedAt
    cover {
      url
      alternativeText
      width
      height
    }
    categories {
      documentId
      name
      slug
    }
  }
`;

/** Paginated, filterable and sortable review listing. */
export const GET_REVIEWS = gql`
  ${REVIEW_FIELDS}
  query GetReviews(
    $filters: ReviewFiltersInput
    $sort: [String]
    $pagination: PaginationArg
  ) {
    reviews_connection(
      filters: $filters
      sort: $sort
      pagination: $pagination
    ) {
      nodes {
        ...ReviewFields
      }
      pageInfo {
        page
        pageSize
        pageCount
        total
      }
    }
  }
`;

/** Lightweight aggregate data for the homepage hero. */
export const GET_REVIEW_STATS = gql`
  query GetReviewStats {
    reviews_connection(pagination: { limit: 100 }) {
      nodes {
        documentId
        rating
      }
      pageInfo {
        total
      }
    }
  }
`;

export const GET_REVIEW_DETAILS = gql`
  ${REVIEW_FIELDS}
  query GetReview($id: ID!) {
    review(documentId: $id) {
      ...ReviewFields
    }
  }
`;

export const GET_RELATED_REVIEWS = gql`
  ${REVIEW_FIELDS}
  query GetRelatedReviews($filters: ReviewFiltersInput) {
    reviews(filters: $filters, sort: ["rating:desc"], pagination: { limit: 3 }) {
      ...ReviewFields
    }
  }
`;

export const SEARCH_REVIEWS = gql`
  query SearchReviews($query: String!) {
    reviews(
      filters: { title: { containsi: $query } }
      sort: ["rating:desc"]
      pagination: { limit: 6 }
    ) {
      documentId
      title
      rating
      categories {
        documentId
        name
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(sort: ["name:asc"]) {
      documentId
      name
      slug
    }
  }
`;
