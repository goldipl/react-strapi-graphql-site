import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Page not found");

  return (
    <div className="container-page flex flex-col items-center py-24 text-center animate-fade-in">
      <p className="bg-gradient-to-r from-brand-600 to-fuchsia-500 bg-clip-text font-display text-7xl font-extrabold text-transparent">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold">This page doesn't exist</h1>
      <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
        The link may be broken, or the page may have been moved.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to reviews
      </Link>
    </div>
  );
};

export default NotFound;
