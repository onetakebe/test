import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  className,
  barClassName,
  showLabel,
  size = "md",
}: ProgressBarProps) {
  const heights = { sm: "h-1", md: "h-2", lg: "h-3" };
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex-1 rounded-full bg-dark-200", heights[size])}>
        <div
          className={cn(
            "rounded-full transition-all duration-500",
            heights[size],
            clampedValue >= 80
              ? "bg-green-400"
              : clampedValue >= 50
              ? "bg-primary"
              : clampedValue >= 25
              ? "bg-yellow-400"
              : "bg-red-400",
            barClassName
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 w-8 text-right">{clampedValue}%</span>
      )}
    </div>
  );
}
