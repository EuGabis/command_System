"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import Icon from "@/components/Icon";

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"carregando" | "login" | "setup">("carregando");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/owner")
      .then((r) => r.json())
      .then((d) => setModo(d.exists ? "login" : "setup"))
      .catch(() => setModo("login"));
  }, []);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password: senha });
      if (error) throw new Error("E-mail ou senha inválidos.");
      try { sessionStorage.setItem("gaab_sess", "1"); } catch {}
      router.push("/painel");
      router.refresh();
    } catch (e) {
      setErro(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  }

  async function criarDono(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha, nome }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password: senha });
      if (error) throw error;
      try { sessionStorage.setItem("gaab_sess", "1"); } catch {}
      router.push("/painel");
      router.refresh();
    } catch (e) {
      setErro(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  }

  const isSetup = modo === "setup";
  const carregando = modo === "carregando";

  return (
    <div className="login">
      {/* ===== Painel-instrumento (esquerda) ===== */}
      <aside className="login-hero">
        <div className="login-scan" />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="brand-logo"><img src="/logo.png" alt="GAABTUR" /></span>
        </div>

        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <h1 className="login-title">
            Comande seu<br />atendimento.
          </h1>
          <p className="login-lead">
            WhatsApp e Instagram num só lugar, com uma inteligência artificial que responde,
            organiza e vende por você — 24 horas.
          </p>
        </div>

        <div className="login-readouts">
          <div className="login-readout">
            <span className="k">Canais</span>
            <span className="v">WhatsApp · Instagram</span>
          </div>
          <div className="login-readout">
            <span className="k">Motor</span>
            <span className="v">IA por canal</span>
          </div>
          <div className="login-readout">
            <span className="k">Status</span>
            <span className="v" style={{ color: "var(--green)" }}>
              <span className="dot live login-pulse" style={{ background: "currentColor" }} />
              Online
            </span>
          </div>
        </div>
      </aside>

      {/* ===== Formulário (direita) ===== */}
      <main className="login-panel">
        <div className="login-form">
          <div className="login-panel-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className="brand-logo"><img src="/logo.png" alt="GAABTUR" /></span>
          </div>

          <div className="eyebrow" style={{ marginBottom: 10 }}>
            {isSetup ? "Primeiro acesso" : "Acesso"}
          </div>
          <h2 style={{ fontSize: 25, fontWeight: 700, margin: "0 0 6px" }}>
            {carregando ? "Inicializando…" : isSetup ? "Criar sua conta" : "Entrar"}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            {carregando
              ? "Verificando o sistema."
              : isSetup
              ? "Defina a conta de administrador que vai comandar o sistema."
              : "Use seu e-mail e senha para acessar o painel."}
          </p>

          {!carregando && (
            <form onSubmit={isSetup ? criarDono : entrar} style={{ display: "grid", gap: 16 }}>
              {isSetup && (
                <div>
                  <label className="label">Seu nome</label>
                  <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
              )}
              <div>
                <label className="label">E-mail</label>
                <input
                  className="input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Senha{isSetup && " · mín. 8 caracteres"}</label>
                <input
                  className="input"
                  type="password"
                  required
                  autoComplete={isSetup ? "new-password" : "current-password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              {erro && <div className="login-error">{erro}</div>}

              <button
                className="btn"
                type="submit"
                disabled={loading}
                style={{ width: "100%", justifyContent: "center", padding: "11px 16px", marginTop: 2 }}
              >
                {loading ? "Aguarde…" : isSetup ? "Criar conta e entrar" : "Entrar"}
                {!loading && <Icon name="arrow" size={16} />}
              </button>
            </form>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 24,
              color: "var(--muted)",
              fontSize: 12.5,
            }}
          >
            <Icon name="lock" size={14} />
            Acesso protegido e credenciais criptografadas
          </div>
        </div>
      </main>
    </div>
  );
}
