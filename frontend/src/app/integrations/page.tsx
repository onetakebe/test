"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Calendar,
  CheckCircle2,
  HardDrive,
  Instagram,
  Mail,
  MessageCircle,
  Plug,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  icon: typeof Plug;
  iconBg: string;
  connected: boolean;
  lastSync?: string;
}

const initialIntegrations: IntegrationItem[] = [
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync shoots, meetings and deadlines directly to the team calendar.",
    icon: Calendar,
    iconBg: "from-blue-500 to-blue-600",
    connected: true,
    lastSync: "10 minutes ago",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Track client emails and turn briefings into projects automatically.",
    icon: Mail,
    iconBg: "from-red-500 to-orange-500",
    connected: true,
    lastSync: "25 minutes ago",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Attach raw footage, exports and documents from shared drives.",
    icon: HardDrive,
    iconBg: "from-yellow-500 to-green-500",
    connected: true,
    lastSync: "1 hour ago",
  },
  {
    id: "instagram-meta",
    name: "Instagram / Meta",
    description: "Pull post metrics, engagement rates and audience insights per client.",
    icon: Instagram,
    iconBg: "from-pink-500 to-purple-500",
    connected: true,
    lastSync: "2 hours ago",
  },
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    description: "Notify clients about approvals and deliveries on their favorite channel.",
    icon: MessageCircle,
    iconBg: "from-green-500 to-emerald-600",
    connected: false,
  },
  {
    id: "mcp",
    name: "MCP",
    description: "Model Context Protocol server for connecting AI agents to your workspace.",
    icon: Plug,
    iconBg: "from-gray-500 to-gray-700",
    connected: false,
  },
  {
    id: "manos-ai",
    name: "Manos AI",
    description: "Autonomous agent that drafts briefings, captions and weekly reports.",
    icon: Bot,
    iconBg: "from-primary-500 to-primary-700",
    connected: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Power AI summaries, priority suggestions and Instagram analysis.",
    icon: Sparkles,
    iconBg: "from-teal-500 to-cyan-600",
    connected: true,
    lastSync: "Active",
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(initialIntegrations);

  const toggle = (id: string) => {
    setIntegrations((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, connected: !it.connected, lastSync: !it.connected ? "Just now" : undefined }
          : it
      )
    );
  };

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle={`${connectedCount} of ${integrations.length} integrations connected`}
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {integrations.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
              className={cn(
                "bg-dark-card border rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card",
                item.connected ? "border-primary/20" : "border-dark-border"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-card",
                    item.iconBg
                  )}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <Badge variant={item.connected ? "success" : "default"}>
                  {item.connected ? "Connected" : "Not Connected"}
                </Badge>
              </div>

              <h3 className="text-sm font-semibold text-white mb-1.5">{item.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{item.description}</p>

              <div className="flex items-center justify-between">
                {item.connected ? (
                  <div className="flex items-center gap-1.5 text-xs text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {item.lastSync ? `Synced ${item.lastSync}` : "Active"}
                  </div>
                ) : (
                  <span className="text-xs text-gray-600">Not configured</span>
                )}
                <div className="flex items-center gap-2">
                  {item.connected && (
                    <button
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-50 transition-colors"
                      title="Sync now"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                  <Button
                    variant={item.connected ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => toggle(item.id)}
                  >
                    {item.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
