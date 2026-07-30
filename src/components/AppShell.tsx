"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const nav = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/whatsapp", label: "WhatsApp", icon: "🟢" },
  { href: "/instagram", label: "Instagram", icon: "📸" },
  { href: "/ia", label: "IA", icon: "🤖" },
  { href: "/conversas", label: "Conversas", icon: "💬" },
  { href: "/pipeline", label: "Pipeline", icon: "📋" },
];

// Item extra só no menu lateral (no mobile fica acessível pelo avatar da top bar)
const perfilItem = { href: "/perfil", label: "Perfil", icon: "👤" };

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function Avatar({ url, size = 34 }: { url: string | null; size?: number }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
        alt="avatar"
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--panel-2)",
        display: "grid",
        placeItems: "center",
        fontSize: size * 0.42,
      }}
    >
      👤
    </div>
  );
}

export default function AppShell({
  nome,
  avatarUrl,
  children,
}: {
  nome: string;
  avatarUrl: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const allNav = [...nav, perfilItem];

  return (
    <div className="shell">
      {/* ===== Sidebar (desktop) ===== */}
      <aside className="sidebar">
        <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>Central de Comando</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 24 }}>Atendimento com IA</div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {allNav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`navlink${isActive(pathname, n.href) ? " active" : ""}`}
            >
              <span>{n.icon}</span>
              <span>{n.label === "IA" ? "Configuração da IA" : n.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Avatar url={avatarUrl} />
            <div style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {nome}
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ===== Top bar (mobile) ===== */}
      <header className="topbar">
        <div style={{ fontWeight: 800, fontSize: 16 }}>Central de Comando</div>
        <Link href="/perfil" aria-label="Perfil" style={{ display: "flex" }}>
          <Avatar url={avatarUrl} size={32} />
        </Link>
      </header>

      {/* ===== Conteúdo ===== */}
      <main className="content">{children}</main>

      {/* ===== Bottom nav (mobile) ===== */}
      <nav className="bottomnav">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={`tab${isActive(pathname, n.href) ? " active" : ""}`}>
            <span className="ico">{n.icon}</span>
            <span>{n.label}</span>
          </Link>
        ))}
        <Link href="/perfil" className={`tab${isActive(pathname, "/perfil") ? " active" : ""}`}>
          <span className="ico">👤</span>
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
