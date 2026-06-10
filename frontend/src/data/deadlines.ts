export interface Deadline {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  dueDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "completed" | "overdue";
  description?: string;
}

export const deadlines: Deadline[] = [
  {
    id: "dl-001",
    title: "TechStart Pitch Deck Final",
    projectId: "proj-005",
    projectName: "TechStart Pitch Deck",
    dueDate: "2024-07-20",
    priority: "urgent",
    status: "pending",
    description: "Final delivery of pitch deck with all revisions applied.",
  },
  {
    id: "dl-002",
    title: "Apex Brand Film Cut",
    projectId: "proj-001",
    projectName: "Apex Brand Film",
    dueDate: "2024-07-22",
    priority: "high",
    status: "pending",
    description: "First cut of brand film for client review.",
  },
  {
    id: "dl-003",
    title: "Luxe.co Wireframe Approval",
    projectId: "proj-002",
    projectName: "Luxe.co Website",
    dueDate: "2024-07-23",
    priority: "high",
    status: "pending",
    description: "Client must approve wireframes to proceed to development.",
  },
  {
    id: "dl-004",
    title: "Nova Campaign First Batch",
    projectId: "proj-003",
    projectName: "Nova Social Campaign",
    dueDate: "2024-07-25",
    priority: "medium",
    status: "pending",
    description: "Deliver first 10 reels and 5 static posts.",
  },
  {
    id: "dl-005",
    title: "After Drinks Photo Session",
    projectId: "proj-004",
    projectName: "After Drinks Content Pack",
    dueDate: "2024-07-28",
    priority: "medium",
    status: "pending",
    description: "Complete product photography session.",
  },
  {
    id: "dl-006",
    title: "Luxe.co Full Website Launch",
    projectId: "proj-002",
    projectName: "Luxe.co Website",
    dueDate: "2024-08-05",
    priority: "high",
    status: "pending",
    description: "Full website goes live.",
  },
];
