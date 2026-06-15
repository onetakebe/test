"use client";
import Link from "next/link";
import { Notification } from "@/data/notifications";
import { cn } from "@/lib/utils";
import { Bell, CalendarClock, CheckCircle2, MessageSquare, CheckSquare } from "lucide-react";

interface NotificationCardProps {
  notification: Notification;
  className?: string;
}

const typeConfig = {
  deadline: { icon: CalendarClock, color: "text-red-400 bg-red-400/10" },
  comment: { icon: MessageSquare, color: "text-blue-400 bg-blue-400/10" },
  approval: { icon: CheckCircle2, color: "text-green-400 bg-green-400/10" },
  task: { icon: CheckSquare, color: "text-orange-400 bg-orange-400/10" },
  system: { icon: Bell, color: "text-primary-400 bg-primary/10" },
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationCard({ notification, className }: NotificationCardProps) {
  const config = typeConfig[notification.type] ?? typeConfig.system;
  const Icon = config.icon;

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-200",
        notification.isRead
          ? "bg-dark-card border-dark-border"
          : "bg-dark-card border-primary/20 hover:border-primary/40",
        notification.actionUrl && "cursor-pointer hover:bg-dark-50",
        className
      )}
    >
      {notification.avatar ? (
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ backgroundColor: notification.avatar.color }}
        >
          {notification.avatar.initials}
        </div>
      ) : (
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", config.color)}>
          <Icon className="w-4.5 h-4.5" size={18} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-white truncate">{notification.title}</p>
          <span className="text-xs text-gray-500 flex-shrink-0">{timeAgo(notification.createdAt)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{notification.message}</p>
      </div>
      {!notification.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
    </div>
  );

  if (notification.actionUrl) {
    return <Link href={notification.actionUrl}>{content}</Link>;
  }
  return content;
}
