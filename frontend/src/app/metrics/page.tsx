"use client";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Heart,
  Instagram,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { MetricCard } from "@/components/ui/MetricCard";
import { ChartCard } from "@/components/ui/ChartCard";
import { Badge } from "@/components/ui/Badge";
import {
  weeklyPerformance,
  monthlyRevenue,
  projectStatusData,
  taskCompletionData,
  teamProductivity,
  instagramMetrics,
  kpiStats,
} from "@/data/metrics";

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#1e1b35",
    border: "1px solid #2a2750",
    borderRadius: "12px",
  },
  labelStyle: { color: "#fff" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MetricsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Metrics" subtitle="Performance analytics across projects, team and social media" />

      {/* KPI cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        <motion.div variants={fadeUp}>
          <MetricCard
            label="Projects Completed"
            value={8}
            icon={CheckCircle2}
            iconColor="text-green-400"
            change={{ value: "12%", positive: true }}
            description="This quarter"
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <MetricCard
            label="Late Tasks"
            value={4}
            icon={AlertTriangle}
            iconColor="text-red-400"
            change={{ value: "2", positive: false }}
            description="Across 3 projects"
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <MetricCard
            label="Avg Delivery Time"
            value="6.4 days"
            icon={Clock}
            iconColor="text-blue-400"
            change={{ value: "0.8d", positive: true }}
            description="From briefing to delivery"
          />
        </motion.div>
        <motion.div variants={fadeUp}>
          <MetricCard
            label="Client Satisfaction"
            value={`${kpiStats.clientSatisfaction}/5`}
            icon={Star}
            iconColor="text-yellow-400"
            change={{ value: "0.2", positive: true }}
            description="Based on 14 reviews"
          />
        </motion.div>
      </motion.div>

      {/* Overall performance + project status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div className="xl:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ChartCard title="Overall Performance" subtitle="Completion rate vs on-time delivery, last 7 days">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weeklyPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7D33FF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7D33FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradOnTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C896" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00C896" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2750" />
                <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="completed" stroke="#7D33FF" strokeWidth={2.5} fill="url(#gradCompleted)" name="Completion %" />
                <Area type="monotone" dataKey="onTime" stroke="#00C896" strokeWidth={2.5} fill="url(#gradOnTime)" name="On-Time %" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <ChartCard title="Projects by Status" subtitle="Current pipeline distribution" className="h-full">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  stroke="none"
                >
                  {projectStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {projectStatusData.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-gray-400 truncate">{s.name}</span>
                  <span className="text-xs font-semibold text-white ml-auto">{s.value}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* Task completion + team productivity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <ChartCard title="Tasks Completed" subtitle="Weekly completed vs total tasks">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={taskCompletionData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2750" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(125, 51, 255, 0.06)" }} />
                <Bar dataKey="total" fill="#2a2750" radius={[6, 6, 0, 0]} name="Total" />
                <Bar dataKey="completed" fill="#7D33FF" radius={[6, 6, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <ChartCard title="Productivity per Member" subtitle="Tasks completed and on-time delivery">
            <div className="space-y-3">
              {teamProductivity.map((member) => {
                const rate = Math.round((member.onTime / member.tasks) * 100);
                return (
                  <div key={member.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary-300 flex-shrink-0">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white font-medium">{member.name}</span>
                        <span className="text-xs text-gray-500">{member.tasks} tasks · ⭐ {member.satisfaction}</span>
                      </div>
                      <div className="h-2 rounded-full bg-dark-200">
                        <div
                          className="h-2 rounded-full bg-purple-gradient transition-all duration-500"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white w-10 text-right">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </motion.div>
      </div>

      {/* Growth */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <ChartCard
          title="Monthly Growth"
          subtitle="Revenue impact vs target"
          actions={
            <Badge variant="success" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18% YoY
            </Badge>
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyRevenue} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2750" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${v / 1000}K`}
              />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="revenue" stroke="#7D33FF" strokeWidth={2.5} dot={{ fill: "#7D33FF", r: 3 }} name="Revenue (R$)" />
              <Line type="monotone" dataKey="target" stroke="#2a2750" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Target (R$)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Instagram metrics table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <ChartCard
          title="Instagram Metrics"
          subtitle="Post performance across client accounts"
          actions={<Instagram className="w-5 h-5 text-pink-400" />}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-dark-border">
                  {["Post", "Type", "Views", "Likes", "Comments", "Shares", "Saves", "Engagement", "Status"].map((h) => (
                    <th key={h} className="text-left px-3 py-2.5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {instagramMetrics.map((post) => (
                  <tr key={post.id} className="border-b border-dark-border last:border-0 hover:bg-dark-50 transition-colors">
                    <td className="px-3 py-3">
                      <p className="text-sm font-medium text-white">{post.postName}</p>
                      <p className="text-xs text-gray-500">{post.client}</p>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-400">{post.type}</td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-1 text-sm text-gray-300">
                        <Eye className="w-3.5 h-3.5 text-gray-500" />
                        {post.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-1 text-sm text-gray-300">
                        <Heart className="w-3.5 h-3.5 text-pink-400" />
                        {post.likes.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-300">{post.comments}</td>
                    <td className="px-3 py-3 text-sm text-gray-300">{post.shares.toLocaleString()}</td>
                    <td className="px-3 py-3 text-sm text-gray-300">{post.saves.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <span
                        className={
                          post.engagementRate >= 6
                            ? "text-sm font-bold text-green-400"
                            : "text-sm font-bold text-orange-400"
                        }
                      >
                        {post.engagementRate}%
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant={post.status === "top-performing" ? "success" : "warning"}>
                        {post.status === "top-performing" ? "Top" : "Improve"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </motion.div>
    </div>
  );
}
