"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus } from "lucide-react";
import { events, eventTypeConfig, CalendarEvent } from "@/data/events";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CalendarPage() {
  // Anchor on July 2024 where the mock data lives
  const [cursor, setCursor] = useState(new Date(2024, 6, 1));
  const [view, setView] = useState<"month" | "week">("month");
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      (map[ev.date] ??= []).push(ev);
    }
    return map;
  }, []);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const monthDays = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(start.getDate() - start.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [cursor]);

  const weekDays = useMemo(() => {
    const start = new Date(cursor);
    start.setDate(start.getDate() - start.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [cursor]);

  const navigate = (dir: -1 | 1) => {
    const next = new Date(cursor);
    if (view === "month") next.setMonth(next.getMonth() + dir);
    else next.setDate(next.getDate() + dir * 7);
    setCursor(next);
  };

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Meetings, shoots, deadlines, deliveries and postings"
        actions={<Button icon={Plus} onClick={() => setAddOpen(true)}>Add Event</Button>}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-dark-card border border-dark-border rounded-xl p-1">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h3 className="text-lg font-bold text-white">{monthLabel}</h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden lg:flex items-center gap-3">
            {Object.entries(eventTypeConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                <span className="text-xs text-gray-400">{cfg.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-1 bg-dark-card border border-dark-border rounded-xl p-1">
            {(["week", "month"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                  view === v ? "bg-primary text-white" : "text-gray-400 hover:text-white"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Month view */}
      {view === "month" && (
        <motion.div
          className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-7 border-b border-dark-border">
            {WEEKDAYS.map((d) => (
              <div key={d} className="px-2 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthDays.map((day, i) => {
              const key = toKey(day);
              const dayEvents = eventsByDate[key] ?? [];
              const inMonth = day.getMonth() === cursor.getMonth();
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[104px] border-b border-r border-dark-border p-1.5 [&:nth-child(7n)]:border-r-0",
                    !inMonth && "bg-dark-300/50"
                  )}
                >
                  <span className={cn("text-xs font-semibold px-1", inMonth ? "text-gray-300" : "text-gray-600")}>
                    {day.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map((ev) => {
                      const cfg = eventTypeConfig[ev.type];
                      return (
                        <button
                          key={ev.id}
                          onClick={() => setSelected(ev)}
                          className={cn(
                            "w-full text-left px-1.5 py-1 rounded-lg border text-xs truncate flex items-center gap-1.5 hover:brightness-125 transition-all",
                            cfg.bg,
                            cfg.text
                          )}
                        >
                          <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
                          <span className="truncate">{ev.title}</span>
                        </button>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <p className="text-xs text-gray-500 px-1">+{dayEvents.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Week view */}
      {view === "week" && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-7 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {weekDays.map((day) => {
            const key = toKey(day);
            const dayEvents = (eventsByDate[key] ?? []).slice().sort((a, b) => a.startTime.localeCompare(b.startTime));
            return (
              <div key={key} className="bg-dark-card border border-dark-border rounded-2xl p-3 min-h-[200px]">
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{WEEKDAYS[day.getDay()]}</p>
                  <p className="text-lg font-bold text-white">{day.getDate()}</p>
                </div>
                <div className="space-y-2">
                  {dayEvents.map((ev) => {
                    const cfg = eventTypeConfig[ev.type];
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setSelected(ev)}
                        className={cn("w-full text-left p-2 rounded-xl border hover:brightness-125 transition-all", cfg.bg)}
                      >
                        <p className={cn("text-xs font-semibold leading-snug", cfg.text)}>{ev.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{ev.startTime}</p>
                      </button>
                    );
                  })}
                  {dayEvents.length === 0 && (
                    <p className="text-xs text-gray-600 text-center pt-4">No events</p>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Event detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        subtitle={selected ? eventTypeConfig[selected.type].label : undefined}
      >
        {selected && (
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-400" />
              {selected.date} · {selected.startTime}
              {selected.endTime !== selected.startTime && ` – ${selected.endTime}`}
            </div>
            {selected.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                {selected.location}
              </div>
            )}
            {selected.projectName && (
              <p className="text-gray-400">
                Related project: <span className="text-white font-medium">{selected.projectName}</span>
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* Add Event modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Event"
        subtitle="Schedule a new event on the team calendar"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => setAddOpen(false)}>Create Event</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Title</label>
            <input
              type="text"
              placeholder="e.g. Client review call"
              className="w-full px-4 py-2.5 bg-dark-200 border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Date</label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-dark-200 border border-dark-border rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Time</label>
              <input
                type="time"
                className="w-full px-4 py-2.5 bg-dark-200 border border-dark-border rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Type</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(eventTypeConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                    cfg.bg,
                    cfg.text
                  )}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Location (optional)</label>
            <input
              type="text"
              placeholder="Office, studio, or meeting link"
              className="w-full px-4 py-2.5 bg-dark-200 border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
