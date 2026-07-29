"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LogoutButton() {
  const router = useRouter();
  async function sair() {
    await supabaseBrowser().auth.signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      onClick={sair}
      className="btn secondary"
      style={{ width: "100%", fontSize: 13, padding: "8px 12px" }}
    >
      Sair
    </button>
  );
}
