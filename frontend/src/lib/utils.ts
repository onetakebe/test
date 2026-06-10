import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateShort(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getDaysUntil(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    "in-progress": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "completed": "text-green-400 bg-green-400/10 border-green-400/20",
    "planning": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    "review": "text-orange-400 bg-orange-400/10 border-orange-400/20",
    "on-hold": "text-gray-400 bg-gray-400/10 border-gray-400/20",
    "todo": "text-gray-400 bg-gray-400/10 border-gray-400/20",
    "in-review": "text-orange-400 bg-orange-400/10 border-orange-400/20",
    "waiting-client": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    "active": "text-green-400 bg-green-400/10 border-green-400/20",
    "inactive": "text-gray-400 bg-gray-400/10 border-gray-400/20",
    "prospect": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "vip": "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };
  return map[status] ?? "text-gray-400 bg-gray-400/10 border-gray-400/20";
}

export function getPriorityColor(priority: string) {
  const map: Record<string, string> = {
    "urgent": "text-red-400 bg-red-400/10 border-red-400/20",
    "high": "text-orange-400 bg-orange-400/10 border-orange-400/20",
    "medium": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    "low": "text-green-400 bg-green-400/10 border-green-400/20",
  };
  return map[priority] ?? "text-gray-400 bg-gray-400/10";
}
