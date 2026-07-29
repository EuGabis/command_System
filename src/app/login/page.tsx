"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

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
      if (error) throw new Error("Email ou senha inválidos.");
      router.push("/");
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
      // já cria e loga
      const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password: senha });
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (e) {
      setErro(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  }

  const isSetup = modo === "setup";

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="card" style={{ width: 380, maxWidth: "100%" }}>
        <div style={{ fontWeight: 800, fontSize: 20 }}>Central de Comando</div>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6, marginBottom: 20 }}>
          {modo === "carregando"
            ? "Carregando..."
            : isSetup
            ? "Primeiro acesso — crie a conta do dono."
            : "Entre para acessar o painel."}
        </p>

        {modo !== "carregando" && (
          <form onSubmit={isSetup ? criarDono : entrar} style={{ display: "grid", gap: 14 }}>
            {isSetup && (
              <div>
                <label className="label">Seu nome</label>
                <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Senha {isSetup && "(mín. 8 caracteres)"}</label>
              <input
                className="input"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {erro && <div style={{ color: "var(--red)", fontSize: 13 }}>{erro}</div>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Aguarde..." : isSetup ? "Criar conta e entrar" : "Entrar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
