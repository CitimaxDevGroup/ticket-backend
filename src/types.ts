export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  assignedTo?: string;
  assignee?: string;  // <-- Added this line
  company?: string;
}
