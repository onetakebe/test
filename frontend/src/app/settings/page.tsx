"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Building2,
  Check,
  KeyRound,
  Palette,
  Plug,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "company", label: "Company Profile", icon: Building2 },
  { key: "team", label: "Team", icon: Users },
  { key: "permissions", label: "Permissions", icon: Shield },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "theme", label: "Theme", icon: Palette },
  { key: "integrations", label: "Integrations", icon: Plug },
  { key: "account", label: "Account", icon: KeyRound },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const teamMembers = [
  { name: "Ana Lima", email: "ana@onetake.studio", role: "Admin", title: "Creative Director", initials: "AL", color: "#7D33FF" },
  { name: "Bruno Costa", email: "bruno@onetake.studio", role: "Editor", title: "Video Editor", initials: "BC", color: "#FF6B35" },
  { name: "Carla Souza", email: "carla@onetake.studio", role: "Manager", title: "Producer", initials: "CS", color: "#00C896" },
  { name: "Diana Rocha", email: "diana@onetake.studio", role: "Creative", title: "Designer", initials: "DR", color: "#FF3366" },
  { name: "Eduardo Melo", email: "eduardo@onetake.studio", role: "Creative", title: "Developer", initials: "EM", color: "#00C8FF" },
  { name: "Fernanda Santos", email: "fernanda@onetake.studio", role: "Social Media", title: "Social Media Manager", initials: "FS", color: "#FFB700" },
];

const roles = ["Admin", "Manager", "Creative", "Editor", "Social Media", "Viewer"];

const permissionMatrix = [
  { permission: "Create & edit projects", roles: ["Admin", "Manager"] },
  { permission: "Delete projects", roles: ["Admin"] },
  { permission: "Manage tasks", roles: ["Admin", "Manager", "Creative", "Editor", "Social Media"] },
  { permission: "Manage clients", roles: ["Admin", "Manager"] },
  { permission: "View metrics", roles: ["Admin", "Manager", "Creative", "Editor", "Social Media", "Viewer"] },
  { permission: "Manage integrations", roles: ["Admin"] },
  { permission: "Use AI assistant", roles: ["Admin", "Manager", "Creative", "Editor", "Social Media"] },
  { permission: "Manage team & roles", roles: ["Admin"] },
];

const notificationPrefs = [
  { label: "Deadline reminders", description: "Alert me 48h and 24h before a deadline", enabled: true },
  { label: "Task assignments", description: "When a task is assigned to me", enabled: true },
  { label: "Client comments", description: "When a client comments on a project", enabled: true },
  { label: "Approvals", description: "When a deliverable is approved or rejected", enabled: true },
  { label: "Instagram reports", description: "Weekly Instagram performance digest", enabled: false },
  { label: "AI suggestions", description: "Proactive AI priority suggestions each morning", enabled: false },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0",
        enabled ? "bg-primary" : "bg-dark-50 border border-dark-border"
      )}
      style={{ height: "22px" }}
    >
      <span
        className={cn(
          "absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all",
          enabled ? "left-5" : "left-0.5"
        )}
        style={{ width: "18px", height: "18px" }}
      />
    </button>
  );
}

function Field({ label, defaultValue, type = "text", placeholder }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-dark-200 border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
      />
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("company");
  const [prefs, setPrefs] = useState(notificationPrefs);
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [accent, setAccent] = useState("#7D33FF");

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your workspace, team and preferences" />

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-card border border-dark-border rounded-2xl p-1.5 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab.key
                ? "bg-primary text-white shadow-purple"
                : "text-gray-400 hover:text-white hover:bg-dark-50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Company Profile */}
        {activeTab === "company" && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-2xl space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-gradient flex items-center justify-center shadow-purple">
                <span className="text-xl font-bold text-white">OT</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Company Logo</p>
                <p className="text-xs text-gray-500 mb-2">PNG or SVG, at least 256x256</p>
                <Button variant="secondary" size="sm">Upload Logo</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company Name" defaultValue="One Take Studio" />
              <Field label="Website" defaultValue="https://onetake.studio" />
              <Field label="Contact Email" defaultValue="hello@onetake.studio" type="email" />
              <Field label="Phone" defaultValue="+55 11 9 8888-0000" />
              <Field label="Instagram" defaultValue="@onetake.studio" />
              <Field label="City" defaultValue="São Paulo, Brazil" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">About</label>
              <textarea
                rows={3}
                defaultValue="Full-service marketing & audiovisual studio specialized in brand films, social campaigns and content production."
                className="w-full px-4 py-2.5 bg-dark-200 border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <Button>Save Changes</Button>
          </div>
        )}

        {/* Team */}
        {activeTab === "team" && (
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden max-w-3xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
              <div>
                <h3 className="text-sm font-semibold text-white">Team Members</h3>
                <p className="text-xs text-gray-500">{teamMembers.length} members in this workspace</p>
              </div>
              <Button size="sm">Invite Member</Button>
            </div>
            {teamMembers.map((m) => (
              <div
                key={m.email}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-dark-border last:border-0 hover:bg-dark-50 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: m.color }}
                >
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.name}</p>
                  <p className="text-xs text-gray-500 truncate">{m.email} · {m.title}</p>
                </div>
                <Badge variant={m.role === "Admin" ? "purple" : "default"}>{m.role}</Badge>
              </div>
            ))}
          </div>
        )}

        {/* Permissions */}
        {activeTab === "permissions" && (
          <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      Permission
                    </th>
                    {roles.map((r) => (
                      <th key={r} className="px-3 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider text-center">
                        {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionMatrix.map((row) => (
                    <tr key={row.permission} className="border-b border-dark-border last:border-0 hover:bg-dark-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-white">{row.permission}</td>
                      {roles.map((r) => (
                        <td key={r} className="px-3 py-3.5 text-center">
                          {row.roles.includes(r) ? (
                            <Check className="w-4 h-4 text-green-400 inline" />
                          ) : (
                            <span className="text-gray-700">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-5 max-w-2xl space-y-1">
            {prefs.map((p, i) => (
              <div key={p.label} className="flex items-center justify-between gap-4 px-2 py-3 border-b border-dark-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{p.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.description}</p>
                </div>
                <Toggle
                  enabled={p.enabled}
                  onToggle={() =>
                    setPrefs((prev) => prev.map((x, j) => (j === i ? { ...x, enabled: !x.enabled } : x)))
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* Theme */}
        {activeTab === "theme" && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-2xl space-y-6">
            <div>
              <p className="text-sm font-semibold text-white mb-3">Appearance</p>
              <div className="grid grid-cols-3 gap-3">
                {(["dark", "light", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "rounded-2xl border p-4 text-center transition-all capitalize",
                      theme === t
                        ? "border-primary bg-primary/10 text-white shadow-purple"
                        : "border-dark-border text-gray-400 hover:border-primary/30 hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "w-full h-14 rounded-xl mb-3 border border-dark-border",
                        t === "dark" && "bg-dark-400",
                        t === "light" && "bg-gray-200",
                        t === "system" && "bg-gradient-to-r from-dark-400 to-gray-200"
                      )}
                    />
                    <span className="text-sm font-medium">{t}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-3">Accent Color</p>
              <div className="flex gap-3">
                {["#7D33FF", "#00C896", "#FF3366", "#00C8FF", "#FFB700", "#FF6B35"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setAccent(c)}
                    className={cn(
                      "w-9 h-9 rounded-full transition-all flex items-center justify-center",
                      accent === c && "ring-2 ring-white ring-offset-2 ring-offset-dark-card"
                    )}
                    style={{ backgroundColor: c }}
                  >
                    {accent === c && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
            <Button>Apply Theme</Button>
          </div>
        )}

        {/* Integrations */}
        {activeTab === "integrations" && (
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-2xl space-y-4">
            <p className="text-sm text-gray-400 leading-relaxed">
              Connected services power calendar sync, Instagram metrics and the AI assistant. Manage individual
              connections on the Integrations page.
            </p>
            <div className="space-y-2">
              {[
                { name: "Google Calendar", connected: true },
                { name: "Gmail", connected: true },
                { name: "Google Drive", connected: true },
                { name: "Instagram / Meta", connected: true },
                { name: "WhatsApp Business", connected: false },
                { name: "OpenAI", connected: true },
              ].map((it) => (
                <div key={it.name} className="flex items-center justify-between px-4 py-3 rounded-xl bg-dark-200">
                  <span className="text-sm text-white">{it.name}</span>
                  <Badge variant={it.connected ? "success" : "default"}>
                    {it.connected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              ))}
            </div>
            <a href="/integrations">
              <Button variant="secondary" className="mt-2">Manage Integrations</Button>
            </a>
          </div>
        )}

        {/* Account */}
        {activeTab === "account" && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center text-lg font-bold text-white">
                  AL
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Ana Lima</p>
                  <p className="text-xs text-gray-500">Creative Director · Admin</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" defaultValue="Ana Lima" />
                <Field label="Email" defaultValue="ana@onetake.studio" type="email" />
                <Field label="Current Password" type="password" placeholder="••••••••" />
                <Field label="New Password" type="password" placeholder="••••••••" />
              </div>
              <Button>Update Account</Button>
            </div>

            <div className="bg-dark-card border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-red-400 mb-1">Danger Zone</h3>
              <p className="text-xs text-gray-500 mb-4">
                Deleting your account removes all your data permanently. This cannot be undone.
              </p>
              <Button variant="danger" icon={Trash2}>Delete Account</Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
