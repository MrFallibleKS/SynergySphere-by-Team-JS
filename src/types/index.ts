
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Task = {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  dueDate: string;
  status: Status;
  projectId: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  role?: string;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  content: string;
  authorId: string;
  taskId: string;
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  imageBanner?: string;
  managerName?: string;
  managerContact?: string;
  tags?: string[];
  members: string[]; // User IDs
  tasks: string[]; // Task IDs
  taskDetails?: Task[]; // Full task objects for form handling
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  type: 'TASK_ASSIGNED' | 'TASK_DUE_SOON' | 'TASK_OVERDUE' | 'COMMENT_ADDED' | 'PROJECT_UPDATED' | 'TASK_AVAILABLE';
  referenceId: string; // ID of the related task, project, etc.
  userId: string;
  read: boolean;
  createdAt: string;
};
