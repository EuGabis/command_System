"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const FLAG = "gaab_sess";
const IDLE_MS = 15 * 60_000; // 15 min sem atividade
const HIDDEN_MS = 90_000; //     90 s com a aba oculta

// Segurança de sessão:
// - Encerra ao fechar a guia (o sessionStorage é limpo pelo navegador).
// - Encerra por inatividade ou quando a aba fica oculta por um tempo.
export default function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    let idle: ReturnType<typeof setTimeout>;
    let hidden: ReturnType<typeof setTimeout> | undefined;
    let saindo = false;

    async function sair() {
      if (saindo) return;
      saindo = true;
      try { sessionStorage.removeItem(FLAG); } catch {}
      try { await supabaseBrowser().auth.signOut(); } catch {}
      router.replace("/login");
    }

    // Guia nova/reaberta (sem a flag desta sessão) → encerra.
    let temFlag = false;
    try { temFlag = sessionStorage.getItem(FLAG) === "1"; } catch {}
    if (!temFlag) {
      void sair();
      return;
    }

    function resetIdle() {
      clearTimeout(idle);
      idle = setTimeout(() => void sair(), IDLE_MS);
    }
    function onVisibility() {
      if (document.hidden) {
        hidden = setTimeout(() => void sair(), HIDDEN_MS);
      } else {
        if (hidden) clearTimeout(hidden);
        resetIdle();
      }
    }

    const eventos = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    eventos.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);
    resetIdle();

    return () => {
      eventos.forEach((e) => window.removeEventListener(e, resetIdle));
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(idle);
      if (hidden) clearTimeout(hidden);
    };
  }, [router]);

  return null;
}
