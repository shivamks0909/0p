
import { Client, Project, DashboardMetric } from './types';

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Global Insight Partners', created_at: '2023-10-15' },
  { id: 'c2', name: 'Nielsen Dynamics', created_at: '2023-11-02' },
  { id: 'c3', name: 'Alpha Research Group', created_at: '2024-01-20' },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    clientId: 'c1',
    clientName: 'Global Insight Partners',
    projectName: 'Q4 Consumer Electronics Survey',
    country: 'USA',
    clientBaseUrl: 'https://client-survey.com/electronics-q4',
    redirectLink: 'https://opinioninsights.in/r/p1?uid=USERID',
    // Fix: Added missing 'status' property required by Project type
    status: 'active',
    created_at: '2023-11-10'
  },
  {
    id: 'p2',
    clientId: 'c2',
    clientName: 'Nielsen Dynamics',
    projectName: 'EU Automotive Trends',
    country: 'Germany',
    clientBaseUrl: 'https://surveys.nielsen.eu/auto-trends',
    redirectLink: 'https://opinioninsights.in/r/p2?uid=USERID',
    // Fix: Added missing 'status' property required by Project type
    status: 'active',
    created_at: '2023-12-05'
  }
];

export const MOCK_DASHBOARD_DATA: DashboardMetric[] = [
  {
    clientId: 'c1',
    clientName: 'Global Insight Partners',
    projectId: 'p1',
    projectName: 'Q4 Consumer Electronics Survey',
    country: 'USA',
    totalClicks: 1250,
    completed: 450,
    terminated: 680,
    quotaFull: 120
  },
  {
    clientId: 'c2',
    clientName: 'Nielsen Dynamics',
    projectId: 'p2',
    projectName: 'EU Automotive Trends',
    country: 'Germany',
    totalClicks: 890,
    completed: 310,
    terminated: 500,
    quotaFull: 80
  },
  {
    clientId: 'c3',
    clientName: 'Alpha Research Group',
    projectId: 'p3',
    projectName: 'Lifestyle Habits 2024',
    country: 'India',
    totalClicks: 2100,
    completed: 1200,
    terminated: 800,
    quotaFull: 100
  }
];

export const COUNTRIES = ['USA', 'UK', 'India', 'Germany', 'France', 'Canada', 'Australia'];
