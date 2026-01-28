# React Strapi 5 GraphQL Reviews

A modern, type-safe review site built with **React** and **TypeScript**. This project fetches content from **Strapi 5** using **GraphQL** for optimized data delivery.

## 📂 Project Structure

```text
src/
├── graphql/
│   └── queries.ts       # Centralized GraphQL query definitions
├── types/
│   └── review.ts        # TypeScript interfaces for Review data
├── pages/
│   ├── Homepage.tsx      # Review listing with content snippets
│   └── ReviewDetails.tsx # Full review view by documentId
├── hooks/
│   └── useFetch.ts       # Utility for standard REST fetching
└── index.tsx            # Apollo Client and Provider configuration

```

## 🚀 Features

- **Strapi 5 Document Service:** Uses `documentId` for stable, SEO-friendly routing.
- **Apollo Client Integration:** Efficient data fetching with built-in caching.
- **Type-Safe Schema:** Full TypeScript support for Strapi's "Blocks" (JSON) content.
- **GraphQL API:** Requests only the fields required, reducing payload size.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, React Router 6
- **API Client:** Apollo Client (GraphQL)
- **Backend:** [Strapi 5](https://strapi.io/)
- **Content:** Strapi Blocks (Rich Text)

---

## 📦 Getting Started

### 1. Backend Setup (Strapi)

1. Ensure you have the GraphQL plugin installed in your Strapi directory:

```bash
npm install @strapi/plugin-graphql

```

2. Run the develop server:

```bash
npm run develop

```

3. **Permissions:** In the Strapi Admin, go to `Settings > Roles > Public`. Enable **find** and **findOne** for the **Review** collection.

### 2. Frontend Setup (React)

1. Install dependencies:

```bash
npm install

```

2. Start the development server:

```bash
npm start

```

---

## 📑 GraphQL Schema Summary

The project interacts with the following `Review` schema:

| Field        | Type    | Description                             |
| ------------ | ------- | --------------------------------------- |
| `documentId` | ID!     | The unique identifier for the document. |
| `title`      | String! | Review title.                           |
| `rating`     | Int!    | Numeric score.                          |
| `body`       | JSON!   | Strapi Blocks rich text data.           |

---

## 📡 Example Query

Data is fetched using the following query structure in `src/graphql/queries.ts`:

```graphql
query GetReviews {
  reviews {
    documentId
    title
    rating
    body
  }
}
```

---

## 🔧 Scripts

- `npm start`: Runs the app in development mode.
- `npm run build`: Optimizes the app for production.
- `npm test`: Launches the test runner.

## 📄 License

Distributed under the MIT License.

---

**Project Link:** [https://github.com/goldipl/react-strapi-graphql-site](https://github.com/goldipl/react-strapi-graphql-site)

Would you like me to add a **Troubleshooting** section to the README to cover the common fixes we found for Apollo Client imports and TypeScript config?
