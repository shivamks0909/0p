
import React, { useState, useEffect, createContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import RedirectSim from './pages/RedirectSim';
import OutcomePage from './pages/LandingPages';
import { Client, Project, Notification, NotificationType } from './types';
import { MOCK_CLIENTS, MOCK_PROJECTS } from './constants';

interface ToastContextType {
  notify: (message: string, type?: NotificationType) => void;
}
export const ToastContext = createContext<ToastContextType | null>(null);

const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('oi_clients');
    return saved ? JSON.parse(saved) : MOCK_CLIENTS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('oi_projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: NotificationType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  useEffect(() => {
    localStorage.setItem('oi_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('oi_projects', JSON.stringify(projects));
  }, [projects]);

  return (
    <ToastContext.Provider value={{ notify }}>
      <Router>
        <div className="relative">
          {/* Global Notifications */}
          <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`pointer-events-auto px-4 py-3 rounded-lg shadow-xl text-white text-sm font-medium transform transition-all animate-in slide-in-from-right-full ${
                  n.type === 'success' ? 'bg-green-600' : n.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                }`}
              >
                {n.message}
              </div>
            ))}
          </div>

          <Routes>
            {/* Public Outcome / Landing Pages */}
            <Route path="/complete" element={<OutcomePage type="complete" />} />
            <Route path="/terminate" element={<OutcomePage type="terminate" />} />
            <Route path="/quotefull" element={<OutcomePage type="quotefull" />} />
            <Route path="/r/:projectId" element={<RedirectSim projects={projects} />} />
            
            {/* Admin Routes wrapped in Layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard clients={clients} projects={projects} />} />
                  <Route path="/clients" element={<Clients clients={clients} setClients={setClients} />} />
                  <Route path="/projects" element={<Projects clients={clients} projects={projects} setProjects={setProjects} />} />
                  {/* Catch-all for undefined admin paths */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </div>
      </Router>
    </ToastContext.Provider>
  );
};

export default App;
