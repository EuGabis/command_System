"use client";

import { useEffect, useRef } from "react";

const LINKS = [
  { href: "#top", label: "Início" },
  { href: "#servicos", label: "Serviços" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#orcamento", label: "Orçamento" },
  { href: "#contato", label: "Contato" },
];

// Menu hambúrguer do site. Fecha ao clicar fora, ao escolher um link ou com ESC.
export default function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = ref.current;
      if (el?.open && !el.contains(e.target as Node)) el.open = false;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && ref.current) ref.current.open = false;
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const close = () => {
    if (ref.current) ref.current.open = false;
  };

  return (
    <details className="g-menu" ref={ref}>
      <summary aria-label="Menu">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </summary>
      <div className="g-menu-panel">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={close}>{l.label}</a>
        ))}
      </div>
    </details>
  );
}
