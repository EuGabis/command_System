import { redirect } from "next/navigation";
import { getSessionUser, supabaseServer } from "@/lib/supabaseServer";
import AppShell from "@/components/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = await supabaseServer();
  let { data: profile } = await supabase
    .from("profiles")
    .select("nome, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  // Auto-heal: cria a linha de perfil se ela ainda não existir
  // (ex.: conta criada antes do trigger de perfil).
  if (!profile) {
    const nomeInicial = (user.user_metadata?.nome as string) ?? "";
    const { data: novo } = await supabase
      .from("profiles")
      .upsert({ id: user.id, nome: nomeInicial })
      .select("nome, avatar_url")
      .maybeSingle();
    profile = novo ?? null;
  }

  const nome = profile?.nome || user.email || "Conta";

  return (
    <AppShell nome={nome} avatarUrl={profile?.avatar_url ?? null}>
      {children}
    </AppShell>
  );
}
