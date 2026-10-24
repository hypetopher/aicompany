"use client";

import { useState } from "react";
import MissionControlLayout from "@/components/MissionControlLayout";
import { useI18n } from "@/lib/i18n";

type EventType = "task" | "scheduled" | "cron" | "reminder";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startTime: number;
  endTime?: number;
  assignee?: "AX" | "Work";
  cronExpression?: string;
}

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Morning Standup",
    description: "Daily team sync",
    type: "scheduled",
    startTime: new Date().setHours(9, 0, 0, 0),
    endTime: new Date().setHours(9, 30, 0, 0),
    assignee: "Work",
  },
  {
    id: "2",
    title: "Content Review",
    description: "Review weekly content",
    type: "task",
    startTime: new Date().setHours(14, 0, 0, 0),
    assignee: "AX",
  },
  {
    id: "3",
    title: "Heartbeat Check",
    description: "Automated system health check",
    type: "cron",
    startTime: new Date().setHours(0, 0, 0, 0),
    cronExpression: "0 * * * *",
  },
];

const eventTypeColors: Record<EventType, string> = {
  task: "var(--accent-blue)",
  scheduled: "var(--accent-purple)",
  cron: "var(--accent-yellow)",
  reminder: "var(--accent-cyan)",
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const { t } = useI18n();
  const [events] = useState<CalendarEvent[]>(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day: number) => {
    const dayStart = new Date(year, month, day, 0, 0, 0).getTime();
    const dayEnd = new Date(year, month, day, 23, 59, 59).getTime();
    return events.filter((e) => e.startTime >= dayStart && e.startTime <= dayEnd);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day other-month">
          {new Date(year, month, -startingDayOfWeek + i + 1).getDate()}
        </div>
      );
    }

    // Days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      days.push(
        <div
          key={day}
          className={`calendar-day ${isToday(day) ? "today" : ""}`}
          onClick={() => setSelectedDate(new Date(year, month, day))}
        >
          <div className="flex justify-between items-center">
            <span className={isToday(day) ? "font-bold" : ""}>{day}</span>
            {dayEvents.length > 0 && (
              <span style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: dayEvents[0].type === "task" ? eventTypeColors.task :
                           dayEvents[0].type === "scheduled" ? eventTypeColors.scheduled :
                           dayEvents[0].type === "cron" ? eventTypeColors.cron :
                           eventTypeColors.reminder
              }} />
            )}
          </div>
          <div style={{ marginTop: "4px", overflow: "hidden" }}>
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="calendar-event"
                style={{
                  background: `${eventTypeColors[event.type]}20`,
                  color: eventTypeColors[event.type],
                }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate
    ? events.filter((e) => {
        const dayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0).getTime();
        const dayEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59).getTime();
        return e.startTime >= dayStart && e.startTime <= dayEnd;
      })
    : [];

  return (
    <MissionControlLayout>
      <div className="page-content">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>{t("calendar.title")}</h1>
          <div className="flex gap-2">
            <button className={`btn ${view === "month" ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("month")}>
              {t("calendar.month")}
            </button>
            <button className={`btn ${view === "week" ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("week")}>
              {t("calendar.week")}
            </button>
            <button className={`btn ${view === "day" ? "btn-primary" : "btn-secondary"}`} onClick={() => setView("day")}>
              {t("calendar.day")}
            </button>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr 350px", gap: "24px" }}>
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <button className="btn btn-secondary" onClick={prevMonth}>←</button>
              <div className="flex items-center gap-3">
                <h2 className="font-semibold" style={{ fontSize: "18px" }}>
                  {monthNames[month]} {year}
                </h2>
                <button className="btn btn-secondary" onClick={goToToday}>
                  {t("calendar.today")}
                </button>
              </div>
              <button className="btn btn-secondary" onClick={nextMonth}>→</button>
            </div>

            <div className="calendar-grid mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm text-muted font-medium" style={{ padding: "8px" }}>
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4" style={{ flexWrap: "wrap" }}>
              {(["task", "scheduled", "cron", "reminder"] as EventType[]).map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <span style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: eventTypeColors[type]
                  }} />
                  <span className="text-sm text-secondary">{t(`calendar.type.${type}`)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Events Sidebar */}
          <div className="card" style={{ height: "fit-content" }}>
            <h3 className="font-semibold mb-4">
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                : t("calendar.today")}
            </h3>

            {selectedDateEvents.length > 0 ? (
              <div className="flex flex-col gap-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="content-card"
                    style={{
                      borderLeft: `4px solid ${eventTypeColors[event.type]}`,
                      padding: "12px",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge" style={{
                        background: `${eventTypeColors[event.type]}20`,
                        color: eventTypeColors[event.type]
                      }}>
                        {t(`calendar.type.${event.type}`)}
                      </span>
                      {event.assignee && (
                        <span className="text-xs text-muted">
                          {event.assignee === "AX" ? "👤" : "🤖"}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium mb-1">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-secondary">{event.description}</p>
                    )}
                    {event.cronExpression && (
                      <p className="text-xs text-muted mt-1">
                        Cron: {event.cronExpression}
                      </p>
                    )}
                    <p className="text-xs text-muted mt-2">
                      {new Date(event.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      {event.endTime && ` - ${new Date(event.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "32px 16px" }}>
                <div className="empty-icon">📅</div>
                <p className="text-muted">{t("calendar.noEvents")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MissionControlLayout>
  );
}
