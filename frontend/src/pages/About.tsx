import { Link } from "react-router-dom";
import { SITE_NAME } from "../config";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { RatingBadge } from "../components/RatingBadge";

const SCALE = [
  { rating: 9, label: "9–10 · Outstanding", text: "A genre-defining experience. Clear your schedule." },
  { rating: 8, label: "8 · Great", text: "Excellent, with only minor flaws. Easy recommendation." },
  { rating: 6, label: "6–7 · Good", text: "Solid and enjoyable, but won't change your life." },
  { rating: 4, label: "4–5 · Mixed", text: "Some bright spots, plenty of frustration." },
  { rating: 2, label: "1–3 · Poor", text: "Hard to recommend to anyone. Skip it." },
];

const STACK = [
  { name: "React 19 + TypeScript", text: "Type-safe UI with React Router for client-side navigation." },
  { name: "Apollo Client", text: "GraphQL queries with normalized caching and server-side pagination." },
  { name: "Strapi 5", text: "Headless CMS with Blocks rich text, media and category relations." },
  { name: "Tailwind CSS", text: "Utility-first styling with dark mode and a consistent design scale." },
];

const About = () => {
  useDocumentTitle("About");

  return (
    <div className="container-page max-w-3xl py-16 animate-fade-in">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
        About
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
        How {SITE_NAME} works
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
        Every review is written to answer one question: is this worth your time? We score
        everything on a simple 10-point scale and explain exactly why.
      </p>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Our scoring scale</h2>
        <ul className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {SCALE.map((item) => (
            <li key={item.label} className="flex items-start gap-4 p-5">
              <RatingBadge rating={item.rating} className="mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{item.label}</p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Under the hood</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {STACK.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14">
        <Link to="/" className="btn-primary">
          Start reading
        </Link>
      </div>
    </div>
  );
};

export default About;
