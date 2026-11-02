import { useEffect, useState } from "react";

/** Thin bar under the sticky header that tracks how far the page has been scrolled. */
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const max = scrollHeight - clientHeight;
        setProgress(max > 0 ? Math.min(1, scrollTop / max) : 0);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-16 z-40 h-0.5" aria-hidden="true">
      <div
        className="h-full origin-left bg-gradient-to-r from-brand-500 to-fuchsia-500"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
};

export default ReadingProgress;
