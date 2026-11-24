"use client";

import { useEffect } from "react";

/** Flags <html data-scrolled> once the page has scrolled, so the header can get a white blur. */
export default function NavScrollState() {
  useEffect(() => {
    const html = document.documentElement;
    const update = () => {
      if (window.scrollY > 8) html.dataset.scrolled = "1";
      else delete html.dataset.scrolled;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      delete html.dataset.scrolled;
    };
  }, []);
  return null;
}
