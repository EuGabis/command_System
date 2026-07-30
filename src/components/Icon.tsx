import type { SVGProps } from "react";

// Ícones de linha, traço = currentColor. Substituem os emojis em toda a interface.
export type IconName =
  | "dashboard"
  | "whatsapp"
  | "instagram"
  | "ai"
  | "chat"
  | "pipeline"
  | "user"
  | "help"
  | "logout"
  | "arrow"
  | "check"
  | "external"
  | "shield"
  | "book"
  | "rocket"
  | "info"
  | "lock";

const paths: Record<IconName, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.4-4A8 8 0 1 1 8 18.6L4 20z" />
      <path d="M9.2 9.3c.2 2.3 2.2 4.3 4.5 4.5.5 0 1-.4 1.1-.9l.2-.9-2-.9-.7.7a4 4 0 0 1-1.6-1.6l.7-.7-.9-2-.9.2c-.5.1-.9.6-.9 1.1z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  ai: (
    <>
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M12 7V4" />
      <circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <path d="M9.5 16.5h5" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H8l-4 4V5z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  pipeline: (
    <>
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="9.5" y="4" width="5" height="11" rx="1" />
      <rect x="16" y="4" width="5" height="7" rx="1" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.2 9.2a2.8 2.8 0 0 1 5.4 1c0 1.8-2.6 2-2.6 3.4" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
      <path d="M10 8l-4 4 4 4" />
      <path d="M6 12h11" />
    </>
  ),
  arrow: <path d="M8 5l7 7-7 7" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3z" />,
  book: (
    <>
      <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4z" />
      <path d="M18 16H7a2 2 0 0 0-2 2" />
    </>
  ),
  rocket: (
    <>
      <path d="M5 15c-1 2-1 4-1 4s2 0 4-1" />
      <path d="M9 15l-2-2c1-5 4-8 9-9 0 5-3 8-8 9l-2 2z" />
      <circle cx="14" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
};

export default function Icon({
  name,
  size = 20,
  ...props
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
