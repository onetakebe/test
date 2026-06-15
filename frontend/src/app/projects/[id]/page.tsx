"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  FileText,
  FileVideo,
  FileImage,
  FolderKanban,
  History,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
  Upload,
} from "lucide-react";
import { getProjectById } from "@/data/projects";
import { tasks } from "@/data/tasks";
import { Badge, statusToBadgeVariant } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskCard } from "@/components/ui/TaskCard";
import { AIBlock, AIInsight } from "@/components/ui/AIBlock";
import { formatDate, formatDateShort, getDaysUntil, cn } from "@/lib/utils";

const tabs = ["Overview", "Tasks", "Files", "Briefing", "Comments", "Timeline"] as const;
type Tab = (typeof tabs)[number];

const checklist = [
  { label: "Briefing received", done: true },
  { label: "Pre-production planning", done: true },
  { label: "Shooting / asset production", done: true },
  { label: "Editing & post-production", done: false },
  { label: "Internal review", done: false },
  { label: "Client approval", done: false },
  { label: "Final delivery", done: false },
];

const mockComments = [
  {
    id: "c-1",
    author: { name: "Ana Lima", initials: "AL", color: "#7D33FF" },
    content: "First cut looks great. Color grade on the opening scene needs a warmer tone before client review.",
    createdAt: "2024-07-18T10:30:00Z",
  },
  {
    id: "c-2",
    author: { name: "Bruno Costa", initials: "BC", color: "#FF6B35" },
    content: "Agreed. I'll push the new grade tonight and re-export the preview by tomorrow morning.",
    createdAt: "2024-07-18T11:05:00Z",
  },
  {
    id: "c-3",
    author: { name: "Carla Souza", initials: "CS", color: "#00C896" },
    content: "Client asked to swap the second testimonial — new footage is in the shared drive under /raw/v2.",
    createdAt: "2024-07-17T16:40:00Z",
  },
];

const mockActivity = [
  { id: "a-1", actor: "Bruno Costa", action: "uploaded 3 raw files", time: "2024-07-17T16:00:00Z", icon: Upload },
  { id: "a-2", actor: "Ana Lima", action: "changed status to Editing", time: "2024-07-16T09:20:00Z", icon: History },
  { id: "a-3", actor: "Carla Souza", action: "completed task \"Aprovação final brand film\"", time: "2024-07-15T14:00:00Z", icon: CheckCircle2 },
  { id: "a-4", actor: "Ana Lima", action: "updated the deadline to Jul 28", time: "2024-07-12T10:00:00Z", icon: Calendar },
  { id: "a-5", actor: "Bruno Costa", action: "added a comment on the rough cut", time: "2024-07-11T17:30:00Z", icon: MessageSquare },
];

const mockFiles = [
  { id: "f-1", name: "brandfilm_v3_preview.mp4", type: "video", size: "842 MB", uploadedBy: "Bruno Costa", date: "2024-07-17" },
  { id: "f-2", name: "storyboard_final.pdf", type: "doc", size: "4.2 MB", uploadedBy: "Ana Lima", date: "2024-07-10" },
  { id: "f-3", name: "hero_stills_pack.zip", type: "image", size: "156 MB", uploadedBy: "Carla Souza", date: "2024-07-08" },
  { id: "f-4", name: "briefing_apex_q4.pdf", type: "doc", size: "1.1 MB", uploadedBy: "Ana Lima", date: "2024-06-01" },
];

const fileIcons: Record<string, typeof FileText> = {
  video: FileVideo,
  image: FileImage,
  doc: FileText,
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${Math.max(hours, 1)}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const project = getProjectById(params.id);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [comment, setComment] = useState("");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  if (!project) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Project not found"
        description="The project you are looking for does not exist or was removed."
        action={
          <Link href="/projects">
            <Button variant="secondary" icon={ArrowLeft}>Back to Projects</Button>
          </Link>
        }
      />
    );
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const daysLeft = getDaysUntil(project.deadline);

  const generateSummary = () => {
    setGenerating(true);
    setTimeout(() => {
      setAiSummary(
        `${project.name} is ${project.progress}% complete and currently in the "${project.phase}" phase. ` +
          `${projectTasks.filter((t) => !t.completed).length} tasks remain open, with the nearest due ${formatDateShort(
            projectTasks[0]?.dueDate ?? project.deadline
          )}. ` +
          `The deadline is ${formatDate(project.deadline)} (${daysLeft} days away). ` +
          `Recommended focus: close out post-production this week so internal review and client approval can happen with buffer before delivery.`
      );
      setGenerating(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Header */}
      <motion.div
        className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={`h-24 bg-gradient-to-br ${project.coverColor} relative`}>
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                <Badge variant={statusToBadgeVariant(project.status)} className="capitalize">
                  {project.phase}
                </Badge>
                <Badge variant={statusToBadgeVariant(project.priority)} className="capitalize">
                  {project.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">{project.description}</p>
              <div className="flex items-center gap-5 mt-3 text-sm text-gray-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <FolderKanban className="w-4 h-4 text-primary-400" />
                  {project.client}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary-400" />
                  Due {formatDate(project.deadline)}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1.5",
                    daysLeft < 0 ? "text-red-400" : daysLeft <= 5 ? "text-orange-400" : ""
                  )}
                >
                  <Clock className="w-4 h-4" />
                  {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-3">
              <AvatarGroup avatars={project.team} max={4} size="md" />
              <Button icon={Sparkles} onClick={generateSummary} disabled={generating}>
                {generating ? "Generating..." : "Generate AI Summary"}
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Overall Progress</span>
              <span className="text-sm font-bold text-white">{project.progress}%</span>
            </div>
            <ProgressBar value={project.progress} size="lg" />
          </div>
        </div>
      </motion.div>

      {/* AI Summary result */}
      {aiSummary && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <AIBlock title="AI Project Summary" subtitle="Generated just now">
            <AIInsight tone="purple" label="✨ Summary">
              {aiSummary}
            </AIInsight>
          </AIBlock>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-card border border-dark-border rounded-2xl p-1.5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab
                ? "bg-primary text-white shadow-purple"
                : "text-gray-400 hover:text-white hover:bg-dark-50"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Production checklist */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4">Production Checklist</h3>
            <div className="space-y-3">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  )}
                  <span className={cn("text-sm", item.done ? "text-gray-500 line-through" : "text-white")}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Internal comments preview */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Internal Comments</h3>
              <button
                onClick={() => setActiveTab("Comments")}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                View all →
              </button>
            </div>
            <div className="space-y-3">
              {mockComments.slice(0, 2).map((c) => (
                <div key={c.id} className="bg-dark-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: c.author.color }}
                    >
                      {c.author.initials}
                    </div>
                    <span className="text-xs font-semibold text-white">{c.author.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity history */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
            <h3 className="font-semibold text-white mb-4">Activity History</h3>
            <div className="space-y-4">
              {mockActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <a.icon className="w-3.5 h-3.5 text-primary-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-300 leading-relaxed">
                      <span className="font-semibold text-white">{a.actor}</span> {a.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{timeAgo(a.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Tasks" && (
        <div>
          {projectTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FolderKanban}
              title="No tasks yet"
              description="Tasks created for this project will show up here."
            />
          )}
        </div>
      )}

      {activeTab === "Files" && (
        <div className="space-y-4">
          {/* Attachments / upload area */}
          <div className="border-2 border-dashed border-dark-border rounded-2xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-primary-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-white">Drop files here or click to upload</p>
            <p className="text-xs text-gray-500 mt-1">Video, images, documents up to 2 GB</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
            {mockFiles.map((file) => {
              const Icon = fileIcons[file.type] ?? FileText;
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-dark-border last:border-0 hover:bg-dark-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-primary-400" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {file.size} · uploaded by {file.uploadedBy} · {formatDateShort(file.date)}
                    </p>
                  </div>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-200 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "Briefing" && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Client Briefing</h3>
              <p className="text-xs text-gray-500">Received {formatDate(project.startDate)}</p>
            </div>
          </div>
          <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
            <div>
              <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-1.5">Objective</p>
              <p>{project.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-1.5">Deliverables</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Master file in 4K plus social cutdowns (16:9, 9:16, 1:1)</li>
                <li>Color-graded stills pack for paid media</li>
                <li>Subtitle files (PT-BR and EN)</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-1.5">Target Audience</p>
              <p className="text-gray-400">
                Decision makers and brand-aware consumers aged 25-45, primarily on Instagram and YouTube.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-1.5">Key Dates</p>
              <p className="text-gray-400">
                Start: {formatDate(project.startDate)} · Final delivery: {formatDate(project.deadline)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-dark-border">
            <Paperclip className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">briefing_{project.id}.pdf attached</span>
          </div>
        </div>
      )}

      {activeTab === "Comments" && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-white">Internal Comments</h3>
          <div className="space-y-3">
            {mockComments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: c.author.color }}
                >
                  {c.author.initials}
                </div>
                <div className="flex-1 bg-dark-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{c.author.name}</span>
                    <span className="text-xs text-gray-500">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              AL
            </div>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write an internal comment..."
              className="flex-1 px-4 py-2.5 bg-dark-200 border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
            <Button icon={Send} size="md" onClick={() => setComment("")}>
              Send
            </Button>
          </div>
        </div>
      )}

      {activeTab === "Timeline" && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-5">Project Timeline</h3>
          <div className="relative pl-6">
            <div className="absolute left-2 top-1 bottom-1 w-px bg-dark-border" />
            <div className="space-y-6">
              {mockActivity.map((a) => (
                <div key={a.id} className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-dark-card border-2 border-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">{a.actor}</span> {a.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(a.time)} · {timeAgo(a.time)}</p>
                </div>
              ))}
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-dark-card border-2 border-green-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">Project created</span> — briefing received from {project.client}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(project.startDate)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
