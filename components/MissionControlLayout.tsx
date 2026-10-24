"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const navItems = [
  { href: "/", icon: "🎯", key: "nav.missionControl" },
  { href: "/tasks", icon: "📋", key: "nav.tasks" },
  { href: "/content", icon: "📝", key: "nav.content" },
  { href: "/calendar", icon: "📅", key: "nav.calendar" },
  { href: "/memory", icon: "🧠", key: "nav.memory" },
  { href: "/team", icon: "👥", key: "nav.team" },
  { href: "/office", icon: "🏢", key: "nav.office" },
];

export default function MissionControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();

  return (
    <div className="mission-control-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">🚀</div>
          <div>
            <div className="sidebar-title">Mission Control</div>
            <div className="sidebar-subtitle">AI Company</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname === item.href ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{t(item.key)}</span>
              </Link>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Team</div>
            {navItems.slice(4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname === item.href ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{t(item.key)}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="lang-switch">
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              className={`lang-btn ${lang === "zh" ? "active" : ""}`}
              onClick={() => setLang("zh")}
            >
              中文
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
