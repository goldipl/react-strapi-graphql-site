import { Link } from "react-router-dom";
import { SITE_NAME, SITE_TAGLINE } from "../config";
import { GithubIcon, LogoIcon } from "./icons";

const SiteFooter = () => (
  <footer className="mt-24 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
            <LogoIcon className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="font-display font-extrabold text-slate-900 dark:text-white">
            {SITE_NAME}
          </span>
        </Link>
        <p className="mt-2 text-sm text-slate-500">{SITE_TAGLINE}</p>
      </div>

      <div className="flex flex-col gap-3 text-sm text-slate-500 sm:items-end">
        <nav className="flex gap-5" aria-label="Footer">
          <Link to="/" className="hover:text-slate-900 dark:hover:text-white">
            Reviews
          </Link>
          <Link to="/about" className="hover:text-slate-900 dark:hover:text-white">
            About
          </Link>
          <a
            href="https://github.com/goldipl/react-strapi-graphql-site"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </a>
        </nav>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} {SITE_NAME}. Built with React, GraphQL &amp; Strapi 5.
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
