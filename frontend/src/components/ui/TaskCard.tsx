"use client";
import { Task } from "@/data/tasks";
import { Badge, statusToBadgeVariant } from "./Badge";
import { Calendar, FolderKanban } from "lucide-react";
import { formatDateShort, getDaysUntil, cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  className?: string;
  onClick?: () => void;
}

export function TaskCard({ task, className, onClick }: TaskCardProps) {
  const daysLeft = getDaysUntil(task.dueDate);
  const overdue = daysLeft < 0 && !task.completed;

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-dark-card border border-dark-border rounded-2xl p-4 hover:border-primary/30 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-white leading-snug group-hover:text-primary-300 transition-colors">
          {task.title}
        </h4>
        <Badge variant={statusToBadgeVariant(task.priority)} className="capitalize flex-shrink-0">
          {task.priority}
        </Badge>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
        {task.description}
      </p>

      <div className="flex items-center gap-1.5 mb-3">
        <FolderKanban className="w-3.5 h-3.5 text-primary-400 flex-shrink-0" />
        <span className="text-xs text-gray-400 truncate">{task.projectName}</span>
      </div>

      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex items-center gap-1 text-xs",
            overdue ? "text-red-400 font-semibold" : "text-gray-500"
          )}
        >
          <Calendar className="w-3.5 h-3.5" />
          {formatDateShort(task.dueDate)}
          {overdue && <span className="ml-1">· overdue</span>}
        </div>
        <div
          title={task.assignee.name}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-dark-card"
          style={{ backgroundColor: task.assignee.color }}
        >
          {task.assignee.initials}
        </div>
      </div>
    </div>
  );
}
