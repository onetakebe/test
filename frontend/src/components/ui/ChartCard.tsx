"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, actions, children, className }: ChartCardProps) {
  return (
    <div
      className={cn(
        "bg-dark-card border border-dark-border rounded-2xl p-5",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
