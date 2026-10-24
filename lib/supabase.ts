import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lhjeskwaeddmbtqgiwrn.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Mission Control Tables:
// - tasks: id, title, description, status, assignee, priority, due_date, created_at, updated_at
// - content: id, title, stage, content_type, idea, outline, script, notes, images, assignee, created_at, updated_at
// - events: id, title, description, type, start_time, end_time, assignee, cron_expression, created_at
// - agents: id, name, role, title, title_zh, avatar, status, current_task, description, description_zh, created_at, updated_at
// - memories: id, title, content, source, tags, created_at, updated_at

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type Assignee = "AX" | "Work";
export type Priority = "low" | "medium" | "high";
export type ContentStage = "idea" | "outline" | "draft" | "revision" | "final" | "published";
export type ContentType = "video" | "post" | "article" | "script" | "other";
export type EventType = "task" | "scheduled" | "cron" | "reminder";
export type AgentRole = "coordinator" | "developer" | "writer" | "designer";
export type AgentStatus = "active" | "idle" | "away";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: Assignee;
  priority?: Priority;
  due_date?: number;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  title: string;
  stage: ContentStage;
  content_type: ContentType;
  idea?: string;
  outline?: string;
  script?: string;
  notes?: string;
  images?: string[];
  assignee: Assignee;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  start_time: number;
  end_time?: number;
  assignee?: Assignee;
  cron_expression?: string;
  created_at: string;
}

export interface Agent {
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

export interface Memory {
  id: string;
  title: string;
  content: string;
  source: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}
