import OpenAI from "openai";
import type { AiConfig, Message, LeadData, PipelineStage } from "./types";

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

/**
 * Gera a resposta do atendente com base na config da IA e no histórico da conversa.
 */
export async function gerarResposta(
  cfg: AiConfig,
  historico: Message[],
  mensagemCliente: string,
  negocio?: { empresa: string; marca: string } | null,
): Promise<string> {
  if (!isOpenAIConfigured()) {
    return "[modo simulado] IA não configurada — defina OPENAI_API_KEY para respostas reais.";
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const contextoNegocio =
    negocio && (negocio.empresa || negocio.marca)
      ? `Você atende em nome de: ${[negocio.empresa, negocio.marca].filter(Boolean).join(" / ")}.`
      : "";

  const system = [
    cfg.persona,
    contextoNegocio,
    `Tom de voz: ${cfg.tom}.`,
    cfg.base_conhecimento
      ? `Base de conhecimento / FAQ:\n${cfg.base_conhecimento}`
      : "",
    cfg.regras_escalonamento
      ? `Regras de escalonamento para humano:\n${cfg.regras_escalonamento}`
      : "",
    "Responda sempre em português do Brasil, de forma objetiva e útil.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: system },
    ...historico.map((m) => ({
      role: (m.direcao === "entrada" ? "user" : "assistant") as "user" | "assistant",
      content: m.conteudo,
    })),
    { role: "user", content: mensagemCliente },
  ];

  const completion = await client.chat.completions.create({
    model: cfg.modelo || "gpt-4o-mini",
    messages,
    temperature: 0.6,
    max_tokens: 500,
  });

  return (
    completion.choices[0]?.message?.content?.trim() ||
    "Desculpe, não consegui gerar uma resposta agora."
  );
}

const STAGES: PipelineStage[] = [
  "novo_lead",
  "em_atendimento",
  "cotacao_enviada",
  "negociacao",
  "fechado",
  "perdido",
];

export interface LeadExtraction {
  lead_data: LeadData;
  resumo: string;
  estagio: PipelineStage;
}

/**
 * Lê o histórico da conversa e extrai dados estruturados do lead + o estágio
 * sugerido do pipeline. Retorna null se a IA não estiver configurada ou falhar.
 */
export async function extrairLead(historico: Message[]): Promise<LeadExtraction | null> {
  if (!isOpenAIConfigured() || historico.length === 0) return null;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const transcript = historico
    .map((m) => `${m.direcao === "entrada" ? "Cliente" : "Atendente"}: ${m.conteudo}`)
    .join("\n");

  const system = [
    "Você analisa conversas de uma agência de viagens e extrai dados do lead.",
    "Responda APENAS com JSON válido, sem markdown, no formato:",
    `{"origem": "", "destino": "", "data_ida": "", "data_volta": "", "passageiros": "", "tipo_servico": "", "valor": "", "resumo": "", "estagio": ""}`,
    "Regras:",
    "- Campos desconhecidos: string vazia.",
    "- tipo_servico: ex 'passagem nacional', 'passagem internacional', 'passaporte', 'suporte'.",
    "- resumo: 1 frase curta descrevendo o pedido do cliente.",
    `- estagio: um de ${STAGES.join(", ")}.`,
    "  novo_lead = só chegou/saudação; em_atendimento = coletando dados;",
    "  cotacao_enviada = já foi enviado preço/opções; negociacao = discutindo valores/condições;",
    "  fechado = cliente confirmou/comprou; perdido = desistiu ou sem resposta clara de desinteresse.",
  ].join("\n");

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: transcript },
      ],
      temperature: 0.1,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });
    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, string>;
    const estagio = STAGES.includes(parsed.estagio as PipelineStage)
      ? (parsed.estagio as PipelineStage)
      : "novo_lead";
    const clean = (v?: string) => (v && v.trim() ? v.trim() : undefined);
    return {
      lead_data: {
        origem: clean(parsed.origem),
        destino: clean(parsed.destino),
        data_ida: clean(parsed.data_ida),
        data_volta: clean(parsed.data_volta),
        passageiros: clean(parsed.passageiros),
        tipo_servico: clean(parsed.tipo_servico),
        valor: clean(parsed.valor),
      },
      resumo: clean(parsed.resumo) ?? "",
      estagio,
    };
  } catch (e) {
    console.error("Falha ao extrair lead:", e);
    return null;
  }
}
