"use client";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface AIBlockProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AIBlock({ title = "AI Insight", subtitle, children, footer, className }: AIBlockProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-br from-primary/20 via-dark-card to-dark-card border border-primary/20 rounded-2xl p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-purple">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

interface AIInsightProps {
  tone?: "purple" | "success" | "warning" | "danger";
  label: string;
  children: ReactNode;
}

const tones = {
  purple: { box: "bg-primary/10 border-primary/20", label: "text-primary-300" },
  success: { box: "bg-green-500/10 border-green-500/20", label: "text-green-400" },
  warning: { box: "bg-yellow-500/10 border-yellow-500/20", label: "text-yellow-400" },
  danger: { box: "bg-red-500/10 border-red-500/20", label: "text-red-400" },
};

export function AIInsight({ tone = "purple", label, children }: AIInsightProps) {
  const t = tones[tone];
  return (
    <div className={cn("rounded-xl p-3 border", t.box)}>
      <p className={cn("text-xs font-semibold mb-1", t.label)}>{label}</p>
      <p className="text-xs text-gray-300 leading-relaxed">{children}</p>
    </div>
  );
}
