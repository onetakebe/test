export interface Project {
  id: string;
  name: string;
  client: string;
  clientId: string;
  description: string;
  type: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  priority: "low" | "medium" | "high" | "urgent";
  progress: number;
  deadline: string;
  startDate: string;
  team: { name: string; avatar: string; initials: string; color: string }[];
  tags: string[];
  coverColor: string;
  phase: string;
}

export const projects: Project[] = [
  {
    id: "proj-001",
    name: "Apex Brand Film",
    client: "Apex Corp",
    clientId: "client-001",
    description: "Full brand identity film showcasing Apex Corp's values and mission for Q4 campaign launch.",
    type: "Video Production",
    status: "in-progress",
    priority: "high",
    progress: 72,
    deadline: "2024-07-28",
    startDate: "2024-06-01",
    team: [
      { name: "Ana Lima", avatar: "", initials: "AL", color: "#7D33FF" },
      { name: "Bruno Costa", avatar: "", initials: "BC", color: "#FF6B35" },
      { name: "Carla Souza", avatar: "", initials: "CS", color: "#00C896" },
    ],
    tags: ["Brand", "Film", "Video"],
    coverColor: "from-purple-600 to-indigo-700",
    phase: "In Post-production",
  },
  {
    id: "proj-002",
    name: "Luxe.co Website",
    client: "Luxe Brands",
    clientId: "client-002",
    description: "Full website redesign and development for Luxe.co luxury fashion brand with e-commerce integration.",
    type: "Web Development",
    status: "in-progress",
    priority: "high",
    progress: 65,
    deadline: "2024-08-05",
    startDate: "2024-06-15",
    team: [
      { name: "Diana Rocha", avatar: "", initials: "DR", color: "#FF3366" },
      { name: "Eduardo Melo", avatar: "", initials: "EM", color: "#00C8FF" },
    ],
    tags: ["Web", "Design", "E-commerce"],
    coverColor: "from-pink-500 to-rose-600",
    phase: "In Development",
  },
  {
    id: "proj-003",
    name: "Nova Social Campaign",
    client: "Nova Foods",
    clientId: "client-003",
    description: "Multi-platform social media campaign with 30+ assets for Instagram, TikTok, and YouTube.",
    type: "Social Media",
    status: "in-progress",
    priority: "medium",
    progress: 48,
    deadline: "2024-08-12",
    startDate: "2024-07-01",
    team: [
      { name: "Fernanda Santos", avatar: "", initials: "FS", color: "#FFB700" },
      { name: "Gabriel Nunes", avatar: "", initials: "GN", color: "#7D33FF" },
      { name: "Helena Costa", avatar: "", initials: "HC", color: "#00C896" },
    ],
    tags: ["Social", "Content", "Campaign"],
    coverColor: "from-orange-500 to-yellow-500",
    phase: "Content Production",
  },
  {
    id: "proj-004",
    name: "After Drinks Content Pack",
    client: "After Drinks Co",
    clientId: "client-004",
    description: "Complete content production pack including photography, video reels, and copy for launch.",
    type: "Content Production",
    status: "in-progress",
    priority: "medium",
    progress: 30,
    deadline: "2024-09-01",
    startDate: "2024-07-10",
    team: [
      { name: "Igor Mendes", avatar: "", initials: "IM", color: "#FF6B35" },
      { name: "Julia Ferreira", avatar: "", initials: "JF", color: "#00C8FF" },
    ],
    tags: ["Content", "Photography", "Beverage"],
    coverColor: "from-teal-500 to-cyan-600",
    phase: "Planning",
  },
  {
    id: "proj-005",
    name: "TechStart Pitch Deck",
    client: "TechStart",
    clientId: "client-005",
    description: "Investor pitch deck design and animation for Series A funding round.",
    type: "Design",
    status: "review",
    priority: "urgent",
    progress: 90,
    deadline: "2024-07-20",
    startDate: "2024-07-01",
    team: [
      { name: "Ana Lima", avatar: "", initials: "AL", color: "#7D33FF" },
    ],
    tags: ["Design", "Presentation", "Startup"],
    coverColor: "from-blue-600 to-violet-600",
    phase: "Client Review",
  },
  {
    id: "proj-006",
    name: "FreshMart Brand Identity",
    client: "FreshMart",
    clientId: "client-006",
    description: "Complete brand identity system including logo, color palette, typography, and brand guidelines.",
    type: "Branding",
    status: "completed",
    priority: "medium",
    progress: 100,
    deadline: "2024-07-01",
    startDate: "2024-05-15",
    team: [
      { name: "Diana Rocha", avatar: "", initials: "DR", color: "#FF3366" },
      { name: "Bruno Costa", avatar: "", initials: "BC", color: "#FF6B35" },
    ],
    tags: ["Branding", "Identity", "Logo"],
    coverColor: "from-green-500 to-emerald-600",
    phase: "Completed",
  },
];

export const getProjectById = (id: string) => projects.find(p => p.id === id);
