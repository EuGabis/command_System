"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import Icon from "./Icon";

interface ProfileData {
  nome: string;
  empresa: string;
  marca: string;
  avatar_url: string | null;
}

export default function ProfileForm({
  userId,
  email: emailInicial,
  initial,
}: {
  userId: string;
  email: string;
  initial: ProfileData;
}) {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [data, setData] = useState<ProfileData>(initial);
  const [email, setEmail] = useState(emailInicial);
  const [novaSenha, setNovaSenha] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(initial.avatar_url);
  const [msg, setMsg] = useState<{ t: "ok" | "err"; s: string } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  function set<K extends keyof ProfileData>(k: K, v: ProfileData[K]) {
    setData({ ...data, [k]: v });
  }

  async function salvarDados() {
    setLoading("dados");
    setMsg(null);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        nome: data.nome,
        empresa: data.empresa,
        marca: data.marca,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setMsg({ t: "ok", s: "Dados do perfil salvos." });
      router.refresh();
    } catch (e) {
      setMsg({ t: "err", s: String(e) });
    } finally {
      setLoading(null);
    }
  }

  async function salvarEmail() {
    setLoading("email");
    setMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      setMsg({ t: "ok", s: "Email atualizado. Verifique sua caixa de entrada se for pedida confirmação." });
    } catch (e) {
      setMsg({ t: "err", s: String(e) });
    } finally {
      setLoading(null);
    }
  }

  async function salvarSenha() {
    if (novaSenha.length < 8) {
      setMsg({ t: "err", s: "A senha deve ter no mínimo 8 caracteres." });
      return;
    }
    setLoading("senha");
    setMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
      if (error) throw error;
      setNovaSenha("");
      setMsg({ t: "ok", s: "Senha alterada com sucesso." });
    } catch (e) {
      setMsg({ t: "err", s: String(e) });
    } finally {
      setLoading(null);
    }
  }

  async function uploadAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading("avatar");
    setMsg(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${pub.publicUrl}?t=${Date.now()}`;
      const { error: dbErr } = await supabase
        .from("profiles")
        .upsert({ id: userId, avatar_url: url, updated_at: new Date().toISOString() });
      if (dbErr) throw dbErr;
      setAvatarUrl(url);
      setMsg({ t: "ok", s: "Avatar atualizado." });
      router.refresh();
    } catch (e) {
      setMsg({ t: "err", s: String(e) });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {msg && (
        <div
          className="card"
          style={{
            borderColor: msg.t === "ok" ? "var(--green)" : "var(--red)",
            color: msg.t === "ok" ? "var(--green)" : "var(--red)",
            fontSize: 14,
          }}
        >
          {msg.s}
        </div>
      )}

      <div className="card">
        <strong>Foto de perfil</strong>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="avatar"
              style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--panel-2)",
                border: "1px solid var(--border)",
                display: "grid",
                placeItems: "center",
                color: "var(--muted)",
              }}
            >
              <Icon name="user" size={30} />
            </div>
          )}
          <label className="btn secondary" style={{ cursor: "pointer" }}>
            {loading === "avatar" ? "Enviando..." : "Trocar foto"}
            <input type="file" accept="image/*" onChange={uploadAvatar} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      <div className="card">
        <strong>Dados pessoais</strong>
        <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
          <div>
            <label className="label">Nome de exibição</label>
            <input className="input" value={data.nome} onChange={(e) => set("nome", e.target.value)} />
          </div>
        </div>
        <button className="btn" style={{ marginTop: 14 }} onClick={salvarDados} disabled={loading === "dados"}>
          {loading === "dados" ? "Salvando..." : "Salvar nome"}
        </button>
      </div>

      <div className="card">
        <strong>Email</strong>
        <div style={{ marginTop: 14 }}>
          <label className="label">Endereço de email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="btn" style={{ marginTop: 14 }} onClick={salvarEmail} disabled={loading === "email"}>
          {loading === "email" ? "Salvando..." : "Atualizar email"}
        </button>
      </div>

      <div className="card">
        <strong>Trocar senha</strong>
        <div style={{ marginTop: 14 }}>
          <label className="label">Nova senha (mín. 8 caracteres)</label>
          <input
            className="input"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
        </div>
        <button className="btn" style={{ marginTop: 14 }} onClick={salvarSenha} disabled={loading === "senha"}>
          {loading === "senha" ? "Salvando..." : "Alterar senha"}
        </button>
      </div>

      <div className="card">
        <strong>Dados do negócio</strong>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
          Usados como contexto no atendimento da IA.
        </p>
        <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
          <div>
            <label className="label">Nome da empresa</label>
            <input className="input" value={data.empresa} onChange={(e) => set("empresa", e.target.value)} />
          </div>
          <div>
            <label className="label">Marca / nome fantasia</label>
            <input className="input" value={data.marca} onChange={(e) => set("marca", e.target.value)} />
          </div>
        </div>
        <button className="btn" style={{ marginTop: 14 }} onClick={salvarDados} disabled={loading === "dados"}>
          {loading === "dados" ? "Salvando..." : "Salvar dados do negócio"}
        </button>
      </div>
    </div>
  );
}
