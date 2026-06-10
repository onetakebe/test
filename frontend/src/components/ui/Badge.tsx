import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  className?: string;
}

const variantStyles = {
  default: "bg-gray-400/10 text-gray-400 border-gray-400/20",
  success: "bg-green-400/10 text-green-400 border-green-400/20",
  warning: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  danger: "bg-red-400/10 text-red-400 border-red-400/20",
  info: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  purple: "bg-primary/10 text-primary-300 border-primary/20",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusToBadgeVariant(status: string): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    "in-progress": "info",
    "completed": "success",
    "planning": "warning",
    "review": "warning",
    "on-hold": "default",
    "todo": "default",
    "in-review": "warning",
    "waiting-client": "warning",
    "active": "success",
    "inactive": "default",
    "prospect": "info",
    "vip": "purple",
    "urgent": "danger",
    "high": "warning",
    "medium": "info",
    "low": "success",
    "connected": "success",
    "disconnected": "default",
  };
  return map[status] ?? "default";
}
