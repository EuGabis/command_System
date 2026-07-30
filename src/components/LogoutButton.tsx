"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import Icon from "./Icon";

export default function LogoutButton() {
  const router = useRouter();
  async function sair() {
    await supabaseBrowser().auth.signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <button onClick={sair} className="logout-btn" title="Sair">
      <span className="nav-ico"><Icon name="logout" size={19} /></span>
      <span className="nav-text">Sair</span>
    </button>
  );
}
