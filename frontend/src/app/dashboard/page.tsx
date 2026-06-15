"use client";
import { motion } from "framer-motion";
import {
  FolderKanban,
  AlertTriangle,
  Truck,
  Layers,
  Bell,
  TrendingUp,
  Clock,
  Star,
  DollarSign,
  CheckSquare,
  Sparkles,
  Instagram,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Eye,
  Heart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { Badge, statusToBadgeVariant } from "@/components/ui/Badge";
import { projects } from "@/data/projects";
import { tasks } from "@/data/tasks";
import { weeklyPerformance, kpiStats, instagramMetrics } from "@/data/metrics";
import { deadlines } from "@/data/deadlines";
import { formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  low: "bg-green-400",
};

export default function DashboardPage() {
  const activeProjects = projects.filter((p) => p.status === "in-progress").slice(0, 4);
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 5);
  const upcomingDeadlines = deadlines.slice(0, 4);
  const topPosts = instagramMetrics.filter((m) => m.status === "top-performing").slice(0, 2);
  const needsImprovement = instagramMetrics.filter((m) => m.status === "needs-improvement").slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {[
          {
            title: "Projects in Progress",
            value: kpiStats.projectsInProgress,
            icon: FolderKanban,
            subtitle: "+2 since last week",
            trend: { value: "2", positive: true },
          },
          {
            title: "Urgent Tasks",
            value: kpiStats.urgentTasks,
            icon: AlertTriangle,
            iconColor: "text-orange-400",
            subtitle: "Needs attention",
          },
          {
            title: "Deliveries This Week",
            value: kpiStats.deliveriesThisWeek,
            icon: Truck,
            iconColor: "text-green-400",
            subtitle: "3 on schedule",
          },
          {
            title: "Creative Pipeline",
            value: `${kpiStats.creativePipeline} assets`,
            icon: Layers,
            iconColor: "text-blue-400",
            subtitle: "Across 4 projects",
          },
          {
            title: "Notifications",
            value: kpiStats.unreadNotifications,
            icon: Bell,
            iconColor: "text-yellow-400",
            subtitle: "Unread alerts",
            highlight: true,
          },
        ].map((card, i) => (
          <motion.div key={i} custom={i} variants={fadeUp}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weekly Performance Chart */}
        <motion.div
          className="xl:col-span-2 bg-dark-card border border-dark-border rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Weekly Performance</h3>
              <p className="text-xs text-gray-500 mt-0.5">Completion vs On-Time rate</p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-gray-400">Completion</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-gray-400">On-Time</span>
              </div>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Completion Rate", value: `${kpiStats.completionRate}%`, icon: TrendingUp, color: "text-primary-400" },
              { label: "On-Time Delivery", value: `${kpiStats.onTimeDelivery}%`, icon: Clock, color: "text-green-400" },
              { label: "Client Satisfaction", value: `${kpiStats.clientSatisfaction}/5`, icon: Star, color: "text-yellow-400" },
              { label: "Revenue Impact", value: kpiStats.revenueImpact, icon: DollarSign, color: "text-emerald-400" },
            ].map((kpi, i) => (
              <div key={i} className="bg-dark-200 rounded-xl p-3">
                <kpi.icon className={`w-4 h-4 ${kpi.color} mb-1.5`} />
                <p className="text-sm font-bold text-white">{kpi.value}</p>
                <p className="text-xs text-gray-500 leading-tight">{kpi.label}</p>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2750" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e1b35", border: "1px solid #2a2750", borderRadius: "12px" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#a86cff" }}
              />
              <Line type="monotone" dataKey="completed" stroke="#7D33FF" strokeWidth={2.5} dot={false} name="Completion %" />
              <Line type="monotone" dataKey="onTime" stroke="#00C896" strokeWidth={2.5} dot={false} name="On-Time %" />
              <Line type="monotone" dataKey="target" stroke="#2a2750" strokeWidth={1.5} dot={false} strokeDasharray="4 4" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Summary */}
        <motion.div
          className="bg-gradient-to-br from-primary/20 via-dark-card to-dark-card border border-primary/20 rounded-2xl p-5 flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-purple">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AI Summary</p>
              <p className="text-xs text-gray-500">Generated today</p>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            <div className="bg-primary/10 rounded-xl p-3 border border-primary/20">
              <p className="text-xs text-primary-300 font-semibold mb-1">🔥 Priority Alert</p>
              <p className="text-xs text-gray-300 leading-relaxed">
                TechStart Pitch Deck is due in 2 days at 90% completion. Ana Lima should prioritize final review today.
              </p>
            </div>
            <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20">
              <p className="text-xs text-green-400 font-semibold mb-1">✅ Top Performance</p>
              <p className="text-xs text-gray-300 leading-relaxed">
                Apex brand film campaign reached 145K views with 8.9% engagement – top content this week.
              </p>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20">
              <p className="text-xs text-yellow-400 font-semibold mb-1">⚠️ Watch Out</p>
              <p className="text-xs text-gray-300 leading-relaxed">
                After Drinks lifestyle post underperforming at 3.1% engagement. Consider reposting with new copy.
              </p>
            </div>
          </div>

          <button className="mt-4 w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors shadow-purple flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Full Report
          </button>
        </motion.div>
      </div>

      {/* Projects & Tasks & Deadlines */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Project Status */}
        <motion.div
          className="xl:col-span-1 bg-dark-card border border-dark-border rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Project Status</h3>
            <a href="/projects" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {activeProjects.map((project) => (
              <a key={project.id} href={`/projects/${project.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-200 hover:bg-dark-50 transition-colors cursor-pointer">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.coverColor} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{project.name}</p>
                    <p className="text-xs text-gray-500 truncate">{project.phase}</p>
                    <ProgressBar value={project.progress} size="sm" className="mt-1.5" />
                  </div>
                  <span className="text-xs font-bold text-white">{project.progress}%</span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Tasks Checklist */}
        <motion.div
          className="bg-dark-card border border-dark-border rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Urgent Tasks</h3>
            <a href="/tasks" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              View all →
            </a>
          </div>
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-dark-200 transition-colors"
              >
                <div className="mt-0.5 w-4 h-4 rounded border border-dark-border bg-dark-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white leading-tight truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{task.projectName}</span>
                    <span className="text-gray-600">·</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{formatDateShort(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      priorityColors[task.priority] ?? "bg-gray-400"
                    )}
                  />
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: task.assignee.color }}
                  >
                    {task.assignee.initials}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          className="bg-dark-card border border-dark-border rounded-2xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Upcoming Deadlines</h3>
            <a href="/calendar" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              Calendar →
            </a>
          </div>
          <div className="space-y-2">
            {upcomingDeadlines.map((dl) => {
              const colors: Record<string, string> = {
                urgent: "bg-red-500/15 border-red-500/30 text-red-300",
                high: "bg-orange-500/15 border-orange-500/30 text-orange-300",
                medium: "bg-yellow-500/15 border-yellow-500/30 text-yellow-300",
                low: "bg-green-500/15 border-green-500/30 text-green-300",
              };
              return (
                <div
                  key={dl.id}
                  className={cn("rounded-xl p-3 border", colors[dl.priority] ?? colors.medium)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{dl.title}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{dl.projectName}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs font-bold">{formatDateShort(dl.dueDate)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Instagram Metrics */}
      <motion.div
        className="bg-dark-card border border-dark-border rounded-2xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-pink-400" />
            <h3 className="font-semibold text-white">Instagram Metrics</h3>
          </div>
          <a href="/metrics" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
            Full Report →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Performing */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp className="w-4 h-4 text-green-400" />
              <p className="text-sm font-medium text-green-400">Top Performing</p>
            </div>
            <div className="space-y-2">
              {topPosts.map((post) => (
                <div key={post.id} className="bg-dark-200 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{post.postName}</p>
                    <p className="text-xs text-gray-500">{post.client} · {post.type}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-green-400">{post.engagementRate}%</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Eye className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{(post.views / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Improvement */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ThumbsDown className="w-4 h-4 text-orange-400" />
              <p className="text-sm font-medium text-orange-400">Needs Improvement</p>
            </div>
            <div className="space-y-2">
              {needsImprovement.map((post) => (
                <div key={post.id} className="bg-dark-200 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{post.postName}</p>
                    <p className="text-xs text-gray-500">{post.client} · {post.type}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-orange-400">{post.engagementRate}%</p>
                    <div className="flex items-center gap-1 justify-end">
                      <Heart className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{post.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
