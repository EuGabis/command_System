"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PIPELINE_STAGES, type Conversation, type PipelineStage } from "@/lib/types";

const STAGE_COLOR: Record<PipelineStage, string> = {
  novo_lead: "#4f8cff",
  em_atendimento: "#a855f7",
  cotacao_enviada: "#f59e0b",
  negociacao: "#14b8a6",
  fechado: "#22c55e",
  perdido: "#ef4444",
};

function LeadCard({
  c,
  onDragStart,
  dragging,
}: {
  c: Conversation;
  onDragStart: (id: string) => void;
  dragging: boolean;
}) {
  const nome = c.nome_contato ?? c.contato;
  const d = c.lead_data ?? {};
  const rota = [d.origem, d.destino].filter(Boolean).join(" → ");
  const datas = [d.data_ida, d.data_volta].filter(Boolean).join(" - ");
  return (
    <a
      href={`/conversas?id=${c.id}`}
      className={`lead-card${dragging ? " dragging" : ""}`}
      draggable
      onDragStart={() => onDragStart(c.id)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <strong style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {c.platform === "whatsapp" ? "🟢" : "📸"} {nome}
        </strong>
      </div>
      {c.lead_resumo && (
        <div style={{ fontSize: 12.5, color: "var(--text)", marginTop: 6, lineHeight: 1.4 }}>{c.lead_resumo}</div>
      )}
      {rota && <div className="lead-field"><b>Rota:</b> {rota}</div>}
      {datas && <div className="lead-field"><b>Datas:</b> {datas}</div>}
      {d.passageiros && <div className="lead-field"><b>Pax:</b> {d.passageiros}</div>}
      {d.tipo_servico && <div className="lead-field"><b>Serviço:</b> {d.tipo_servico}</div>}
      {d.valor && <div className="lead-field"><b>Valor:</b> {d.valor}</div>}
      <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 8 }}>
        +{c.contato}
      </div>
    </a>
  );
}

export default function PipelineBoard({ initial }: { initial: Conversation[] }) {
  const [leads, setLeads] = useState<Conversation[]>(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<PipelineStage | null>(null);

  const carregar = useCallback(async () => {
    try {
      const res = await fetch("/api/pipeline", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data.conversas)) setLeads(data.conversas);
    } catch {
      /* silencioso */
    }
  }, []);

  useEffect(() => {
    const t = setInterval(carregar, 5000);
    return () => clearInterval(t);
  }, [carregar]);

  const porEstagio = useMemo(() => {
    const map: Record<string, Conversation[]> = {};
    for (const s of PIPELINE_STAGES) map[s.key] = [];
    for (const c of leads) (map[c.pipeline_stage] ?? map["novo_lead"]).push(c);
    return map;
  }, [leads]);

  async function soltar(stage: PipelineStage) {
    const id = dragId;
    setDragId(null);
    setOverStage(null);
    if (!id) return;
    const atual = leads.find((l) => l.id === id);
    if (!atual || atual.pipeline_stage === stage) return;
    // otimista
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, pipeline_stage: stage, stage_locked: true } : l)));
    try {
      await fetch(`/api/pipeline/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
    } catch {
      carregar();
    }
  }

  return (
    <div className="kanban">
      {PIPELINE_STAGES.map((s) => {
        const cards = porEstagio[s.key] ?? [];
        return (
          <div
            key={s.key}
            className={`kanban-col${overStage === s.key ? " drop" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              if (overStage !== s.key) setOverStage(s.key);
            }}
            onDragLeave={() => setOverStage((v) => (v === s.key ? null : v))}
            onDrop={() => soltar(s.key)}
          >
            <div className="kanban-col-head">
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14 }}>
                <span className="dot" style={{ background: STAGE_COLOR[s.key] }} />
                {s.label}
              </span>
              <span className="stage-count">{cards.length}</span>
            </div>
            <div className="kanban-col-body">
              {cards.length === 0 ? (
                <div style={{ fontSize: 12, color: "var(--muted)", padding: "8px 4px", textAlign: "center" }}>—</div>
              ) : (
                cards.map((c) => (
                  <LeadCard key={c.id} c={c} dragging={dragId === c.id} onDragStart={setDragId} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
