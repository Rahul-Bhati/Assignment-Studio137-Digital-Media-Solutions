export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string; // ISO date string
    priority: 'Low' | 'Medium' | 'High';
    status: 'In Progress' | 'Completed';
}
  