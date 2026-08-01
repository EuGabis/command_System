import { NextRequest, NextResponse } from "next/server";
import { getConversationById } from "@/lib/repo";
import { enviarMidiaManual } from "@/lib/engine";
import { uploadBuffer, mediaTypeFromMime } from "@/lib/storage";
import type { Platform } from "@/lib/types";

const MAX_BYTES = 16 * 1024 * 1024; // 16 MB (limite do WhatsApp)

// Envio de mídia pelo operador: recebe o arquivo, hospeda e envia ao contato.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const caption = (form?.get("caption") as string | null)?.trim() || undefined;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Arquivo muito grande (máx. 16 MB)" }, { status: 400 });
  }

  const conversa = await getConversationById(id);
  if (!conversa) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type || "application/octet-stream";
    const url = await uploadBuffer(buffer, mime);
    await enviarMidiaManual(
      id,
      conversa.platform as Platform,
      conversa.contato,
      { url, type: mediaTypeFromMime(mime), name: file.name },
      caption,
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}
