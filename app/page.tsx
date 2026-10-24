"use client";

import MissionControlLayout from "@/components/MissionControlLayout";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <MissionControlLayout>
      <div className="page-content">
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
          {t("nav.missionControl")}
        </h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--accent-blue)" }}>0</div>
            <div className="stat-label">{t("tasks.status.in_progress")}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--accent-yellow)" }}>0</div>
            <div className="stat-label">{t("tasks.status.todo")}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--accent-purple)" }}>0</div>
            <div className="stat-label">{t("nav.content")}</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--accent-green)" }}>0</div>
            <div className="stat-label">{t("nav.team")}</div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{t("nav.tasks")}</h2>
              <span className="badge badge-blue">{t("tasks.filterAll")}</span>
            </div>
            <p className="text-secondary text-sm">
              {t("tasks.noTasks")}
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{t("nav.content")}</h2>
              <span className="badge badge-purple">{t("content.stage.idea")}</span>
            </div>
            <p className="text-secondary text-sm">
              {t("tasks.noTasks")}
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{t("nav.team")}</h2>
              <span className="badge badge-green">{t("team.status.active")}</span>
            </div>
            <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
              {["🤖 Work", "👨‍💻 CodeBot", "✍️ Quill", "🎨 Designer"].map((agent) => (
                <span key={agent} className="badge badge-cyan">{agent}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{t("nav.calendar")}</h2>
              <span className="badge badge-yellow">{t("calendar.today")}</span>
            </div>
            <p className="text-secondary text-sm">
              {t("calendar.noEvents")}
            </p>
          </div>
        </div>
      </div>
    </MissionControlLayout>
  );
}
