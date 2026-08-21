const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  title: string;
  username: string;
  avatarUrl: string;
  isGuest: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'ToDo' | 'Doing' | 'Completed' | 'OnHold' | 'Backlog';
  priority: 'NoPriority' | 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate?: string;
  reporterName?: string;
  projectName?: string;
  assignees?: string[];
  labels?: string[];
  teams?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  priority?: string;
  assigneeName?: string;
  dueDate?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  taskId: string;
  userName: string;
  action: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  priority: string;
  leadName?: string;
  dueDate?: string;
  workspaceName?: string;
}

export const api = {
  // Auth
  guestLogin: async (): Promise<{ user: User; token: string }> => {
    const res = await fetch(`${API_BASE}/auth/guest`, { method: 'POST' });
    return res.json();
  },
  googleLogin: async (): Promise<{ user: User; token: string }> => {
    const res = await fetch(`${API_BASE}/auth/google`, { method: 'POST' });
    return res.json();
  },

  // Users
  getProfile: async (): Promise<User> => {
    const res = await fetch(`${API_BASE}/users/me`);
    return res.json();
  },
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  leaveWorkspace: async (): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/users/me/leave-workspace`, { method: 'POST' });
    return res.json();
  },

  // Tasks
  getTasks: async (params?: { projectId?: string; status?: string; search?: string }): Promise<Task[]> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/tasks${query ? `?${query}` : ''}`);
    return res.json();
  },
  getTask: async (id: string): Promise<Task> => {
    const res = await fetch(`${API_BASE}/tasks/${id}`);
    return res.json();
  },
  createTask: async (data: Partial<Task>): Promise<Task> => {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateTaskStatus: async (id: string, status: string): Promise<Task> => {
    const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
  deleteTask: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    return res.json();
  },
  getActivityLogs: async (id: string): Promise<ActivityLog[]> => {
    const res = await fetch(`${API_BASE}/tasks/${id}/activity`);
    return res.json();
  },

  // Subtasks
  getSubtasks: async (taskId: string): Promise<Subtask[]> => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks`);
    return res.json();
  },
  createSubtask: async (taskId: string, data: Partial<Subtask>): Promise<Subtask> => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateSubtask: async (taskId: string, id: string, data: Partial<Subtask>): Promise<Subtask> => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Comments
  getComments: async (taskId: string): Promise<Comment[]> => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`);
    return res.json();
  },
  createComment: async (taskId: string, body: string): Promise<Comment> => {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    return res.json();
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },
  createProject: async (data: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
