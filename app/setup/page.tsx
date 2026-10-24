"use client";

import MissionControlLayout from "@/components/MissionControlLayout";
import { useI18n } from "@/lib/i18n";

export default function SetupPage() {
  const { t } = useI18n();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <MissionControlLayout>
      <div className="page-content">
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
          Database Setup / 数据库设置
        </h1>

        <div className="card mb-4">
          <h2 className="card-title mb-3">Supabase SQL Setup</h2>
          <p className="text-secondary text-sm mb-4">
            Run this SQL in your Supabase SQL Editor to create all required tables and seed initial data.
          </p>
          <p className="text-secondary text-sm mb-4">
            在 Supabase SQL 编辑器中运行此 SQL 以创建所有必需的表并填充初始数据。
          </p>
          <div style={{
            background: "var(--bg-tertiary)",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
            maxHeight: "400px",
            overflow: "auto",
          }}>
            <pre style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "var(--accent-green)",
              whiteSpace: "pre-wrap",
            }}>
{`-- Mission Control Database Setup
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.mc_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  assignee TEXT DEFAULT 'AX',
  priority TEXT,
  due_date BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mc_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  stage TEXT DEFAULT 'idea',
  content_type TEXT DEFAULT 'video',
  idea TEXT, outline TEXT, script TEXT, notes TEXT,
  images TEXT[],
  assignee TEXT DEFAULT 'AX',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mc_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'task',
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  assignee TEXT,
  cron_expression TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mc_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  avatar TEXT NOT NULL,
  status TEXT DEFAULT 'idle',
  current_task TEXT,
  description TEXT,
  description_zh TEXT,
  specialty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mc_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_agents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_memories;

-- RLS Policies
ALTER TABLE public.mc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON public.mc_tasks FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_content FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_events FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_agents FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_memories FOR ALL USING (true);`}
            </pre>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => copyToClipboard(`-- Mission Control Database Setup
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.mc_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  assignee TEXT DEFAULT 'AX',
  priority TEXT,
  due_date BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mc_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  stage TEXT DEFAULT 'idea',
  content_type TEXT DEFAULT 'video',
  idea TEXT, outline TEXT, script TEXT, notes TEXT,
  images TEXT[],
  assignee TEXT DEFAULT 'AX',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mc_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'task',
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  assignee TEXT,
  cron_expression TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mc_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  avatar TEXT NOT NULL,
  status TEXT DEFAULT 'idle',
  current_task TEXT,
  description TEXT,
  description_zh TEXT,
  specialty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mc_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_agents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_memories;

ALTER TABLE public.mc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON public.mc_tasks FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_content FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_events FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_agents FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_memories FOR ALL USING (true);`)}
          >
            📋 Copy SQL
          </button>
        </div>

        <div className="card">
          <h2 className="card-title mb-3">Real-time Architecture</h2>
          <div className="grid grid-2">
            <div>
              <h3 className="font-medium mb-2">Current State / 当前状态</h3>
              <p className="text-sm text-secondary mb-3">
                The Mission Control currently uses local React state for demonstration.
              </p>
              <p className="text-sm text-secondary">
                Mission Control 目前使用本地 React state 进行演示。
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Real-time Ready / 实时就绪</h3>
              <p className="text-sm text-secondary mb-3">
                Once tables are created, the system will automatically connect to Supabase for live data sync across all connected clients.
              </p>
              <p className="text-sm text-secondary">
                创建表后，系统将自动连接到 Supabase，实现所有已连接客户端之间的实时数据同步。
              </p>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <h2 className="card-title mb-3">Steps to Enable Real-time</h2>
          <ol className="text-sm text-secondary" style={{ lineHeight: 2 }}>
            <li>1. Go to your Supabase Dashboard → SQL Editor</li>
            <li>2. Run the SQL script above to create tables</li>
            <li>3. Enable Realtime in Supabase → Database → Replication</li>
            <li>4. Refresh Mission Control - data will sync automatically</li>
          </ol>
        </div>
      </div>
    </MissionControlLayout>
  );
}
