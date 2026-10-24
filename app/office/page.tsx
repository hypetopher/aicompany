"use client";

import { useState } from "react";
import MissionControlLayout from "@/components/MissionControlLayout";
import { useI18n } from "@/lib/i18n";

type AgentRole = "coordinator" | "developer" | "writer" | "designer";
type AgentStatus = "active" | "idle" | "away";

interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  avatar: string;
  status: AgentStatus;
  currentTask?: string;
  workspaceColor: string;
}

const initialAgents: Agent[] = [
  // Row 1 - Coordinators
  {
    id: "work",
    name: "Work",
    role: "coordinator",
    avatar: "🤖",
    status: "active",
    currentTask: "Coordinating Mission Control",
    workspaceColor: "#8b5cf6",
  },
  {
    id: "ax",
    name: "AX",
    role: "coordinator",
    avatar: "👤",
    status: "active",
    currentTask: "Managing Operations",
    workspaceColor: "#ec4899",
  },
  // Row 2 - Developers
  {
    id: "codebot",
    name: "CodeBot",
    role: "developer",
    avatar: "👨‍💻",
    status: "active",
    currentTask: "Writing components",
    workspaceColor: "#3b82f6",
  },
  {
    id: "devminion",
    name: "DevMinion",
    role: "developer",
    avatar: "🔧",
    status: "idle",
    workspaceColor: "#06b6d4",
  },
  {
    id: "architect",
    name: "Architect",
    role: "developer",
    avatar: "🏗️",
    status: "active",
    currentTask: "Designing system",
    workspaceColor: "#0ea5e9",
  },
  // Row 3 - Writers
  {
    id: "quill",
    name: "Quill",
    role: "writer",
    avatar: "✍️",
    status: "active",
    currentTask: "Drafting content",
    workspaceColor: "#a855f7",
  },
  {
    id: "copywriter",
    name: "Copywriter",
    role: "writer",
    avatar: "📝",
    status: "idle",
    workspaceColor: "#d946ef",
  },
  {
    id: "editor",
    name: "Editor",
    role: "writer",
    avatar: "📖",
    status: "active",
    currentTask: "Reviewing drafts",
    workspaceColor: "#c026d3",
  },
  // Row 4 - Designers
  {
    id: "designer",
    name: "Designer",
    role: "designer",
    avatar: "🎨",
    status: "active",
    currentTask: "Designing UI",
    workspaceColor: "#14b8a6",
  },
  {
    id: "artdirector",
    name: "ArtDirector",
    role: "designer",
    avatar: "🎭",
    status: "away",
    workspaceColor: "#10b981",
  },
  {
    id: "visualminion",
    name: "VisualMinion",
    role: "designer",
    avatar: "🖼️",
    status: "idle",
    workspaceColor: "#22c55e",
  },
];

const statusColors: Record<AgentStatus, string> = {
  active: "var(--accent-green)",
  idle: "var(--accent-yellow)",
  away: "var(--text-muted)",
};

const roleIcons: Record<AgentRole, string> = {
  coordinator: "🎯",
  developer: "👨‍💻",
  writer: "✍️",
  designer: "🎨",
};

export default function OfficePage() {
  const { t, lang } = useI18n();
  const [agents] = useState<Agent[]>(initialAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  const getStatusText = (agent: Agent) => {
    if (agent.status === "active") return t("office.atDesk");
    if (agent.status === "away") return t("office.away");
    return t("team.status.idle");
  };

  return (
    <MissionControlLayout>
      <div className="page-content">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>{t("office.title")}</h1>
          <div className="flex gap-3">
            {(["active", "idle", "away"] as AgentStatus[]).map((status) => (
              <div key={status} className="flex items-center gap-2">
                <span className="status-dot" style={{ background: statusColors[status] }} />
                <span className="text-sm text-secondary">
                  {t(`team.status.${status}`)} ({agents.filter((a) => a.status === status).length})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Office Floor */}
        <div style={{
          background: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2a 50%, #0a0a15 100%)",
          borderRadius: "16px",
          padding: "24px",
          minHeight: "600px",
          position: "relative",
        }}>
          {/* Floor Grid Pattern */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            borderRadius: "16px",
          }} />

          {/* Role Section Labels */}
          <div className="flex" style={{ gap: "24px", marginBottom: "24px", position: "relative" }}>
            {(["coordinator", "developer", "writer", "designer"] as AgentRole[]).map((role) => (
              <div key={role} className="flex items-center gap-2">
                <span style={{ fontSize: "20px" }}>{roleIcons[role]}</span>
                <span className="text-sm text-muted">{t(`team.role.${role}`)}</span>
                <span className="text-xs text-muted">
                  ({agents.filter((a) => a.role === role && a.status === "active").length}/{agents.filter((a) => a.role === role).length})
                </span>
              </div>
            ))}
          </div>

          {/* Workstations Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            position: "relative",
          }}>
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="office-desk"
                onClick={() => setSelectedAgent(agent)}
                onMouseEnter={() => setHoveredAgent(agent.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                style={{
                  borderColor: selectedAgent?.id === agent.id
                    ? agent.workspaceColor
                    : hoveredAgent === agent.id
                      ? `${agent.workspaceColor}80`
                      : "var(--border-color)",
                  transform: hoveredAgent === agent.id ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                {/* Workstation Header */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: "20px" }}>{agent.avatar}</span>
                    <span className="font-semibold">{agent.name}</span>
                  </div>
                  <div
                    className="status-dot"
                    style={{
                      background: statusColors[agent.status],
                      boxShadow: agent.status === "active" ? `0 0 10px ${statusColors[agent.status]}` : "none",
                    }}
                  />
                </div>

                {/* Computer */}
                <div className="desk-computer">
                  <div className="computer-screen">
                    {agent.status === "active" && agent.currentTask ? (
                      <>
                        <span>💻 {t("office.computer")}</span>
                        <span className="computer-task">{agent.currentTask}</span>
                        <span style={{ fontSize: "8px", marginTop: "8px", color: "var(--accent-green)" }}>
                          ● Working
                        </span>
                      </>
                    ) : agent.status === "idle" ? (
                      <>
                        <span>💻 {t("office.computer")}</span>
                        <span style={{ fontSize: "8px", marginTop: "8px", color: "var(--accent-yellow)" }}>
                          ○ Idle
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ opacity: 0.3 }}>💻</span>
                        <span style={{ fontSize: "8px", marginTop: "8px", opacity: 0.3 }}>
                          Away
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm"
                    style={{ color: statusColors[agent.status] }}
                  >
                    {getStatusText(agent)}
                  </span>
                  <span className="badge" style={{
                    background: `${agent.workspaceColor}20`,
                    color: agent.workspaceColor,
                    fontSize: "10px",
                  }}>
                    {t(`team.role.${agent.role}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Agent Detail */}
          {selectedAgent && (
            <div
              style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                background: "var(--bg-secondary)",
                border: `2px solid ${selectedAgent.workspaceColor}`,
                borderRadius: "16px",
                padding: "20px",
                width: "320px",
                zIndex: 100,
                boxShadow: `0 20px 40px rgba(0,0,0,0.4)`,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: "32px" }}>{selectedAgent.avatar}</span>
                  <div>
                    <h3 className="font-bold">{selectedAgent.name}</h3>
                    <p className="text-sm text-secondary">{t(`team.role.${selectedAgent.role}`)}</p>
                  </div>
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ padding: "4px 8px" }}
                  onClick={() => setSelectedAgent(null)}
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="status-dot" style={{ background: statusColors[selectedAgent.status] }} />
                <span className="text-sm" style={{ color: statusColors[selectedAgent.status] }}>
                  {getStatusText(selectedAgent)}
                </span>
              </div>

              {selectedAgent.currentTask && selectedAgent.status === "active" && (
                <div style={{
                  background: `${selectedAgent.workspaceColor}15`,
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${selectedAgent.workspaceColor}30`,
                }}>
                  <span className="text-xs text-muted">{t("team.currentTask")}</span>
                  <p className="text-sm mt-1">{selectedAgent.currentTask}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Office Legend */}
        <div className="card mt-4">
          <h3 className="text-sm font-medium mb-3">Office Legend</h3>
          <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
            <div className="flex items-center gap-2">
              <span className="status-dot" style={{ background: "var(--accent-green)" }} />
              <span className="text-sm text-secondary">{t("office.atDesk")} - Agent is working</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot" style={{ background: "var(--accent-yellow)" }} />
              <span className="text-sm text-secondary">{t("team.status.idle")} - Available for tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-dot" style={{ background: "var(--text-muted)" }} />
              <span className="text-sm text-secondary">{t("office.away")} - Not available</span>
            </div>
          </div>
        </div>
      </div>
    </MissionControlLayout>
  );
}
