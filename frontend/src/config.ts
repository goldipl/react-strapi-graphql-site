export const SITE_NAME = "Critique";
export const SITE_TAGLINE = "Honest reviews, zero fluff.";

export const STRAPI_URL = (
  process.env.REACT_APP_STRAPI_URL || "http://localhost:1337"
).replace(/\/$/, "");

export const GRAPHQL_URL = `${STRAPI_URL}/graphql`;

export const REVIEWS_PER_PAGE = 9;
