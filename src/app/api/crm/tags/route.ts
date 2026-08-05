import { NextRequest, NextResponse } from "next/server";
import { listTags, createTag } from "@/lib/repo";

export async function GET() {
  return NextResponse.json({ tags: await listTags() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const nome = String(body?.nome ?? "").trim();
  const cor = String(body?.cor ?? "#f2871e");
  if (!nome) return NextResponse.json({ error: "Informe o nome da tag." }, { status: 400 });
  try {
    const tag = await createTag(nome, cor);
    return NextResponse.json({ ok: true, tag });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}
