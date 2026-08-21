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

const safeFetch = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`Fetch error for ${url}:`, err);
    return null;
  }
};

export const api = {
  guestLogin: async (dto?: { fullName?: string; title?: string }): Promise<{ user: User; token: string }> => {
    const data = await safeFetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto || {}),
    });
    const guestId = Math.floor(Math.random() * 1000);
    const user = data?.user || {
      id: `guest-${guestId}`,
      email: `guest_${guestId}@ablespace.io`,
      fullName: dto?.fullName || `Guest User #${guestId}`,
      title: dto?.title || 'Guest Specialist',
      username: `guest_${guestId}`,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isGuest: true,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    return { user, token: data?.token || 'guest-token' };
  },

  registerUser: async (data: {
    email: string;
    fullName?: string;
    username?: string;
    title?: string;
  }): Promise<{ user: User; token: string }> => {
    const res = await safeFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const emailPrefix = data.email.split('@')[0].toLowerCase();
    const user = res?.user || {
      id: `user-${Date.now()}`,
      email: data.email,
      fullName: data.fullName || emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1),
      username: data.username || emailPrefix,
      title: data.title || 'Workspace Member',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isGuest: false,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    return { user, token: res?.token || 'user-token' };
  },

  loginUser: async (data: { email: string }): Promise<{ user: User; token: string }> => {
    const res = await safeFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const emailPrefix = data.email.split('@')[0].toLowerCase();
    const user = res?.user || {
      id: `user-${Date.now()}`,
      email: data.email,
      fullName: emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1),
      username: emailPrefix,
      title: 'Workspace Member',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isGuest: false,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    return { user, token: res?.token || 'user-token' };
  },

  googleLogin: async (): Promise<{ user: User; token: string }> => {
    const data = await safeFetch(`${API_BASE}/auth/google`, { method: 'POST' });
    const user = data?.user || {
      id: 'google-1',
      email: 'user@ablespace.io',
      fullName: 'Google User',
      title: 'Product Specialist',
      username: 'google_user',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isGuest: false,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    return { user, token: data?.token || 'google-token' };
  },

  getProfile: async (): Promise<User> => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('user_data');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed && parsed.fullName) return parsed;
        } catch (e) {}
      }
    }
    const data = await safeFetch(`${API_BASE}/users/me`);
    const fallback = data || {
      id: 'default-1',
      email: 'user@ablespace.io',
      fullName: 'Active User',
      title: 'Workspace Member',
      username: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isGuest: false,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(fallback));
    }
    return fallback;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    let current = await api.getProfile();
    const updated = { ...current, ...data };
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(updated));
    }
    safeFetch(`${API_BASE}/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});
    return updated;
  },

  leaveWorkspace: async (): Promise<{ success: boolean; message: string }> => {
    const res = await safeFetch(`${API_BASE}/users/me/leave-workspace`, { method: 'POST' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
    }
    return res || { success: true, message: 'Left workspace' };
  },

  getTasks: async (params?: { projectId?: string; status?: string; search?: string }): Promise<Task[]> => {
    const query = new URLSearchParams(params as any).toString();
    const data = await safeFetch(`${API_BASE}/tasks${query ? `?${query}` : ''}`);
    return Array.isArray(data) ? data : [];
  },

  getTask: async (id: string): Promise<Task | null> => {
    return safeFetch(`${API_BASE}/tasks/${id}`);
  },

  createTask: async (data: Partial<Task>): Promise<Task> => {
    const res = await safeFetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res || {
      id: `task-${Date.now()}`,
      title: data.title || 'New Task',
      status: data.status || 'ToDo',
      priority: data.priority || 'Medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const res = await safeFetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res || ({ id, ...data } as Task);
  },

  updateTaskStatus: async (id: string, status: string): Promise<Task> => {
    const res = await safeFetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res || ({ id, status } as Task);
  },

  deleteTask: async (id: string): Promise<{ success: boolean }> => {
    const res = await safeFetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    return res || { success: true };
  },

  getActivityLogs: async (id: string): Promise<ActivityLog[]> => {
    const data = await safeFetch(`${API_BASE}/tasks/${id}/activity`);
    return Array.isArray(data) ? data : [];
  },

  getSubtasks: async (taskId: string): Promise<Subtask[]> => {
    const data = await safeFetch(`${API_BASE}/tasks/${taskId}/subtasks`);
    return Array.isArray(data) ? data : [];
  },

  createSubtask: async (taskId: string, data: Partial<Subtask>): Promise<Subtask> => {
    const res = await safeFetch(`${API_BASE}/tasks/${taskId}/subtasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res || {
      id: `subtask-${Date.now()}`,
      taskId,
      title: data.title || 'New Subtask',
      completed: false,
    };
  },

  updateSubtask: async (taskId: string, id: string, data: Partial<Subtask>): Promise<Subtask> => {
    const res = await safeFetch(`${API_BASE}/tasks/${taskId}/subtasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res || ({ id, taskId, ...data } as Subtask);
  },

  getComments: async (taskId: string): Promise<Comment[]> => {
    const data = await safeFetch(`${API_BASE}/tasks/${taskId}/comments`);
    return Array.isArray(data) ? data : [];
  },

  createComment: async (taskId: string, body: string): Promise<Comment> => {
    const activeUser = await api.getProfile();
    const res = await safeFetch(`${API_BASE}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, authorName: activeUser.fullName, authorAvatar: activeUser.avatarUrl }),
    });
    return res || {
      id: `comment-${Date.now()}`,
      taskId,
      authorName: activeUser.fullName,
      authorAvatar: activeUser.avatarUrl,
      body,
      createdAt: new Date().toISOString(),
    };
  },

  getProjects: async (): Promise<Project[]> => {
    const data = await safeFetch(`${API_BASE}/projects`);
    return Array.isArray(data) ? data : [];
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    const res = await safeFetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res || {
      id: `proj-${Date.now()}`,
      name: data.name || 'New Project',
      priority: data.priority || 'Medium',
      workspaceName: 'Pyramid Workspace',
      ...data,
    };
  },
};
