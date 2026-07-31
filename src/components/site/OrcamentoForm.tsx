"use client";

import { useState } from "react";

const CAMPOS_INICIAIS = {
  nome: "",
  telefone: "",
  origem: "",
  destino: "",
  data_ida: "",
  data_volta: "",
  passageiros: "1",
  tipo_servico: "Passagem nacional",
  obs: "",
  empresa: "", // honeypot
};

export default function OrcamentoForm({ variant = "card" }: { variant?: "card" | "plain" }) {
  const [v, setV] = useState(CAMPOS_INICIAIS);
  const [status, setStatus] = useState<"idle" | "enviando" | "ok" | "err">("idle");
  const [erro, setErro] = useState("");

  function set<K extends keyof typeof v>(k: K, val: string) {
    setV((prev) => ({ ...prev, [k]: val }));
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (status === "enviando") return;
    setStatus("enviando");
    setErro("");
    try {
      const res = await fetch("/api/orcamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("ok");
        setV(CAMPOS_INICIAIS);
      } else {
        setStatus("err");
        setErro(data.error ?? "Não foi possível enviar. Tente novamente.");
      }
    } catch {
      setStatus("err");
      setErro("Falha de conexão. Tente novamente.");
    }
  }

  const wrap = variant === "card" ? "g-quote" : "";

  return (
    <form className={wrap} onSubmit={enviar}>
      {variant === "card" && (
        <>
          <h3>Peça seu orçamento</h3>
          <div className="g-hint">Resposta rápida no seu WhatsApp. Sem compromisso.</div>
        </>
      )}

      {status === "ok" ? (
        <div className="g-note ok" style={{ marginTop: variant === "card" ? 14 : 0 }}>
          Recebemos seu pedido. Nossa equipe vai te chamar no WhatsApp com a cotação. Boa viagem!
        </div>
      ) : (
        <>
          <div className="g-field">
            <label>Seu nome</label>
            <input className="g-input" required value={v.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Como podemos te chamar" />
          </div>
          <div className="g-field">
            <label>WhatsApp (com DDD)</label>
            <input className="g-input" required value={v.telefone} onChange={(e) => set("telefone", e.target.value)} placeholder="(85) 9 9999-9999" inputMode="tel" />
          </div>
          <div className="g-row">
            <div className="g-field">
              <label>Origem</label>
              <input className="g-input" value={v.origem} onChange={(e) => set("origem", e.target.value)} placeholder="Fortaleza" />
            </div>
            <div className="g-field">
              <label>Destino</label>
              <input className="g-input" required value={v.destino} onChange={(e) => set("destino", e.target.value)} placeholder="Lisboa" />
            </div>
          </div>
          <div className="g-row">
            <div className="g-field">
              <label>Ida</label>
              <input className="g-input" type="date" value={v.data_ida} onChange={(e) => set("data_ida", e.target.value)} />
            </div>
            <div className="g-field">
              <label>Volta</label>
              <input className="g-input" type="date" value={v.data_volta} onChange={(e) => set("data_volta", e.target.value)} />
            </div>
          </div>
          <div className="g-row">
            <div className="g-field">
              <label>Passageiros</label>
              <input className="g-input" value={v.passageiros} onChange={(e) => set("passageiros", e.target.value)} placeholder="2 adultos" />
            </div>
            <div className="g-field">
              <label>Serviço</label>
              <select className="g-select" value={v.tipo_servico} onChange={(e) => set("tipo_servico", e.target.value)}>
                <option>Passagem nacional</option>
                <option>Passagem internacional</option>
                <option>Pacote completo</option>
                <option>Passaporte / documentação</option>
                <option>Outro</option>
              </select>
            </div>
          </div>
          <div className="g-field">
            <label>Observações (opcional)</label>
            <input className="g-input" value={v.obs} onChange={(e) => set("obs", e.target.value)} placeholder="Ex: prefiro voo direto, orçamento até R$ X" />
          </div>

          {/* honeypot anti-spam */}
          <input className="g-honey" tabIndex={-1} autoComplete="off" value={v.empresa} onChange={(e) => set("empresa", e.target.value)} aria-hidden />

          {status === "err" && <div className="g-note err">{erro}</div>}

          <button className="g-btn g-btn-primary g-btn-lg" type="submit" style={{ width: "100%", marginTop: 16, justifyContent: "center" }} disabled={status === "enviando"}>
            {status === "enviando" ? "Enviando…" : "Solicitar cotação"}
          </button>
        </>
      )}
    </form>
  );
}
