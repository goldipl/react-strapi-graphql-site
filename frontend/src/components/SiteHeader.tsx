import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { SITE_NAME } from "../config";
import useTheme from "../hooks/useTheme";
import SearchDialog from "./SearchDialog";
import { CloseIcon, LogoIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from "./icons";

const NAV_LINKS = [
  { to: "/", label: "Reviews", end: true },
  { to: "/?sort=rating%3Adesc", label: "Top rated", end: false },
  { to: "/about", label: "About", end: false },
];

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

const SiteHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  // Global ⌘K / Ctrl+K shortcut to open search.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // NavLink can't compare query strings, so "Top rated" vs "Reviews" is resolved here.
  const isLinkActive = (to: string) => {
    const [pathname, search = ""] = to.split("?");
    if (pathname !== location.pathname) return false;
    const sort = new URLSearchParams(location.search).get("sort");
    const linkSort = new URLSearchParams(search).get("sort");
    return pathname === "/" ? sort === linkSort : true;
  };

  const linkClass = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "text-slate-900 dark:text-white"
        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/80">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm transition-transform group-hover:scale-105">
              <LogoIcon className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              {SITE_NAME}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.end}
                className={() => linkClass(isLinkActive(link.to))}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 transition-colors hover:border-slate-300 hover:bg-white sm:flex dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <SearchIcon className="h-4 w-4" />
              <span className="flex-1 text-left">Search reviews…</span>
              <kbd className="rounded border border-slate-200 bg-white px-1.5 font-sans text-[10px] font-medium dark:border-slate-700 dark:bg-slate-800">
                {isMac ? "⌘" : "Ctrl"} K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="btn-ghost h-9 w-9 p-0 sm:hidden"
              aria-label="Search reviews"
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="btn-ghost h-9 w-9 p-0"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="btn-ghost h-9 w-9 p-0 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-menu"
            className="border-t border-slate-200/70 px-4 py-3 animate-fade-in md:hidden dark:border-slate-800/70"
            aria-label="Mobile"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`block ${linkClass(isLinkActive(link.to))} ${
                  isLinkActive(link.to) ? "bg-slate-100 dark:bg-slate-800" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default SiteHeader;
