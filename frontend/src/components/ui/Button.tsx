import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconRight?: LucideIcon;
}

const variants = {
  primary: "bg-primary text-white hover:bg-primary-600 shadow-purple",
  secondary: "bg-dark-50 border border-dark-border text-white hover:border-primary/30",
  ghost: "text-gray-400 hover:text-white hover:bg-dark-50",
  danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-5 py-2.5 text-base rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", icon: Icon, iconRight: IconRight, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {Icon && <Icon size={size === "sm" ? 14 : 16} />}
        {children}
        {IconRight && <IconRight size={size === "sm" ? 14 : 16} />}
      </button>
    );
  }
);

Button.displayName = "Button";
