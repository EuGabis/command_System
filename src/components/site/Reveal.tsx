"use client";

import { useEffect, useRef, useState } from "react";

// Revela o conteúdo com fade/slide quando entra na viewport.
const HIDDEN: Record<string, string> = {
  up: "translateY(16px)",
  left: "translateX(-40px)",
  right: "translateX(40px)",
};

export default function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "up" | "left" | "right";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVis(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`g-reveal${vis ? " in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, transform: vis ? undefined : HIDDEN[from] }}
    >
      {children}
    </div>
  );
}
