// Rate limiter simples em memória (janela deslizante), por instância serverless.
// Primeira linha de defesa contra spam/abuso nos endpoints públicos.
// Para garantia forte entre instâncias, usar um store externo (Upstash/Vercel KV).

const store = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const start = now - windowMs;
  const hits = (store.get(key) ?? []).filter((t) => t > start);

  if (hits.length >= limit) {
    const retryAfter = Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000));
    store.set(key, hits);
    return { ok: false, retryAfter };
  }

  hits.push(now);
  store.set(key, hits);

  // limpeza best-effort para o mapa não crescer sem limite
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (v.every((t) => t <= start)) store.delete(k);
    }
  }
  return { ok: true, retryAfter: 0 };
}

// IP do cliente a partir dos headers do proxy (Vercel).
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  return xff.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
