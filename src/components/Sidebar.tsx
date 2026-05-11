"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  badge?: string | number;
  disabled?: boolean;
}

const NAV: NavItem[] = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/flashcards", icon: "🃏", label: "Flashcards", badge: 24 },
  { href: "/conversation", icon: "💬", label: "Conversation" },
  { href: "/news", icon: "📰", label: "News reader", disabled: true },
  { href: "/writing", icon: "✍️", label: "Writing coach" },
  { href: "/content", icon: "🎬", label: "From content", disabled: true },
];

interface SidebarProps {
  streak?: number;
}

export function Sidebar({ streak = 12 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">L</div>
        <div>
          <div className="brand-name">Lumi</div>
          <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: -2 }}>
            Spanish, daily.
          </div>
        </div>
      </div>

      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        const className = `nav-item ${active ? "active" : ""}`;
        if (item.disabled) {
          return (
            <button
              key={item.href}
              type="button"
              className={className}
              style={{ opacity: 0.55, cursor: "not-allowed" }}
              disabled
            >
              <span className="icon" style={{ fontSize: 20 }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          );
        }
        return (
          <Link key={item.href} href={item.href} className={className}>
            <span className="icon" style={{ fontSize: 20 }}>
              {item.icon}
            </span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge !== undefined && (
              <span className="pill green" style={{ fontSize: 11, padding: "2px 8px" }}>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}

      <div className="nav-spacer" />

      <div className="streak-card">
        <span className="streak-flame">🔥</span>
        <div>
          <div className="streak-num">{streak}</div>
          <div className="streak-lbl">day streak</div>
        </div>
      </div>

      <button type="button" className="nav-item" style={{ marginTop: 8 }} disabled>
        <span className="icon" style={{ fontSize: 20 }}>
          ⚙️
        </span>
        <span style={{ flex: 1 }}>Settings</span>
      </button>
    </aside>
  );
}

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
