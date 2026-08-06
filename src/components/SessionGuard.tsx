"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const FLAG = "gaab_sess";
const IDLE_MS = 30 * 60_000; // 30 min sem atividade

// Segurança de sessão:
// - Encerra ao fechar a guia (o sessionStorage é limpo pelo navegador).
// - Encerra após 30 min de inatividade (inclui aba em segundo plano).
export default function SessionGuard() {
  const router = useRouter();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let last = Date.now();
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

    function reset() {
      last = Date.now();
      clearTimeout(timer);
      timer = setTimeout(() => void sair(), IDLE_MS);
    }
    function onVisibility() {
      // ao voltar pra aba, confere se estourou o tempo (timers em background são throttled)
      if (!document.hidden && Date.now() - last >= IDLE_MS) void sair();
    }

    const eventos = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    eventos.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);
    reset();

    return () => {
      eventos.forEach((e) => window.removeEventListener(e, reset));
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(timer);
    };
  }, [router]);

  return null;
}
