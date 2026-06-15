"use client";
import { Bell, Search, Plus, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Welcome back, Ana 👋" },
  "/projects": { title: "Projects", subtitle: "Manage your creative projects" },
  "/tasks": { title: "Tasks", subtitle: "Track your team's progress" },
  "/calendar": { title: "Calendar", subtitle: "Schedule and deadlines" },
  "/clients": { title: "Clients", subtitle: "Client relationship management" },
  "/metrics": { title: "Metrics", subtitle: "Performance analytics" },
  "/integrations": { title: "Integrations", subtitle: "Connect your tools" },
  "/ai-assistant": { title: "AI Assistant", subtitle: "Your intelligent creative partner" },
  "/settings": { title: "Settings", subtitle: "Configure your workspace" },
};

export function Topbar() {
  const pathname = usePathname();
  const page = Object.entries(pageTitles).find(([key]) =>
    pathname === key || pathname.startsWith(key + "/")
  );
  const info = page?.[1] ?? { title: "ONE TAKE OS", subtitle: "" };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-dark-border bg-dark-300 flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-white">{info.title}</h1>
        <p className="text-sm text-gray-400">{info.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 pl-9 pr-4 py-2 bg-dark-50 border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* AI Quick Action */}
        <button className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-xl text-sm text-primary-300 hover:bg-primary/20 transition-colors">
          <Sparkles className="w-4 h-4" />
          <span className="hidden md:inline">Ask AI</span>
        </button>

        {/* New Project */}
        <button className="flex items-center gap-2 px-3 py-2 bg-primary rounded-xl text-sm text-white font-medium hover:bg-primary-600 transition-colors shadow-purple">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">New Project</span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-dark-50 border border-dark-border hover:border-primary/30 transition-colors">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center text-white font-bold">
            8
          </span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold text-white cursor-pointer hover:bg-primary-400 transition-colors">
          AL
        </div>
      </div>
    </header>
  );
}
