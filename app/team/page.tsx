"use client";

import { useState, useEffect, useCallback } from "react";
import MissionControlLayout from "@/components/MissionControlLayout";
import { useI18n } from "@/lib/i18n";

type AgentRole = "coordinator" | "developer" | "writer" | "designer";
type AgentStatus = "active" | "idle" | "away";

interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  title: string;
  title_zh: string;
  avatar: string;
  status: AgentStatus;
  current_task?: string;
  description?: string;
  description_zh?: string;
  specialty?: string;
  created_at: string;
  updated_at: string;
}

const roleColors: Record<AgentRole, string> = {
  coordinator: "var(--accent-pink)",
  developer: "var(--accent-blue)",
  writer: "var(--accent-purple)",
  designer: "var(--accent-cyan)",
};

const statusColors: Record<AgentStatus, string> = {
  active: "var(--accent-green)",
  idle: "var(--accent-yellow)",
  away: "var(--text-muted)",
};

export default function TeamPage() {
  const { t, lang } = useI18n();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<AgentRole | "all">("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      const response = await fetch("/api/mc/agents");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setAgents(data);
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const roles: AgentRole[] = ["coordinator", "developer", "writer", "designer"];

  const filteredAgents = agents.filter((agent) =>
    selectedRole === "all" || agent.role === selectedRole
  );

  const getRoleTitle = (agent: Agent) => lang === "zh" ? agent.title_zh : agent.title;
  const getDescription = (agent: Agent) => lang === "zh" ? (agent.description_zh || agent.description || "") : (agent.description || "");

  return (
    <MissionControlLayout>
      <div className="page-content">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>{t("team.title")}</h1>
        </div>

        {/* Role Filter */}
        <div className="flex gap-2 mb-4" style={{ flexWrap: "wrap" }}>
          <button
            className={`badge ${selectedRole === "all" ? "badge-blue" : ""}`}
            style={{
              background: selectedRole === "all" ? "var(--accent-blue)" : "var(--bg-tertiary)",
              color: selectedRole === "all" ? "white" : "var(--text-secondary)",
              cursor: "pointer",
              border: "none",
              padding: "10px 16px",
              fontSize: "13px",
            }}
            onClick={() => setSelectedRole("all")}
          >
            {t("tasks.filterAll")} ({agents.length})
          </button>
          {roles.map((role) => (
            <button
              key={role}
              style={{
                background: selectedRole === role ? roleColors[role] : "var(--bg-tertiary)",
                color: selectedRole === role ? "white" : "var(--text-secondary)",
                cursor: "pointer",
                border: "none",
                padding: "10px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 500,
              }}
              onClick={() => setSelectedRole(role)}
            >
              {role === "coordinator" && "🎯"}
              {role === "developer" && "👨‍💻"}
              {role === "writer" && "✍️"}
              {role === "designer" && "🎨"}
              {" "}
              {t(`team.role.${role}`)} ({agents.filter((a) => a.role === role).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state">
            <p>{t("common.loading")}</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p className="text-muted">No agents found. Run setup to seed data.</p>
            <a href="/setup" className="btn btn-primary mt-4">Go to Setup</a>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "1fr 350px", gap: "24px" }}>
            {/* Agent Grid */}
            <div className="grid grid-3">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="agent-card"
                  onClick={() => setSelectedAgent(agent)}
                  style={{
                    cursor: "pointer",
                    border: selectedAgent?.id === agent.id ? `2px solid ${roleColors[agent.role]}` : undefined,
                  }}
                >
                  <div
                    className="agent-avatar"
                    style={{ background: `${roleColors[agent.role]}20` }}
                  >
                    {agent.avatar}
                  </div>
                  <h3 className="font-semibold mb-1">{agent.name}</h3>
                  <p className="text-sm text-secondary mb-2">{getRoleTitle(agent)}</p>
                  <div className="agent-status">
                    <span className="status-dot" style={{ background: statusColors[agent.status] }} />
                    {t(`team.status.${agent.status}`)}
                  </div>
                  {agent.current_task && (
                    <div className="mt-3" style={{
                      background: "var(--bg-tertiary)",
                      padding: "8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}>
                      <span className="text-muted">{t("team.currentTask")}:</span>
                      <p className="text-secondary" style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {agent.current_task}
                      </p>
                    </div>
                  )}
                  {agent.specialty && (
                    <span className="badge badge-blue mt-2" style={{ fontSize: "10px" }}>
                      {agent.specialty}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Agent Detail */}
            <div className="card" style={{ height: "fit-content", position: "sticky", top: "84px" }}>
              {selectedAgent ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "16px",
                        background: `${roleColors[selectedAgent.role]}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "36px",
                      }}
                    >
                      {selectedAgent.avatar}
                    </div>
                    <div>
                      <h2 className="font-bold" style={{ fontSize: "20px" }}>
                        {selectedAgent.name}
                      </h2>
                      <p className="text-secondary">{getRoleTitle(selectedAgent)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="status-dot" style={{ background: statusColors[selectedAgent.status] }} />
                        <span className="text-sm" style={{ color: statusColors[selectedAgent.status] }}>
                          {t(`team.status.${selectedAgent.status}`)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedAgent.specialty && (
                    <div className="mb-3">
                      <span className="text-sm text-muted">Specialty: </span>
                      <span className="badge badge-purple" style={{ fontSize: "11px" }}>
                        {selectedAgent.specialty}
                      </span>
                    </div>
                  )}

                  <div className="mb-3">
                    <span className="text-sm text-muted">{t(`team.role.${selectedAgent.role}`)}</span>
                  </div>

                  <div style={{
                    background: "var(--bg-tertiary)",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}>
                    <p className="text-sm" style={{ lineHeight: 1.7, color: "var(--text-secondary)" }}>
                      {getDescription(selectedAgent)}
                    </p>
                  </div>

                  {selectedAgent.current_task && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">{t("team.currentTask")}</h4>
                      <div style={{
                        background: `${roleColors[selectedAgent.role]}10`,
                        border: `1px solid ${roleColors[selectedAgent.role]}30`,
                        padding: "12px",
                        borderRadius: "8px",
                      }}>
                        <p className="text-sm">{selectedAgent.current_task}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state" style={{ padding: "48px 24px" }}>
                  <div className="empty-icon">👥</div>
                  <p className="text-muted">Select a team member to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MissionControlLayout>
  );
}
