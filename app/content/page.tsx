"use client";

import { useState } from "react";
import MissionControlLayout from "@/components/MissionControlLayout";
import { useI18n } from "@/lib/i18n";

type ContentStage = "idea" | "outline" | "draft" | "revision" | "final" | "published";
type ContentType = "video" | "post" | "article" | "script" | "other";

interface ContentItem {
  id: string;
  title: string;
  stage: ContentStage;
  contentType: ContentType;
  idea?: string;
  outline?: string;
  script?: string;
  notes?: string;
  images: string[];
  assignee: "AX" | "Work";
  createdAt: number;
  updatedAt: number;
}

const initialContent: ContentItem[] = [
  {
    id: "1",
    title: "Mission Control Launch Video",
    stage: "draft",
    contentType: "video",
    idea: "Create an engaging video explaining the Mission Control system to users",
    script: "# Mission Control Launch Video\n\n## Opening\nWelcome to Mission Control - your AI-powered command center...\n\n## Main Points\n1. Task Management\n2. Content Pipeline\n3. Team Coordination\n4. Calendar & Scheduling",
    assignee: "Work",
    images: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "2",
    title: "Weekly Newsletter Issue #1",
    stage: "idea",
    contentType: "post",
    idea: "Newsletter announcing the launch of Mission Control features",
    assignee: "AX",
    images: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const stages: ContentStage[] = ["idea", "outline", "draft", "revision", "final", "published"];
const stageColors: Record<ContentStage, string> = {
  idea: "var(--accent-yellow)",
  outline: "#f97316",
  draft: "var(--accent-blue)",
  revision: "var(--accent-purple)",
  final: "var(--accent-cyan)",
  published: "var(--accent-green)",
};

const contentTypes: ContentType[] = ["video", "post", "article", "script", "other"];

export default function ContentPage() {
  const { t } = useI18n();
  const [contents, setContents] = useState<ContentItem[]>(initialContent);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newContent, setNewContent] = useState<Partial<ContentItem>>({
    title: "",
    stage: "idea",
    contentType: "video",
    assignee: "AX",
  });
  const [activeTab, setActiveTab] = useState<"idea" | "outline" | "script" | "notes">("idea");

  const handleAddContent = () => {
    if (!newContent.title) return;
    const item: ContentItem = {
      id: Date.now().toString(),
      title: newContent.title || "",
      stage: newContent.stage as ContentStage || "idea",
      contentType: newContent.contentType as ContentType || "video",
      idea: "",
      script: "",
      notes: "",
      images: [],
      assignee: newContent.assignee as "AX" | "Work" || "AX",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setContents([...contents, item]);
    setShowModal(false);
    setNewContent({ title: "", stage: "idea", contentType: "video", assignee: "AX" });
  };

  const updateContentField = (id: string, field: string, value: string) => {
    setContents(contents.map((c) =>
      c.id === id ? { ...c, [field]: value, updatedAt: Date.now() } : c
    ));
    if (selectedContent?.id === id) {
      setSelectedContent({ ...selectedContent, [field]: value } as ContentItem);
    }
  };

  const moveToStage = (id: string, newStage: ContentStage) => {
    setContents(contents.map((c) =>
      c.id === id ? { ...c, stage: newStage, updatedAt: Date.now() } : c
    ));
  };

  return (
    <MissionControlLayout>
      <div className="page-content">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>{t("content.title")}</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + {t("content.newContent")}
          </button>
        </div>

        {/* Stage Pipeline */}
        <div className="flex gap-2 mb-4" style={{ overflowX: "auto", paddingBottom: "8px" }}>
          {stages.map((stage, index) => (
            <div key={stage} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {index > 0 && (
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>→</span>
              )}
              <button
                className="badge"
                style={{
                  background: `${stageColors[stage]}20`,
                  color: stageColors[stage],
                  border: "1px solid",
                  borderColor: `${stageColors[stage]}50`,
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                {t(`content.stage.${stage}`)}
                <span style={{ marginLeft: "8px", opacity: 0.7 }}>
                  {contents.filter((c) => c.stage === stage).length}
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-3">
          {contents.map((item) => (
            <div key={item.id} className="content-card" onClick={() => setSelectedContent(item)}>
              <div className="content-stage">
                <span className="stage-indicator" style={{ background: stageColors[item.stage] }} />
                <span className="text-sm font-medium">{t(`content.stage.${item.stage}`)}</span>
                <span className={`badge badge-${item.contentType === "video" ? "pink" : item.contentType === "post" ? "blue" : "purple"}`} style={{ marginLeft: "auto" }}>
                  {t(`content.type.${item.contentType}`)}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              {item.idea && (
                <p className="text-sm text-secondary" style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {item.idea}
                </p>
              )}
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-muted">
                  {item.assignee === "AX" ? "👤 AX" : "🤖 Work"}
                </span>
                <div className="flex gap-1">
                  {stages.filter((s) => s !== item.stage).slice(0, 2).map((s) => (
                    <button
                      key={s}
                      className="text-xs"
                      style={{
                        background: "var(--bg-tertiary)",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveToStage(item.id, s);
                      }}
                    >
                      → {t(`content.stage.${s}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Detail Modal */}
        {selectedContent && (
          <div className="modal-overlay" onClick={() => setSelectedContent(null)}>
            <div className="modal" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">{selectedContent.title}</h2>
                  <div className="flex gap-2 mt-2">
                    <span className="badge" style={{ background: `${stageColors[selectedContent.stage]}20`, color: stageColors[selectedContent.stage] }}>
                      {t(`content.stage.${selectedContent.stage}`)}
                    </span>
                    <span className="badge badge-blue">
                      {t(`content.type.${selectedContent.contentType}`)}
                    </span>
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => setSelectedContent(null)}>✕</button>
              </div>

              <div className="flex gap-2 mb-4">
                {(["idea", "outline", "script", "notes"] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`btn ${activeTab === tab ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {t(`content.${tab}`)}
                  </button>
                ))}
              </div>

              {activeTab === "idea" && (
                <div className="form-group">
                  <textarea
                    className="input"
                    style={{ minHeight: "200px" }}
                    value={selectedContent.idea || ""}
                    onChange={(e) => updateContentField(selectedContent.id, "idea", e.target.value)}
                    placeholder={t("content.idea") + "..."}
                  />
                </div>
              )}

              {activeTab === "outline" && (
                <div className="form-group">
                  <textarea
                    className="input"
                    style={{ minHeight: "200px" }}
                    value={selectedContent.outline || ""}
                    onChange={(e) => updateContentField(selectedContent.id, "outline", e.target.value)}
                    placeholder={t("content.outline") + "..."}
                  />
                </div>
              )}

              {activeTab === "script" && (
                <div className="form-group">
                  <textarea
                    className="input"
                    style={{ minHeight: "300px", fontFamily: "'JetBrains Mono', monospace" }}
                    value={selectedContent.script || ""}
                    onChange={(e) => updateContentField(selectedContent.id, "script", e.target.value)}
                    placeholder={t("content.script") + "..."}
                  />
                </div>
              )}

              {activeTab === "notes" && (
                <div className="form-group">
                  <textarea
                    className="input"
                    style={{ minHeight: "200px" }}
                    value={selectedContent.notes || ""}
                    onChange={(e) => updateContentField(selectedContent.id, "notes", e.target.value)}
                    placeholder={t("content.notes") + "..."}
                  />
                </div>
              )}

              {selectedContent.images && selectedContent.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">{t("content.images")}</h4>
                  <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                    {selectedContent.images.map((img, i) => (
                      <div key={i} style={{
                        width: "100px",
                        height: "100px",
                        background: "var(--bg-tertiary)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <span className="text-muted">Image</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <select
                  className="input select"
                  style={{ width: "auto" }}
                  value={selectedContent.stage}
                  onChange={(e) => moveToStage(selectedContent.id, e.target.value as ContentStage)}
                >
                  {stages.map((s) => (
                    <option key={s} value={s}>{t(`content.stage.${s}`)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* New Content Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{t("content.newContent")}</h2>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="input"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  placeholder="Content title..."
                />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Stage</label>
                  <select
                    className="input select"
                    value={newContent.stage}
                    onChange={(e) => setNewContent({ ...newContent, stage: e.target.value as ContentStage })}
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>{t(`content.stage.${s}`)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="input select"
                    value={newContent.contentType}
                    onChange={(e) => setNewContent({ ...newContent, contentType: e.target.value as ContentType })}
                  >
                    {contentTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select
                  className="input select"
                  value={newContent.assignee}
                  onChange={(e) => setNewContent({ ...newContent, assignee: e.target.value as "AX" | "Work" })}
                >
                  <option value="AX">{t("tasks.assignee.AX")}</option>
                  <option value="Work">{t("tasks.assignee.Work")}</option>
                </select>
              </div>
              <div className="flex gap-2" style={{ marginTop: "20px" }}>
                <button className="btn btn-primary" onClick={handleAddContent}>
                  {t("common.add")}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MissionControlLayout>
  );
}
