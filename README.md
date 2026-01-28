Based on the project name and the schema information you provided, here is a professional `README.md` file tailored for your **React + Strapi 5 + GraphQL** project.

It includes setup instructions, API configuration, and the specific GraphQL structure for your `review` collection.

---

# React Strapi GraphQL Site

A modern full-stack web application built with **React** on the frontend and **Strapi 5** as the headless CMS, using **GraphQL** for efficient data fetching.

## 🚀 Features

- **Strapi 5 Backend:** Leverages the latest Strapi features like `documentId`.
- **GraphQL API:** Optimized queries using Apollo Client or similar tools.
- **Dynamic Reviews:** Manage and display game or product reviews dynamically.
- **Blocks Content:** Support for Strapi 5's new "Blocks" (Rich Text) field type.

---

## 🛠️ Tech Stack

- **Frontend:** [React.js](https://reactjs.org/)
- **Backend:** [Strapi 5](https://strapi.io/)
- **API:** [GraphQL](https://graphql.org/)
- **Database:** SQLite (default) / PostgreSQL

---

## 📦 Getting Started

### 1. Prerequisites

- **Node.js:** v18 or v20+
- **NPM** or **Yarn**

### 2. Backend Setup (Strapi)

Navigate to your strapi directory:

```bash
cd backend
npm install
npm run develop

```

- **Permissions:** Go to `Settings > Users & Permissions Plugin > Roles > Public`.
- **Enable Review API:** Find the **Review** collection and enable `find` and `findOne`.
- **GraphQL Plugin:** Ensure the GraphQL plugin is installed (`npm install @strapi/plugin-graphql`).

### 3. Frontend Setup (React)

Navigate to your react directory:

```bash
cd frontend
npm install
npm start

```

---

## 📑 Schema: Review

The project uses a `review` collection type with the following attributes:

| Field    | Type    | Description                          |
| -------- | ------- | ------------------------------------ |
| `title`  | String  | Unique title of the review.          |
| `rating` | Integer | Rating from 1 to 10.                 |
| `body`   | Blocks  | Rich text content (Strapi 5 Blocks). |

---

## 📡 GraphQL Examples

### Fetch All Reviews

In Strapi 5, the GraphQL structure is flattened. Use this query to fetch your data:

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

### Fetch a Single Review by Document ID

```graphql
query GetReview($docId: ID!) {
  review(documentId: $docId) {
    title
    rating
    body
  }
}
```

---

## 🔧 Environment Variables

Create a `.env` file in your React root directory:

```env
REACT_APP_BACKEND_URL=http://localhost:1337
REACT_APP_GRAPHQL_ENDPOINT=http://localhost:1337/graphql

```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Project Link:** [https://github.com/goldipl/react-strapi-graphql-site](https://github.com/goldipl/react-strapi-graphql-site)
