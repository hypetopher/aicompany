"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "zh";

interface Translations {
  [key: string]: { en: string; zh: string };
}

const translations: Translations = {
  // Navigation
  "nav.missionControl": { en: "Mission Control", zh: "任务控制中心" },
  "nav.tasks": { en: "Task Board", zh: "任务看板" },
  "nav.content": { en: "Content Pipeline", zh: "内容流水线" },
  "nav.calendar": { en: "Calendar", zh: "日历" },
  "nav.memory": { en: "Memory", zh: "记忆库" },
  "nav.team": { en: "Team Structure", zh: "团队结构" },
  "nav.office": { en: "Digital Office", zh: "数字办公室" },

  // Task Board
  "tasks.title": { en: "Task Board", zh: "任务看板" },
  "tasks.newTask": { en: "New Task", zh: "新任务" },
  "tasks.status.todo": { en: "To Do", zh: "待办" },
  "tasks.status.in_progress": { en: "In Progress", zh: "进行中" },
  "tasks.status.review": { en: "Review", zh: "审核中" },
  "tasks.status.done": { en: "Done", zh: "已完成" },
  "tasks.assignee.AX": { en: "AX", zh: "AX" },
  "tasks.assignee.Work": { en: "Work (AI)", zh: "Work (AI助手)" },
  "tasks.priority.low": { en: "Low", zh: "低" },
  "tasks.priority.medium": { en: "Medium", zh: "中" },
  "tasks.priority.high": { en: "High", zh: "高" },
  "tasks.filterAll": { en: "All", zh: "全部" },
  "tasks.filterByStatus": { en: "Filter by Status", zh: "按状态筛选" },
  "tasks.filterByAssignee": { en: "Filter by Assignee", zh: "按负责人筛选" },
  "tasks.noTasks": { en: "No tasks yet", zh: "暂无任务" },
  "tasks.addFirst": { en: "Add your first task", zh: "添加你的第一个任务" },

  // Content Pipeline
  "content.title": { en: "Content Pipeline", zh: "内容流水线" },
  "content.newContent": { en: "New Content", zh: "新建内容" },
  "content.stage.idea": { en: "Idea", zh: "创意" },
  "content.stage.outline": { en: "Outline", zh: "大纲" },
  "content.stage.draft": { en: "Draft", zh: "草稿" },
  "content.stage.revision": { en: "Revision", zh: "修订" },
  "content.stage.final": { en: "Final", zh: "定稿" },
  "content.stage.published": { en: "Published", zh: "已发布" },
  "content.type.video": { en: "Video", zh: "视频" },
  "content.type.post": { en: "Post", zh: "帖子" },
  "content.type.article": { en: "Article", zh: "文章" },
  "content.type.script": { en: "Script", zh: "脚本" },
  "content.type.other": { en: "Other", zh: "其他" },
  "content.idea": { en: "Idea", zh: "创意" },
  "content.outline": { en: "Outline", zh: "大纲" },
  "content.script": { en: "Script", zh: "脚本" },
  "content.notes": { en: "Notes", zh: "备注" },
  "content.images": { en: "Images", zh: "图片" },

  // Calendar
  "calendar.title": { en: "Calendar", zh: "日历" },
  "calendar.today": { en: "Today", zh: "今天" },
  "calendar.month": { en: "Month", zh: "月" },
  "calendar.week": { en: "Week", zh: "周" },
  "calendar.day": { en: "Day", zh: "日" },
  "calendar.type.task": { en: "Task", zh: "任务" },
  "calendar.type.scheduled": { en: "Scheduled", zh: "计划" },
  "calendar.type.cron": { en: "Cron Job", zh: "定时任务" },
  "calendar.type.reminder": { en: "Reminder", zh: "提醒" },
  "calendar.noEvents": { en: "No events", zh: "无事件" },

  // Memory
  "memory.title": { en: "Memory", zh: "记忆库" },
  "memory.search": { en: "Search memories...", zh: "搜索记忆..." },
  "memory.noMemories": { en: "No memories found", zh: "未找到记忆" },
  "memory.source": { en: "Source", zh: "来源" },
  "memory.lastUpdated": { en: "Last updated", zh: "最后更新" },

  // Team
  "team.title": { en: "Team Structure", zh: "团队结构" },
  "team.role.coordinator": { en: "Coordinator", zh: "协调者" },
  "team.role.developer": { en: "Developer", zh: "开发者" },
  "team.role.writer": { en: "Writer", zh: "作家" },
  "team.role.designer": { en: "Designer", zh: "设计师" },
  "team.status.active": { en: "Active", zh: "工作中" },
  "team.status.idle": { en: "Idle", zh: "空闲" },
  "team.status.away": { en: "Away", zh: "离开" },
  "team.currentTask": { en: "Current Task", zh: "当前任务" },
  "team.noTask": { en: "No active task", zh: "无活跃任务" },

  // Digital Office
  "office.title": { en: "Digital Office", zh: "数字办公室" },
  "office.workArea": { en: "Work Area", zh: "工作区" },
  "office.atDesk": { en: "At Desk", zh: "在工位" },
  "office.away": { en: "Away", zh: "离开" },
  "office.computer": { en: "Computer", zh: "电脑" },

  // Common
  "common.save": { en: "Save", zh: "保存" },
  "common.cancel": { en: "Cancel", zh: "取消" },
  "common.delete": { en: "Delete", zh: "删除" },
  "common.edit": { en: "Edit", zh: "编辑" },
  "common.add": { en: "Add", zh: "添加" },
  "common.close": { en: "Close", zh: "关闭" },
  "common.search": { en: "Search", zh: "搜索" },
  "common.loading": { en: "Loading...", zh: "加载中..." },
  "common.error": { en: "Error", zh: "错误" },
  "common.success": { en: "Success", zh: "成功" },
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[lang] || translation.en || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
