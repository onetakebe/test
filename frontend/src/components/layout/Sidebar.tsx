"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Users,
  BarChart3,
  Zap,
  Bot,
  Settings,
  Clapperboard,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/metrics", label: "Metrics", icon: BarChart3 },
  { href: "/integrations", label: "Integrations", icon: Zap },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
];

const bottomItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-dark-300 border-r border-dark-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-dark-border">
        <div className="w-9 h-9 rounded-xl bg-purple-gradient flex items-center justify-center shadow-purple">
          <Clapperboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-white leading-none">ONE TAKE</p>
          <p className="text-xs text-primary-400 font-semibold tracking-widest">OS</p>
        </div>
      </div>

      {/* Workspace selector */}
      <div className="px-4 py-3 border-b border-dark-border">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-50 transition-colors group">
          <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">OT</span>
          </div>
          <span className="text-sm text-white font-medium flex-1 text-left">One Take Studio</span>
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary text-white shadow-purple"
                  : "text-gray-400 hover:text-white hover:bg-dark-50"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5", active ? "text-white" : "text-gray-500")} size={18} />
              {label}
              {label === "AI Assistant" && (
                <span className="ml-auto px-1.5 py-0.5 text-xs bg-primary-500/20 text-primary-300 rounded-full font-semibold">
                  NEW
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-dark-border space-y-1">
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white hover:bg-dark-50"
              )}
            >
              <Icon size={18} className={active ? "text-white" : "text-gray-500"} />
              {label}
            </Link>
          );
        })}
        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white">
            AL
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Ana Lima</p>
            <p className="text-xs text-gray-500 truncate">Creative Director</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
