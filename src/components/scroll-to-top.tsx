"use client";

import { ArrowUpCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      setShow(scrollProgress > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="right-4 bottom-4 fixed flex bg-primary/80 shadow-md backdrop-blur-sm p-2 rounded-full transition-all group"
      aria-label="Scroll to top"
    >
      <ArrowUpCircle className="w-6 h-6 text-background" />
      <span className="group-hover:w-12 opacity-0 group-hover:opacity-100 w-0 text-background whitespace-nowrap transition-[width] duration-200 overflow-hidden">
        Top
      </span>
    </button>
  );
}
