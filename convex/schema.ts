import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Task Board
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("review"), v.literal("done")),
    assignee: v.union(v.literal("AX"), v.literal("Work")),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["status"]).index("by_assignee", ["assignee"]),

  // Content Pipeline
  content: defineTable({
    title: v.string(),
    stage: v.union(v.literal("idea"), v.literal("outline"), v.literal("draft"), v.literal("revision"), v.literal("final"), v.literal("published")),
    contentType: v.union(v.literal("video"), v.literal("post"), v.literal("article"), v.literal("script"), v.literal("other")),
    idea: v.optional(v.string()), // Rich text for ideas
    outline: v.optional(v.string()),
    script: v.optional(v.string()), // Full script content
    notes: v.optional(v.string()),
    images: v.optional(v.array(v.string())), // Image URLs
    assignee: v.union(v.literal("AX"), v.literal("Work")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_stage", ["stage"]),

  // Calendar Events
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("task"), v.literal("scheduled"), v.literal("cron"), v.literal("reminder")),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    assignee: v.optional(v.union(v.literal("AX"), v.literal("Work"))),
    taskId: v.optional(v.id("tasks")),
    cronExpression: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_time", ["startTime"]),

  // Team Members (Agents)
  agents: defineTable({
    name: v.string(),
    role: v.union(v.literal("coordinator"), v.literal("developer"), v.literal("writer"), v.literal("designer")),
    title: v.string(),
    titleZh: v.string(), // Chinese title
    avatar: v.string(), // Emoji or icon
    status: v.union(v.literal("active"), v.literal("idle"), v.literal("away")),
    currentTask: v.optional(v.string()),
    description: v.optional(v.string()),
    descriptionZh: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Memories
  memories: defineTable({
    title: v.string(),
    content: v.string(),
    source: v.string(), // e.g., "MEMORY.md", "memory/2026-03-21.md"
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_source", ["source"]),
});
