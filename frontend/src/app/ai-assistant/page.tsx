"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  Clock,
  FileText,
  Instagram,
  ListChecks,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const quickSuggestions = [
  { label: "Summarize Projects", icon: FileText, prompt: "Summarize all active projects" },
  { label: "Analyze Instagram Metrics", icon: Instagram, prompt: "Analyze our Instagram metrics" },
  { label: "Show Urgent Tasks", icon: AlertTriangle, prompt: "Show me the urgent tasks" },
  { label: "Generate Weekly Report", icon: Clock, prompt: "Generate the weekly report" },
  { label: "Suggest Priorities", icon: ListChecks, prompt: "Suggest priorities for the team today" },
];

const promptHistory = [
  "Summarize all active projects",
  "Which posts performed best this month?",
  "Draft a status update for Apex Corp",
  "What deadlines are at risk this week?",
  "Generate the weekly report",
];

const mockResponses: { match: RegExp; response: string }[] = [
  {
    match: /summar|project/i,
    response:
      "Here is a summary of your 4 active projects:\n\n• Apex Brand Film (72%) — in post-production. First cut due Jul 22; Bruno is finalizing the color grade.\n• Luxe.co Website (65%) — in development, but blocked on wireframe approval from Sofia Luxe (due Jul 23).\n• Nova Social Campaign (48%) — 10 reels in production for the Jul 25 first batch delivery.\n• After Drinks Content Pack (30%) — planning phase; product photo session scheduled Jul 28.\n\nBiggest risk: TechStart Pitch Deck is at 90% but due Jul 20 — recommend Ana closes the final review today.",
  },
  {
    match: /instagram|metric|post/i,
    response:
      "Instagram performance analysis:\n\n🏆 Top performers\n• Apex Hero Video (Reels): 145K views, 8.9% engagement — best content this month.\n• Nova Foods Carousel: 98K views, 7.2% engagement.\n\n⚠️ Needs improvement\n• After Drinks Lifestyle photo: 3.1% engagement — try reposting as a Reel with stronger hook in the first 2 seconds.\n• Nova Stories recipe: 2.4% engagement — short shelf life; consider converting to a saved carousel.\n\nRecommendation: double down on Reels — they average 2.4x the engagement of static posts across your accounts.",
  },
  {
    match: /urgent|task/i,
    response:
      "You have 3 urgent items right now:\n\n1. 🔴 Revisão pitch deck slides 20-30 (TechStart) — overdue since Jul 19, assigned to Ana Lima.\n2. 🔴 Finalizar edição do brand film (Apex) — due Jul 22, assigned to Bruno Costa.\n3. 🟠 Aprovar wireframes do website (Luxe.co) — waiting on the client since Jul 23; consider a follow-up via WhatsApp.\n\nSuggestion: clear item 1 first — it blocks the TechStart final delivery tomorrow.",
  },
  {
    match: /report|weekly/i,
    response:
      "📊 Weekly Report — Jul 15–19\n\nDelivered: FreshMart brand identity closed; Apex internal approval completed.\nIn flight: 4 active projects averaging 54% completion.\nTeam: 27 of 32 tasks completed (84%), on-time rate at 92%.\nSocial: 332K combined views, top engagement 8.9% (Apex Reels).\nRevenue impact: R$48.7K this month vs R$55K target — pipeline suggests catching up with the Nova first batch and Luxe launch.\n\nNext week's focus: TechStart final delivery, Apex first cut, and unblocking Luxe wireframe approval.",
  },
  {
    match: /priorit|suggest/i,
    response:
      "Suggested priorities for today:\n\n1. Ana Lima → finish TechStart pitch deck review (due tomorrow, 90% done — 1–2h of work).\n2. Bruno Costa → push Apex brand film color grade so the Jul 22 first cut stays on track.\n3. Diana Rocha → follow up with Sofia Luxe on wireframe approval; development is blocked.\n4. Fernanda Santos → keep reels production going; first Nova batch lands Jul 25.\n5. Igor Mendes → confirm Studio A and props for the Jul 28 After Drinks shoot.\n\nThis ordering clears the two nearest deadlines first while unblocking the longest-running dependency.",
  },
];

const fallbackResponse =
  "I've looked across your workspace. You currently have 4 active projects (average 54% completion), 8 open tasks, and 3 deadlines landing this week. Ask me to summarize projects, analyze Instagram metrics, show urgent tasks, generate a weekly report, or suggest priorities — or ask anything specific about a client or project.";

function getMockResponse(prompt: string) {
  const found = mockResponses.find((r) => r.match.test(prompt));
  return found?.response ?? fallbackResponse;
}

function now() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-0",
      role: "assistant",
      content:
        "Hi Ana 👋 I'm your ONE TAKE OS assistant. I can summarize projects, analyze Instagram metrics, surface urgent tasks, generate reports and suggest priorities. What do you need?",
      timestamp: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = (prompt?: string) => {
    const text = (prompt ?? input).trim();
    if (!text || thinking) return;
    setInput("");
    const userMsg: Message = { id: `m-${Date.now()}`, role: "user", content: text, timestamp: now() };
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `m-${Date.now()}-a`, role: "assistant", content: getMockResponse(text), timestamp: now() },
      ]);
      setThinking(false);
    }, 1100);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8.5rem)]">
      {/* Prompt history sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-card border border-dark-border rounded-2xl p-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Prompt History</h3>
        </div>
        <div className="space-y-1.5 overflow-y-auto">
          {promptHistory.map((p, i) => (
            <button
              key={i}
              onClick={() => send(p)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-dark-50 transition-colors leading-snug"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-dark-border">
          <div className="glass-purple rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-300" />
              <p className="text-xs font-semibold text-primary-300">Pro tip</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Mention a client or project by name for context-aware answers.
            </p>
          </div>
        </div>
      </aside>

      {/* Chat */}
      <div className="flex-1 flex flex-col bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-dark-border">
          <div className="w-9 h-9 rounded-xl bg-purple-gradient flex items-center justify-center shadow-purple">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">ONE TAKE Assistant</p>
            <p className="text-xs text-green-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Online · connected to your workspace
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                  msg.role === "assistant" ? "bg-purple-gradient shadow-purple" : "bg-dark-50 border border-dark-border"
                )}
              >
                {msg.role === "assistant" ? (
                  <Sparkles className="w-4 h-4 text-white" />
                ) : (
                  <User className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3",
                  msg.role === "assistant"
                    ? "bg-gradient-to-br from-primary/15 via-dark-200 to-dark-200 border border-primary/20"
                    : "bg-primary text-white shadow-purple"
                )}
              >
                <p
                  className={cn(
                    "text-sm leading-relaxed whitespace-pre-line",
                    msg.role === "assistant" ? "text-gray-200" : "text-white"
                  )}
                >
                  {msg.content}
                </p>
                <p className={cn("text-xs mt-1.5", msg.role === "assistant" ? "text-gray-500" : "text-white/60")}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}

          {thinking && (
            <motion.div className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="w-8 h-8 rounded-xl bg-purple-gradient flex items-center justify-center shadow-purple flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-dark-200 border border-dark-border rounded-2xl px-4 py-3.5 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions */}
        <div className="px-5 pb-3 flex gap-2 flex-wrap">
          {quickSuggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => send(s.prompt)}
              disabled={thinking}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary-300 hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              <s.icon className="w-3.5 h-3.5" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-dark-border flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything about your projects, tasks or metrics..."
            className="flex-1 px-4 py-2.5 bg-dark-200 border border-dark-border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
          <Button icon={Send} onClick={() => send()} disabled={thinking || !input.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
