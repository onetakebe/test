"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, LayoutGrid, List, Calendar } from "lucide-react";
import { tasks, Task } from "@/data/tasks";
import { PageHeader } from "@/components/ui/PageHeader";
import { TaskCard } from "@/components/ui/TaskCard";
import { Badge, statusToBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateShort, cn } from "@/lib/utils";

const columns: { key: Task["status"]; label: string; accent: string }[] = [
  { key: "todo", label: "To Do", accent: "bg-gray-400" },
  { key: "in-progress", label: "In Progress", accent: "bg-blue-400" },
  { key: "in-review", label: "In Review", accent: "bg-orange-400" },
  { key: "waiting-client", label: "Waiting Client", accent: "bg-yellow-400" },
  { key: "completed", label: "Completed", accent: "bg-green-400" },
];

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const filtered = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.projectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.filter((t) => !t.completed).length} open · ${tasks.filter((t) => t.completed).length} completed`}
        actions={<Button icon={Plus}>New Task</Button>}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks or projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-dark-card border border-dark-border rounded-xl p-1 self-start">
          <button
            onClick={() => setView("kanban")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              view === "kanban" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Kanban
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              view === "list" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
            )}
          >
            <List className="w-4 h-4" />
            List
          </button>
        </div>
      </div>

      {/* Kanban view */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
          {columns.map((col, colIdx) => {
            const colTasks = filtered.filter((t) => t.status === col.key);
            return (
              <motion.div
                key={col.key}
                className="bg-dark-200 rounded-2xl p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: colIdx * 0.07 }}
              >
                <div className="flex items-center gap-2 px-1.5 mb-3">
                  <div className={cn("w-2 h-2 rounded-full", col.accent)} />
                  <span className="text-sm font-semibold text-white">{col.label}</span>
                  <span className="ml-auto text-xs text-gray-500 bg-dark-card px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="border border-dashed border-dark-border rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-600">No tasks</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-dark-border">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Task</span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Priority</span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Due Date</span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Assignee</span>
          </div>
          {filtered.map((task, i) => (
            <motion.div
              key={task.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-dark-border last:border-0 hover:bg-dark-50 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="min-w-0">
                <p className={cn("text-sm font-medium truncate", task.completed ? "text-gray-500 line-through" : "text-white")}>
                  {task.title}
                </p>
                <p className="text-xs text-gray-500 truncate">{task.projectName}</p>
              </div>
              <Badge variant={statusToBadgeVariant(task.status)} className="capitalize w-fit">
                {task.status.replace("-", " ")}
              </Badge>
              <Badge variant={statusToBadgeVariant(task.priority)} className="capitalize w-fit">
                {task.priority}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateShort(task.dueDate)}
              </div>
              <div
                title={task.assignee.name}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: task.assignee.color }}
              >
                {task.assignee.initials}
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">No tasks match your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
