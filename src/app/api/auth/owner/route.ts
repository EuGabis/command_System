import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

// GET -> já existe um dono cadastrado?
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ exists: false, configured: false });
  }
  try {
    const { data, error } = await supabaseAdmin().auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) throw error;
    return NextResponse.json({ exists: (data.users?.length ?? 0) > 0, configured: true });
  } catch (e) {
    return NextResponse.json({ exists: false, configured: true, error: String(e) });
  }
}

// POST -> cria a conta do dono (SOMENTE se ainda não existir nenhum usuário)
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado." }, { status: 400 });
  }
  try {
    const admin = supabaseAdmin();
    const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
    if ((existing.users?.length ?? 0) > 0) {
      return NextResponse.json(
        { error: "Já existe uma conta. Cadastro fechado." },
        { status: 403 },
      );
    }

    const { email, password, nome } = await req.json();
    if (!email || !password || String(password).length < 8) {
      return NextResponse.json(
        { error: "Email válido e senha (mín. 8 caracteres) são obrigatórios." },
        { status: 400 },
      );
    }

    const { error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nome: nome ?? "" },
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
