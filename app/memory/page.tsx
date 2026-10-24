"use client";

import { useState, useMemo } from "react";
import MissionControlLayout from "@/components/MissionControlLayout";
import { useI18n } from "@/lib/i18n";

interface Memory {
  id: string;
  title: string;
  content: string;
  source: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

const initialMemories: Memory[] = [
  {
    id: "1",
    title: "AX - User Preferences",
    content: "AX prefers to communicate in both English and Chinese. Timezone is Asia/Shanghai. AX works on multiple AI projects and needs help coordinating tasks across different systems.",
    source: "USER.md",
    tags: ["user", "preferences", "timezone"],
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: "2",
    title: "Work Identity - AI Assistant",
    content: "Work is the main AI assistant persona. Coordinated by AX. Work uses Next.js, Convex, and various AI tools to build and manage systems. Work can spawn subagents for different tasks.",
    source: "IDENTITY.md",
    tags: ["identity", "ai", "assistant"],
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 10,
  },
  {
    id: "3",
    title: "Team Structure",
    content: "The team consists of Work (coordinator), subagents organized by roles:\n\nDevelopers: CodeBot (code generation), DevMinion (task execution), Architect (system design)\n\nWriters: Quill (creative writing), Copywriter (marketing copy), Editor (content review)\n\nDesigners: Designer (UI design), ArtDirector (visual direction), VisualMinion (asset creation)",
    source: "MEMORY.md",
    tags: ["team", "structure", "agents"],
    createdAt: Date.now() - 86400000 * 45,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "4",
    title: "Project: Mission Control",
    content: "Mission Control is a Next.js app with Convex database that serves as a central hub for managing all AI company operations. It includes task tracking, content pipeline, calendar, memory management, team structure, and digital office visualization.",
    source: "memory/2026-03-21.md",
    tags: ["project", "mission-control", "nextjs", "convex"],
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "5",
    title: "OpenClaw Configuration",
    content: "OpenClaw is configured with Discord as the primary channel. The workspace is at /home/ax/.openclaw/workspace. Skills are configured for coding agents, GitHub operations, weather, and various other tasks.",
    source: "MEMORY.md",
    tags: ["openclaw", "configuration", "discord"],
    createdAt: Date.now() - 86400000 * 50,
    updatedAt: Date.now() - 86400000 * 15,
  },
  {
    id: "6",
    title: "Content Pipeline Workflow",
    content: "Content goes through stages: idea → outline → draft → revision → final → published. AX manages content strategy while Work assists with writing and editing. Images can be attached at any stage.",
    source: "memory/2026-03-20.md",
    tags: ["content", "workflow", "pipeline"],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000,
  },
];

export default function MemoryPage() {
  const { t } = useI18n();
  const [memories] = useState<Memory[]>(initialMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    memories.forEach((m) => m.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [memories]);

  const filteredMemories = useMemo(() => {
    return memories.filter((memory) => {
      const matchesSearch =
        searchQuery === "" ||
        memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = filterTag === null || memory.tags?.includes(filterTag);
      return matchesSearch && matchesTag;
    });
  }, [memories, searchQuery, filterTag]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <MissionControlLayout>
      <div className="page-content">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>{t("memory.title")}</h1>
        </div>

        {/* Search and Filter */}
        <div className="card mb-4">
          <div className="search-box mb-3">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="input"
              placeholder={t("memory.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
            <button
              className={`badge ${filterTag === null ? "badge-blue" : ""}`}
              style={{
                background: filterTag === null ? "var(--accent-blue)" : "var(--bg-tertiary)",
                color: filterTag === null ? "white" : "var(--text-secondary)",
                cursor: "pointer",
                border: "none",
              }}
              onClick={() => setFilterTag(null)}
            >
              {t("tasks.filterAll")}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`badge ${filterTag === tag ? "badge-purple" : ""}`}
                style={{
                  background: filterTag === tag ? "var(--accent-purple)" : "var(--bg-tertiary)",
                  color: filterTag === tag ? "white" : "var(--text-secondary)",
                  cursor: "pointer",
                  border: "none",
                }}
                onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 400px", gap: "24px" }}>
          {/* Memory List */}
          <div className="flex flex-col gap-3">
            {filteredMemories.length > 0 ? (
              filteredMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="memory-card"
                  onClick={() => setSelectedMemory(memory)}
                  style={{
                    cursor: "pointer",
                    border: selectedMemory?.id === memory.id ? "2px solid var(--accent-blue)" : undefined,
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{memory.title}</h3>
                    <span className="badge badge-cyan">{memory.source}</span>
                  </div>
                  <p className="memory-content" style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}>
                    {memory.content}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                      {memory.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="badge badge-blue" style={{ fontSize: "10px" }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted">
                      {formatDate(memory.updatedAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🧠</div>
                <p>{t("memory.noMemories")}</p>
              </div>
            )}
          </div>

          {/* Memory Detail */}
          <div className="card" style={{ height: "fit-content", position: "sticky", top: "84px" }}>
            {selectedMemory ? (
              <>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="font-semibold" style={{ fontSize: "18px" }}>
                    {selectedMemory.title}
                  </h2>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: "4px 8px" }}
                    onClick={() => setSelectedMemory(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="flex gap-2 mb-3">
                  <span className="badge badge-cyan">{selectedMemory.source}</span>
                  <span className="text-xs text-muted">
                    {t("memory.lastUpdated")}: {formatDate(selectedMemory.updatedAt)}
                  </span>
                </div>

                <div className="flex gap-2 mb-4" style={{ flexWrap: "wrap" }}>
                  {selectedMemory.tags?.map((tag) => (
                    <span key={tag} className="badge badge-purple" style={{ fontSize: "11px" }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <div style={{
                  background: "var(--bg-tertiary)",
                  padding: "16px",
                  borderRadius: "8px",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}>
                  <pre className="text-sm" style={{
                    fontFamily: "inherit",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}>
                    {selectedMemory.content}
                  </pre>
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ padding: "48px 24px" }}>
                <div className="empty-icon">📋</div>
                <p className="text-muted">Select a memory to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MissionControlLayout>
  );
}
