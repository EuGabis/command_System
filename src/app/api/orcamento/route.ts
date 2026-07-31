import { NextRequest, NextResponse } from "next/server";
import { upsertConversation, addMessage, saveLead } from "@/lib/repo";
import type { LeadData } from "@/lib/types";

// Normaliza telefone para dígitos com DDI (Brasil por padrão).
function normalizarTelefone(raw: string): string | null {
  let d = (raw || "").replace(/\D/g, "");
  if (!d) return null;
  if (!d.startsWith("55") && d.length >= 10 && d.length <= 11) d = "55" + d;
  return d.length >= 12 && d.length <= 13 ? d : null;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // honeypot anti-spam: bots preenchem "empresa"
  if (body?.empresa) return NextResponse.json({ ok: true });

  const nome = String(body?.nome ?? "").trim();
  const telefone = normalizarTelefone(String(body?.telefone ?? ""));
  const destino = String(body?.destino ?? "").trim();

  if (!nome || !telefone) {
    return NextResponse.json({ error: "Informe seu nome e um WhatsApp válido com DDD." }, { status: 400 });
  }
  if (!destino) {
    return NextResponse.json({ error: "Informe o destino da viagem." }, { status: 400 });
  }

  const s = (x: unknown) => {
    const v = String(x ?? "").trim();
    return v || undefined;
  };
  const leadData: LeadData = {
    origem: s(body?.origem),
    destino,
    data_ida: s(body?.data_ida),
    data_volta: s(body?.data_volta),
    passageiros: s(body?.passageiros),
    tipo_servico: s(body?.tipo_servico),
  };

  const partes = [
    leadData.origem && leadData.destino ? `${leadData.origem} → ${leadData.destino}` : `Destino: ${destino}`,
    leadData.data_ida ? `ida ${leadData.data_ida}` : null,
    leadData.data_volta ? `volta ${leadData.data_volta}` : null,
    leadData.passageiros ? `${leadData.passageiros} pax` : null,
    leadData.tipo_servico,
  ].filter(Boolean);
  const resumo = `Pedido pelo site: ${partes.join(" · ")}`;

  const obs = s(body?.obs);
  const mensagem = [
    "🌐 *Novo orçamento pelo site*",
    `Nome: ${nome}`,
    leadData.origem ? `Origem: ${leadData.origem}` : null,
    `Destino: ${destino}`,
    leadData.data_ida ? `Ida: ${leadData.data_ida}` : null,
    leadData.data_volta ? `Volta: ${leadData.data_volta}` : null,
    leadData.passageiros ? `Passageiros: ${leadData.passageiros}` : null,
    leadData.tipo_servico ? `Serviço: ${leadData.tipo_servico}` : null,
    obs ? `Obs: ${obs}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const conversationId = await upsertConversation("whatsapp", telefone, nome);
    await addMessage(conversationId, "entrada", mensagem, "cliente");
    await saveLead(conversationId, leadData, resumo, "novo_lead", false);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao registrar orçamento:", e);
    return NextResponse.json({ error: "Não foi possível registrar agora. Tente pelo WhatsApp." }, { status: 500 });
  }
}
