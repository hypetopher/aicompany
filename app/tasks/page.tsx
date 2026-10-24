"use client";

import { useState, useEffect, useCallback } from "react";
import MissionControlLayout from "@/components/MissionControlLayout";
import { useI18n } from "@/lib/i18n";

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type Assignee = "AX" | "Work";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: Assignee;
  priority?: "low" | "medium" | "high";
  due_date?: number;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<TaskStatus, string> = {
  todo: "var(--accent-yellow)",
  in_progress: "var(--accent-blue)",
  review: "var(--accent-purple)",
  done: "var(--accent-green)",
};

export default function TasksPage() {
  const { t } = useI18n();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [filterAssignee, setFilterAssignee] = useState<Assignee | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
    assignee: "AX",
    priority: "medium",
  });

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch("/api/mc/tasks");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const columns: { status: TaskStatus; title: string }[] = [
    { status: "todo", title: t("tasks.status.todo") },
    { status: "in_progress", title: t("tasks.status.in_progress") },
    { status: "review", title: t("tasks.status.review") },
    { status: "done", title: t("tasks.status.done") },
  ];

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    if (filterAssignee !== "all" && task.assignee !== filterAssignee) return false;
    return true;
  });

  const handleAddTask = async () => {
    if (!newTask.title) return;
    try {
      const response = await fetch("/api/mc/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTask,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
      if (response.ok) {
        const task = await response.json();
        setTasks([task, ...tasks]);
        setShowModal(false);
        setNewTask({ title: "", description: "", status: "todo", assignee: "AX", priority: "medium" });
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await fetch("/api/mc/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus, updated_at: new Date().toISOString() }),
      });
      if (response.ok) {
        setTasks(tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus, updated_at: new Date().toISOString() } : task
        ));
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <MissionControlLayout>
      <div className="page-content">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>{t("tasks.title")}</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + {t("tasks.newTask")}
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <select
            className="input select"
            style={{ width: "auto" }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "all")}
          >
            <option value="all">{t("tasks.filterAll")} {t("tasks.status.todo")}</option>
            {columns.map((col) => (
              <option key={col.status} value={col.status}>{col.title}</option>
            ))}
          </select>

          <select
            className="input select"
            style={{ width: "auto" }}
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value as Assignee | "all")}
          >
            <option value="all">{t("tasks.filterAll")} Assignee</option>
            <option value="AX">{t("tasks.assignee.AX")}</option>
            <option value="Work">{t("tasks.assignee.Work")}</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>{t("common.loading")}</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>{t("tasks.noTasks")}</p>
            <p className="text-sm">{t("tasks.addFirst")}</p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {columns.map((col) => (
              <div key={col.status} className="kanban-column">
                <div className="kanban-header">
                  <div className="kanban-title">
                    <span className="status-dot" style={{ background: statusColors[col.status] }} />
                    {col.title}
                  </div>
                  <span className="kanban-count">
                    {filteredTasks.filter((t) => t.status === col.status).length}
                  </span>
                </div>
                <div className="kanban-cards">
                  {filteredTasks
                    .filter((task) => task.status === col.status)
                    .map((task) => (
                      <div key={task.id} className="task-card">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`badge badge-${task.priority === "high" ? "red" : task.priority === "medium" ? "yellow" : "blue"}`}>
                            {task.priority && t(`tasks.priority.${task.priority}`)}
                          </span>
                          <span className="text-xs text-muted">
                            {task.assignee === "AX" ? "👤" : "🤖"}
                          </span>
                        </div>
                        <h3 className="font-medium mb-2">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-secondary">{task.description}</p>
                        )}
                        <div className="flex gap-2 mt-3">
                          {columns
                            .filter((c) => c.status !== task.status)
                            .map((c) => (
                              <button
                                key={c.status}
                                className="text-xs"
                                style={{
                                  background: "var(--bg-tertiary)",
                                  border: "none",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                                onClick={() => updateTaskStatus(task.id, c.status)}
                              >
                                → {c.title}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{t("tasks.newTask")}</h2>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="input"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="input"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description..."
                />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">{t("tasks.filterByStatus")}</label>
                  <select
                    className="input select"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as TaskStatus })}
                  >
                    {columns.map((col) => (
                      <option key={col.status} value={col.status}>{col.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assignee</label>
                  <select
                    className="input select"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value as Assignee })}
                  >
                    <option value="AX">{t("tasks.assignee.AX")}</option>
                    <option value="Work">{t("tasks.assignee.Work")}</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="input select"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as "low" | "medium" | "high" })}
                >
                  <option value="low">{t("tasks.priority.low")}</option>
                  <option value="medium">{t("tasks.priority.medium")}</option>
                  <option value="high">{t("tasks.priority.high")}</option>
                </select>
              </div>
              <div className="flex gap-2" style={{ marginTop: "20px" }}>
                <button className="btn btn-primary" onClick={handleAddTask}>
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
