export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "deadline" | "comment" | "approval" | "task" | "system";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  avatar?: { initials: string; color: string };
}

export const notifications: Notification[] = [
  {
    id: "notif-001",
    title: "Deadline Tomorrow",
    message: "TechStart Pitch Deck is due tomorrow. 90% complete.",
    type: "deadline",
    isRead: false,
    createdAt: "2024-07-18T10:00:00Z",
    actionUrl: "/projects/proj-005",
  },
  {
    id: "notif-002",
    title: "New Comment",
    message: "Ricardo Apex left a comment on the brand film review.",
    type: "comment",
    isRead: false,
    createdAt: "2024-07-18T09:30:00Z",
    actionUrl: "/projects/proj-001",
    avatar: { initials: "RA", color: "#7D33FF" },
  },
  {
    id: "notif-003",
    title: "Task Approved",
    message: "Wireframes approved by Sofia Luxe. Ready to proceed.",
    type: "approval",
    isRead: false,
    createdAt: "2024-07-18T09:00:00Z",
    actionUrl: "/tasks",
    avatar: { initials: "SL", color: "#FF3366" },
  },
  {
    id: "notif-004",
    title: "Urgent Task",
    message: "Pitch deck review slides 20-30 are overdue.",
    type: "task",
    isRead: false,
    createdAt: "2024-07-17T18:00:00Z",
    actionUrl: "/tasks",
  },
  {
    id: "notif-005",
    title: "New Upload",
    message: "Bruno Costa uploaded 3 raw files to Apex Brand Film.",
    type: "task",
    isRead: false,
    createdAt: "2024-07-17T16:00:00Z",
    actionUrl: "/projects/proj-001",
    avatar: { initials: "BC", color: "#FF6B35" },
  },
  {
    id: "notif-006",
    title: "Meeting Reminder",
    message: "Creative review with Nova Foods team at 14:00.",
    type: "system",
    isRead: false,
    createdAt: "2024-07-17T13:00:00Z",
    actionUrl: "/calendar",
  },
  {
    id: "notif-007",
    title: "Instagram Report Ready",
    message: "Weekly Instagram metrics report is ready to view.",
    type: "system",
    isRead: false,
    createdAt: "2024-07-17T10:00:00Z",
    actionUrl: "/metrics",
  },
  {
    id: "notif-008",
    title: "Invoice Paid",
    message: "After Drinks Co. paid invoice #2024-041 - R$ 12.500.",
    type: "system",
    isRead: false,
    createdAt: "2024-07-16T15:00:00Z",
  },
];
