"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge, statusToBadgeVariant } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { formatDateShort, cn } from "@/lib/utils";

const statuses = ["all", "in-progress", "planning", "review", "completed", "on-hold"];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} projects total · ${projects.filter((p) => p.status === "in-progress").length} active`}
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary rounded-xl text-sm text-white font-medium hover:bg-primary-600 transition-colors shadow-purple">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize",
                statusFilter === s
                  ? "bg-primary text-white shadow-purple"
                  : "bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:border-primary/30"
              )}
            >
              {s === "all" ? "All" : s.replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-dark-card border border-dark-border rounded-xl p-1">
          <button
            onClick={() => setView("grid")}
            className={cn("p-1.5 rounded-lg transition-colors", view === "grid" ? "bg-primary text-white" : "text-gray-400 hover:text-white")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("p-1.5 rounded-lg transition-colors", view === "list" ? "bg-primary text-white" : "text-gray-400 hover:text-white")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-dark-border">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Project</span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Progress</span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Deadline</span>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Team</span>
          </div>
          {filtered.map((project, i) => (
            <motion.a
              key={project.id}
              href={`/projects/${project.id}`}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-dark-border last:border-0 hover:bg-dark-50 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${project.coverColor} flex-shrink-0`} />
                <div>
                  <p className="text-sm font-medium text-white">{project.name}</p>
                  <p className="text-xs text-gray-500">{project.client}</p>
                </div>
              </div>
              <Badge variant={statusToBadgeVariant(project.status)} className="capitalize w-fit">
                {project.status.replace("-", " ")}
              </Badge>
              <div className="flex items-center gap-2">
                <ProgressBar value={project.progress} className="flex-1" size="sm" />
                <span className="text-xs font-semibold text-white w-8">{project.progress}%</span>
              </div>
              <span className="text-sm text-gray-400">{formatDateShort(project.deadline)}</span>
              <AvatarGroup avatars={project.team} max={3} />
            </motion.a>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">No projects match your filters.</p>
        </div>
      )}
    </div>
  );
}
