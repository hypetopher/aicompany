import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lhjeskwaeddmbtqgiwrn.supabase.co";

let client: SupabaseClient | null = null;

/**
 * Lazily create the Supabase client.
 *
 * `createClient()` throws immediately when the key is empty ("supabaseKey is
 * required"). Calling it at module scope therefore made `next build` fail on any
 * machine without credentials — Next.js evaluates route modules while collecting
 * page data, so a fresh clone (no .env) could never build. Deferring creation
 * to first use keeps the build credential-independent and fails at request time
 * with a clear message instead.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!supabaseKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is not set — copy .env.example to .env and fill it in",
      );
    }
    client = createClient(supabaseUrl, supabaseKey);
  }
  return client;
}

/**
 * Lazy proxy so `import { supabase } from "@/lib/supabase"` keeps working
 * without constructing a client at module load time.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const real = getSupabase();
    const value = real[prop as keyof SupabaseClient];
    return typeof value === "function" ? value.bind(real) : value;
  },
});

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
