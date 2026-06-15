"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Mail, Phone, Plus, Search, FolderKanban, Clock } from "lucide-react";
import { clients, Client } from "@/data/clients";
import { projects } from "@/data/projects";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateShort, cn } from "@/lib/utils";

// CRM pipeline status derived from the client record
type CrmStatus =
  | "new-lead"
  | "in-negotiation"
  | "active-client"
  | "waiting-response"
  | "recurring"
  | "finished";

const crmStatusConfig: Record<CrmStatus, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" | "purple" }> = {
  "new-lead": { label: "New Lead", variant: "info" },
  "in-negotiation": { label: "In Negotiation", variant: "warning" },
  "active-client": { label: "Active Client", variant: "success" },
  "waiting-response": { label: "Waiting Response", variant: "warning" },
  "recurring": { label: "Recurring", variant: "purple" },
  "finished": { label: "Finished", variant: "default" },
};

function toCrmStatus(client: Client): CrmStatus {
  if (client.status === "prospect") {
    return client.totalProjects === 0 ? "new-lead" : "in-negotiation";
  }
  if (client.status === "vip") return "recurring";
  if (client.status === "inactive") {
    return client.activeProjects === 0 && client.totalProjects > 0 ? "finished" : "waiting-response";
  }
  return client.totalProjects > 1 ? "recurring" : "active-client";
}

const filters: { key: "all" | CrmStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new-lead", label: "New Lead" },
  { key: "in-negotiation", label: "In Negotiation" },
  { key: "active-client", label: "Active Client" },
  { key: "waiting-response", label: "Waiting Response" },
  { key: "recurring", label: "Recurring" },
  { key: "finished", label: "Finished" },
];

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CrmStatus>("all");

  const enriched = clients.map((c) => ({ ...c, crmStatus: toCrmStatus(c) }));

  const filtered = enriched.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.instagram.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.crmStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} clients · ${clients.filter((c) => c.activeProjects > 0).length} with active projects`}
        actions={<Button icon={Plus}>New Client</Button>}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, company or Instagram..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-medium transition-all",
                statusFilter === f.key
                  ? "bg-primary text-white shadow-purple"
                  : "bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary/30"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {filtered.map((client) => {
          const cfg = crmStatusConfig[client.crmStatus];
          const services = projects
            .filter((p) => p.clientId === client.id)
            .map((p) => p.type);
          const uniqueServices = Array.from(new Set(services));

          return (
            <motion.div
              key={client.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
              className="bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.company}</p>
                  </div>
                </div>
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Mail className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Phone className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  {client.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-primary-300">
                  <Instagram className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                  {client.instagram}
                </div>
              </div>

              {/* Services */}
              {uniqueServices.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {uniqueServices.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-dark-200 border border-dark-border text-xs text-gray-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-dark-border">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <FolderKanban className="w-3.5 h-3.5 text-primary-400" />
                  {client.activeProjects} active / {client.totalProjects} total
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDateShort(client.lastActivity)}
                </div>
              </div>

              {client.notes && (
                <p className="text-xs text-gray-500 mt-3 leading-relaxed line-clamp-2 italic">
                  &ldquo;{client.notes}&rdquo;
                </p>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No clients match your filters.</p>
        </div>
      )}
    </div>
  );
}
