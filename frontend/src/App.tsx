import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";

import About from "./pages/About";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import ReviewDetails from "./pages/ReviewDetails";

/** Resets scroll position when navigating to a different page (but not on filter changes). */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }), [pathname]);
  return null;
};

/** Keeps old `/details/:id` links working. */
const LegacyDetailsRedirect = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/reviews/${id}`} replace />;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/reviews/:id" element={<ReviewDetails />} />
            <Route path="/details/:id" element={<LegacyDetailsRedirect />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </Router>
  );
}

export default App;
