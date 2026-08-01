"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Icon, { type IconName } from "./Icon";

const nav: { href: string; label: string; icon: IconName }[] = [
  { href: "/painel", label: "Dashboard", icon: "dashboard" },
  { href: "/painel/whatsapp", label: "WhatsApp", icon: "whatsapp" },
  { href: "/painel/instagram", label: "Instagram", icon: "instagram" },
  { href: "/painel/ia", label: "IA", icon: "ai" },
  { href: "/painel/conversas", label: "Conversas", icon: "chat" },
  { href: "/painel/pipeline", label: "Pipeline", icon: "pipeline" },
  { href: "/painel/respostas", label: "Respostas", icon: "book" },
];

// Item extra só no menu lateral (no mobile fica acessível pelo avatar da top bar)
const perfilItem: { href: string; label: string; icon: IconName } = {
  href: "/painel/perfil",
  label: "Perfil",
  icon: "user",
};

function isActive(pathname: string, href: string) {
  return href === "/painel" ? pathname === "/painel" : pathname.startsWith(href);
}

function Avatar({ url, size = 34 }: { url: string | null; size?: number }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
        alt="avatar"
        style={{ width: size, height: size, flex: "none", borderRadius: "50%", objectFit: "cover" }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        flex: "none",
        borderRadius: "50%",
        background: "var(--panel-2)",
        border: "1px solid var(--border)",
        display: "grid",
        placeItems: "center",
        color: "var(--muted)",
      }}
    >
      <Icon name="user" size={Math.round(size * 0.52)} />
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
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="brand-logo brand-mark-chip"><img src="/logo-mark.png" alt="GAABTUR" /></span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <span className="brand-logo brand-full-chip"><img src="/logo.png" alt="GAABTUR" /></span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {allNav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`navlink${isActive(pathname, n.href) ? " active" : ""}`}
              title={n.label === "IA" ? "Configuração da IA" : n.label}
            >
              <span className="nav-ico"><Icon name={n.icon} size={19} /></span>
              <span className="nav-text">{n.label === "IA" ? "Configuração da IA" : n.label}</span>
            </Link>
          ))}
        </nav>

        <div className="side-foot">
          <div className="side-user">
            <Avatar url={avatarUrl} size={32} />
            <span className="nav-text side-name">{nome}</span>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* ===== Top bar (mobile) ===== */}
      <header className="topbar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <span className="brand-logo"><img src="/logo.png" alt="GAABTUR" /></span>
        <Link href="/painel/perfil" aria-label="Perfil" style={{ display: "flex" }}>
          <Avatar url={avatarUrl} size={32} />
        </Link>
      </header>

      {/* ===== Conteúdo ===== */}
      <main className="content">{children}</main>

      {/* ===== Bottom nav (mobile) ===== */}
      <nav className="bottomnav">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={`tab${isActive(pathname, n.href) ? " active" : ""}`}>
            <span className="ico"><Icon name={n.icon} size={21} /></span>
            <span>{n.label}</span>
          </Link>
        ))}
        <Link href="/painel/perfil" className={`tab${isActive(pathname, "/painel/perfil") ? " active" : ""}`}>
          <span className="ico"><Icon name="user" size={21} /></span>
          <span>Perfil</span>
        </Link>
      </nav>

      {/* ===== Botão flutuante de Ajuda ===== */}
      <Link
        href="/painel/ajuda"
        aria-label="Central de Ajuda"
        title="Ajuda"
        className={`help-fab${pathname.startsWith("/painel/ajuda") ? " active" : ""}`}
      >
        <Icon name="help" size={24} />
      </Link>
    </div>
  );
}
