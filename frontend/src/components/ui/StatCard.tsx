"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: { value: string; positive: boolean };
  highlight?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  trend,
  highlight,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 border transition-all duration-200 hover:shadow-card hover:-translate-y-0.5",
        highlight
          ? "bg-purple-gradient border-primary/30 shadow-purple"
          : "bg-dark-card border-dark-border",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            highlight ? "bg-white/20" : "bg-primary/10"
          )}
        >
          <Icon className={cn("w-5 h-5", highlight ? "text-white" : iconColor)} />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-full",
              trend.positive
                ? "bg-green-400/10 text-green-400"
                : "bg-red-400/10 text-red-400"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p
        className={cn(
          "text-2xl font-bold mb-1",
          highlight ? "text-white" : "text-white"
        )}
      >
        {value}
      </p>
      <p className={cn("text-sm font-medium", highlight ? "text-white/80" : "text-gray-400")}>
        {title}
      </p>
      {subtitle && (
        <p className={cn("text-xs mt-1", highlight ? "text-white/60" : "text-gray-500")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
