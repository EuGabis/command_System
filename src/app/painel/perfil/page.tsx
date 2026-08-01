import { getSessionUser, supabaseServer } from "@/lib/supabaseServer";
import ProfileForm from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const user = await getSessionUser();
  const supabase = await supabaseServer();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Perfil</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Gerencie seus dados de acesso e as informações do negócio usadas pela IA.
      </p>
      <ProfileForm
        userId={user!.id}
        email={user!.email ?? ""}
        initial={{
          nome: profile?.nome ?? "",
          empresa: profile?.empresa ?? "",
          marca: profile?.marca ?? "",
          avatar_url: profile?.avatar_url ?? null,
        }}
      />
    </div>
  );
}
