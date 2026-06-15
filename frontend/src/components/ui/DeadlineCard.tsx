"use client";
import { Deadline } from "@/data/deadlines";
import { Badge, statusToBadgeVariant } from "./Badge";
import { CalendarClock } from "lucide-react";
import { formatDateShort, getDaysUntil, cn } from "@/lib/utils";

interface DeadlineCardProps {
  deadline: Deadline;
  className?: string;
}

const priorityAccent: Record<string, string> = {
  urgent: "border-l-red-500",
  high: "border-l-orange-400",
  medium: "border-l-yellow-400",
  low: "border-l-green-400",
};

export function DeadlineCard({ deadline, className }: DeadlineCardProps) {
  const daysLeft = getDaysUntil(deadline.dueDate);
  const overdue = daysLeft < 0 && deadline.status !== "completed";

  return (
    <div
      className={cn(
        "bg-dark-card border border-dark-border border-l-4 rounded-2xl p-4 hover:border-primary/30 transition-all duration-200",
        priorityAccent[deadline.priority] ?? "border-l-gray-400",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{deadline.title}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{deadline.projectName}</p>
          {deadline.description && (
            <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
              {deadline.description}
            </p>
          )}
        </div>
        <Badge variant={statusToBadgeVariant(deadline.priority)} className="capitalize flex-shrink-0">
          {deadline.priority}
        </Badge>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <CalendarClock className="w-3.5 h-3.5 text-primary-400" />
          {formatDateShort(deadline.dueDate)}
        </div>
        <span
          className={cn(
            "text-xs font-semibold",
            overdue ? "text-red-400" : daysLeft <= 2 ? "text-orange-400" : "text-gray-500"
          )}
        >
          {overdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
        </span>
      </div>
    </div>
  );
}
