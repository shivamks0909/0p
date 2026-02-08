
export interface Client {
  id: string;
  name: string;
  created_at: string;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  projectName: string;
  country: string;
  clientBaseUrl: string;
  redirectLink: string;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
}

export interface DashboardMetric {
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  country: string;
  totalClicks: number;
  completed: number;
  terminated: number;
  quotaFull: number;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}
