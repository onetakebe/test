import { cn } from "@/lib/utils";

interface Avatar {
  name: string;
  initials: string;
  color: string;
}

interface AvatarGroupProps {
  avatars: Avatar[];
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function AvatarGroup({ avatars, max = 3, size = "sm", className }: AvatarGroupProps) {
  const shown = avatars.slice(0, max);
  const extra = avatars.length - max;
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm" };

  return (
    <div className={cn("flex -space-x-2", className)}>
      {shown.map((a, i) => (
        <div
          key={i}
          title={a.name}
          className={cn(
            "rounded-full border-2 border-dark-card flex items-center justify-center font-bold text-white ring-0",
            sizes[size]
          )}
          style={{ backgroundColor: a.color }}
        >
          {a.initials}
        </div>
      ))}
      {extra > 0 && (
        <div
          className={cn(
            "rounded-full border-2 border-dark-card flex items-center justify-center font-bold text-gray-300 bg-dark-50",
            sizes[size]
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
