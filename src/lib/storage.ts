import { randomUUID } from "crypto";
import { supabaseAdmin } from "./supabase";
import type { MediaType } from "./types";

const BUCKET = "whatsapp-media";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "audio/ogg": "ogg",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/wav": "wav",
  "video/mp4": "mp4",
  "application/pdf": "pdf",
};

export function mediaTypeFromMime(mime: string): MediaType {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  return "document";
}

function extFor(mime: string): string {
  return EXT[mime] ?? (mime.split("/")[1] || "bin").split(";")[0];
}

// Sobe um Buffer e devolve a URL pública.
export async function uploadBuffer(buffer: Buffer, mime: string): Promise<string> {
  const path = `${new Date().getUTCFullYear()}/${randomUUID()}.${extFor(mime)}`;
  const { error } = await supabaseAdmin()
    .storage.from(BUCKET)
    .upload(path, buffer, { contentType: mime, upsert: false });
  if (error) throw new Error(error.message);
  const { data } = supabaseAdmin().storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Sobe a partir de base64 (mídia recebida da Evolution).
export async function uploadBase64(base64: string, mime: string): Promise<string> {
  return uploadBuffer(Buffer.from(base64, "base64"), mime);
}
