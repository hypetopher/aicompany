-- Mission Control Database Setup for Supabase
-- Run this in Supabase SQL Editor to create all required tables

-- Tasks Table
CREATE TABLE IF NOT EXISTS public.mc_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  assignee TEXT DEFAULT 'AX' CHECK (assignee IN ('AX', 'Work')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  due_date BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Table
CREATE TABLE IF NOT EXISTS public.mc_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  stage TEXT DEFAULT 'idea' CHECK (stage IN ('idea', 'outline', 'draft', 'revision', 'final', 'published')),
  content_type TEXT DEFAULT 'video' CHECK (content_type IN ('video', 'post', 'article', 'script', 'other')),
  idea TEXT,
  outline TEXT,
  script TEXT,
  notes TEXT,
  images TEXT[],
  assignee TEXT DEFAULT 'AX' CHECK (assignee IN ('AX', 'Work')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS public.mc_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'task' CHECK (type IN ('task', 'scheduled', 'cron', 'reminder')),
  start_time BIGINT NOT NULL,
  end_time BIGINT,
  assignee TEXT CHECK (assignee IN ('AX', 'Work')),
  cron_expression TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents Table
CREATE TABLE IF NOT EXISTS public.mc_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('coordinator', 'developer', 'writer', 'designer')),
  title TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  avatar TEXT NOT NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('active', 'idle', 'away')),
  current_task TEXT,
  description TEXT,
  description_zh TEXT,
  specialty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memories Table
CREATE TABLE IF NOT EXISTS public.mc_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_content;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_agents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mc_memories;

-- Enable Row Level Security (optional - adjust based on your needs)
ALTER TABLE public.mc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mc_memories ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow all" ON public.mc_tasks FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_content FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_events FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_agents FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.mc_memories FOR ALL USING (true);

-- Seed initial data for Agents
INSERT INTO public.mc_agents (name, role, title, title_zh, avatar, status, current_task, description, description_zh, specialty) VALUES
('Work', 'coordinator', 'AI Coordinator', 'AI协调员', '🤖', 'active', 'Building Mission Control System', 'The main AI assistant that coordinates all operations.', '主要AI助手，协调所有操作。', 'Coordination'),
('AX', 'coordinator', 'Human Coordinator', '人类协调员', '👤', 'active', 'Overseeing AI Operations', 'The human operator.', '人类操作员。', 'Management'),
('CodeBot', 'developer', 'Code Generator', '代码生成器', '👨‍💻', 'active', 'Generating Next.js components', 'Specializes in writing code.', '专注写代码。', 'Full-stack'),
('DevMinion', 'developer', 'Task Executor', '任务执行者', '🔧', 'idle', NULL, 'Handles repetitive tasks.', '处理重复性任务。', 'DevOps'),
('Architect', 'developer', 'System Architect', '系统架构师', '🏗️', 'active', 'Designing scalable systems', 'Plans system architecture.', '规划系统架构。', 'System Design'),
('Quill', 'writer', 'Creative Writer', '创意作家', '✍️', 'active', 'Writing content pipeline', 'Creative writing specialist.', '创意写作专家。', 'Creative Writing'),
('Copywriter', 'writer', 'Marketing Copywriter', '营销文案', '📝', 'idle', NULL, 'Creates marketing copy.', '创作营销文案。', 'Marketing'),
('Editor', 'writer', 'Content Editor', '内容编辑', '📖', 'active', 'Reviewing drafts', 'Reviews content.', '审核内容。', 'Editing'),
('Designer', 'designer', 'UI Designer', 'UI设计师', '🎨', 'active', 'Designing dashboard', 'Creates user interfaces.', '创建用户界面。', 'UI/UX'),
('ArtDirector', 'designer', 'Art Director', '艺术总监', '🎭', 'away', NULL, 'Sets creative vision.', '设定创意愿景。', 'Creative Direction'),
('VisualMinion', 'designer', 'Visual Asset Creator', '视觉资产创建者', '🖼️', 'idle', NULL, 'Creates visual assets.', '创建视觉资产。', 'Visual Design')
ON CONFLICT (name) DO NOTHING;

-- Seed some sample tasks
INSERT INTO public.mc_tasks (title, description, status, assignee, priority) VALUES
('Build Mission Control UI', 'Create the Next.js app with all subsystems', 'in_progress', 'Work', 'high'),
('Design content pipeline', 'Plan the content creation workflow', 'todo', 'AX', 'medium'),
('Set up Convex database', 'Configure Convex schema and backend', 'done', 'Work', 'high')
ON CONFLICT DO NOTHING;

-- Seed some sample content
INSERT INTO public.mc_content (title, stage, content_type, idea, script, assignee) VALUES
('Mission Control Launch Video', 'draft', 'video', 'Create an engaging video explaining the Mission Control system', '# Mission Control Launch Video\n\n## Opening\nWelcome to Mission Control...', 'Work'),
('Weekly Newsletter Issue #1', 'idea', 'post', 'Newsletter announcing the launch of Mission Control features', NULL, 'AX')
ON CONFLICT DO NOTHING;
