import OpenAI from "openai";
import type { AiConfig, Message } from "./types";

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
