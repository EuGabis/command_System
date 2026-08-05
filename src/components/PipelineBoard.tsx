"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PIPELINE_STAGES, type Conversation, type PipelineStage } from "@/lib/types";

const FALLBACK_COLOR: Record<string, string> = {
  novo_lead: "#4f8cff",
  em_atendimento: "#a855f7",
  cotacao_enviada: "#f59e0b",
  negociacao: "#14b8a6",
  fechado: "#22c55e",
  perdido: "#ef4444",
};

export interface StageView {
  key: string;
  label: string;
  cor: string;
}

function LeadInfo({ c }: { c: Conversation }) {
  const nome = c.nome_contato ?? c.contato;
  const d = c.lead_data ?? {};
  const rota = [d.origem, d.destino].filter(Boolean).join(" → ");
  const datas = [d.data_ida, d.data_volta].filter(Boolean).join(" - ");
  return (
    <>
      <strong style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <span
          className="dot"
          title={c.platform === "whatsapp" ? "WhatsApp" : "Instagram"}
          style={{ background: c.platform === "whatsapp" ? "var(--green)" : "#c4497b", flex: "none" }}
        />
        {nome}
      </strong>
      {c.lead_resumo && <div style={{ fontSize: 12.5, color: "var(--text)", marginTop: 6, lineHeight: 1.4 }}>{c.lead_resumo}</div>}
      {rota && <div className="lead-field"><b>Rota:</b> {rota}</div>}
      {datas && <div className="lead-field"><b>Datas:</b> {datas}</div>}
      {d.passageiros && <div className="lead-field"><b>Pax:</b> {d.passageiros}</div>}
      {d.tipo_servico && <div className="lead-field"><b>Serviço:</b> {d.tipo_servico}</div>}
      {d.valor && <div className="lead-field"><b>Valor:</b> {d.valor}</div>}
    </>
  );
}

function LeadCard({ c, onDragStart, dragging }: { c: Conversation; onDragStart: (id: string) => void; dragging: boolean }) {
  return (
    <a
      href={`/painel/conversas?id=${c.id}`}
      className={`lead-card${dragging ? " dragging" : ""}`}
      draggable
      onDragStart={() => onDragStart(c.id)}
    >
      <LeadInfo c={c} />
      <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 8 }}>+{c.contato}</div>
    </a>
  );
}

export default function PipelineBoard({ initial, stages }: { initial: Conversation[]; stages?: StageView[] }) {
  const STAGES: StageView[] = useMemo(
    () =>
      stages && stages.length
        ? stages
        : PIPELINE_STAGES.map((s) => ({ key: s.key, label: s.label, cor: FALLBACK_COLOR[s.key] ?? "#f2871e" })),
    [stages],
  );

  const [leads, setLeads] = useState<Conversation[]>(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);
  const [mobStage, setMobStage] = useState<string>(STAGES[0]?.key ?? "novo_lead");

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
    for (const s of STAGES) map[s.key] = [];
    const primeira = STAGES[0]?.key ?? "novo_lead";
    for (const c of leads) (map[c.pipeline_stage] ?? map[primeira] ?? (map[primeira] = [])).push(c);
    return map;
  }, [leads, STAGES]);

  const moverLead = useCallback(async (id: string, stage: string) => {
    const atual = leads.find((l) => l.id === id);
    if (!atual || atual.pipeline_stage === stage) return;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, pipeline_stage: stage as PipelineStage, stage_locked: true } : l)));
    try {
      await fetch(`/api/pipeline/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
    } catch {
      carregar();
    }
  }, [leads, carregar]);

  function soltar(stage: string) {
    const id = dragId;
    setDragId(null);
    setOverStage(null);
    if (id) void moverLead(id, stage);
  }

  const cardsMob = porEstagio[mobStage] ?? [];

  return (
    <>
      {/* ===== Desktop: Kanban ===== */}
      <div className="kanban">
        {STAGES.map((s) => {
          const cards = porEstagio[s.key] ?? [];
          return (
            <div
              key={s.key}
              className={`kanban-col${overStage === s.key ? " drop" : ""}`}
              onDragOver={(e) => { e.preventDefault(); if (overStage !== s.key) setOverStage(s.key); }}
              onDragLeave={() => setOverStage((v) => (v === s.key ? null : v))}
              onDrop={() => soltar(s.key)}
            >
              <div className="kanban-col-head">
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14 }}>
                  <span className="dot" style={{ background: s.cor }} />
                  {s.label}
                </span>
                <span className="stage-count">{cards.length}</span>
              </div>
              <div className="kanban-col-body">
                {cards.length === 0 ? (
                  <div style={{ fontSize: 12, color: "var(--muted)", padding: "8px 4px", textAlign: "center" }}>—</div>
                ) : (
                  cards.map((c) => <LeadCard key={c.id} c={c} dragging={dragId === c.id} onDragStart={setDragId} />)
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== Mobile: seletor de estágio + lista ===== */}
      <div className="pipe-mobile">
        <div className="chip-scroll" style={{ paddingBottom: 4 }}>
          {STAGES.map((s) => (
            <button key={s.key} className={`chip${mobStage === s.key ? " active" : ""}`} onClick={() => setMobStage(s.key)}>
              <span className="dot" style={{ background: s.cor }} />
              {s.label}
              <span className="chip-count">{(porEstagio[s.key] ?? []).length}</span>
            </button>
          ))}
        </div>

        <div className="pipe-list">
          {cardsMob.length === 0 ? (
            <div style={{ color: "var(--muted)", fontSize: 14, padding: "24px 4px", textAlign: "center" }}>
              Nenhum lead em “{STAGES.find((s) => s.key === mobStage)?.label ?? ""}”.
            </div>
          ) : (
            cardsMob.map((c) => (
              <div key={c.id} className="pipe-card">
                <LeadInfo c={c} />
                <div className="pipe-card-foot">
                  <select
                    className="select"
                    value={c.pipeline_stage}
                    onChange={(e) => moverLead(c.id, e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                  <a href={`/painel/conversas?id=${c.id}`} className="btn secondary">Abrir</a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
