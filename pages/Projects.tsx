
import React, { useState, useContext, useMemo } from 'react';
import { Project, Client } from '../types';
import { COUNTRIES } from '../constants';
import { ToastContext } from '../App';

interface ProjectsProps {
  clients: Client[];
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const Projects: React.FC<ProjectsProps> = ({ clients, projects, setProjects }) => {
  const toast = useContext(ToastContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    clientId: '',
    projectName: '',
    country: 'USA',
    clientBaseUrl: ''
  });

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const toggleProjectStatus = (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'active' ? 'paused' : 'active';
        toast?.notify(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'} successfully`, newStatus === 'active' ? 'success' : 'info');
        return { ...p, status: newStatus as any };
      }
      return p;
    }));
  };

  const handleAddProject = () => {
    if (!formData.clientId || !formData.projectName || !formData.clientBaseUrl) {
      toast?.notify('Please complete all required fields', 'error');
      return;
    }

    const projectId = `p${Date.now()}`;
    const client = clients.find(c => c.id === formData.clientId);

    const newProject: Project = {
      id: projectId,
      clientId: formData.clientId,
      clientName: client?.name || 'Unknown',
      projectName: formData.projectName,
      country: formData.country,
      clientBaseUrl: formData.clientBaseUrl,
      redirectLink: `https://opinioninsights.in/r/${projectId}?uid=USERID`,
      status: 'active',
      created_at: new Date().toISOString().split('T')[0]
    };

    setProjects(prev => [newProject, ...prev]);
    setIsModalOpen(false);
    setFormData({ clientId: '', projectName: '', country: 'USA', clientBaseUrl: '' });
    toast?.notify('Project campaign created successfully');
  };

  const copyToClipboard = (text: string) => {
    const hashBase = window.location.href.split('#')[0];
    const testLink = `${hashBase}#/r/${text.split('/r/')[1]}`;
    navigator.clipboard.writeText(testLink);
    toast?.notify('Live test link copied to clipboard');
  };

  const handleExport = () => {
    if (filteredProjects.length === 0) {
      toast?.notify('No projects to export', 'error');
      return;
    }

    const headers = ['ID', 'Project Name', 'Client', 'Country', 'Status', 'Base URL', 'Redirect Link', 'Created At'];
    const csvRows = filteredProjects.map(p => [
      p.id,
      `"${p.projectName}"`,
      `"${p.clientName}"`,
      p.country,
      p.status,
      `"${p.clientBaseUrl}"`,
      `"${p.redirectLink}"`,
      p.created_at
    ]);

    const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `OI_Projects_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast?.notify('Project list exported to CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Campaign Manager</h3>
          <p className="text-sm text-slate-500">Configure survey routers and tracking entry points.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <input 
              type="text" 
              placeholder="Filter by name or client..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-72 outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-2.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-100 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              New Campaign
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 font-black">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Campaign Strategy</th>
              <th className="px-6 py-4">Target Market</th>
              <th className="px-6 py-4">Live Test Link</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProjects.map(project => (
              <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleProjectStatus(project.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${project.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${project.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{project.projectName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">{project.clientName}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                    {project.country}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 max-w-[280px]">
                      <code className="text-[11px] bg-slate-50 border border-slate-200 p-1.5 rounded text-blue-600 truncate flex-1 font-mono">
                        {project.redirectLink}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(project.redirectLink)}
                        className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-blue-600 transition-colors shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      </button>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <div className="relative group/menu">
                      <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                      <div className="absolute right-0 top-10 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 hidden group-hover/menu:block">
                        <div className="px-4 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Testing</div>
                        <a href="#/complete" target="_blank" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-green-50 hover:text-green-600">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Test Success
                        </a>
                        <a href="#/terminate" target="_blank" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Test Terminate
                        </a>
                        <a href="#/quotefull" target="_blank" className="flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-yellow-50 hover:text-yellow-600">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> Test QF
                        </a>
                        <div className="my-2 border-t border-slate-100"></div>
                        <button onClick={() => setProjects(prev => prev.filter(p => p.id !== project.id))} className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-bold">
                          Delete Project
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProjects.length === 0 && (
          <div className="p-20 text-center space-y-2">
            <div className="text-slate-200 text-6xl">🚀</div>
            <p className="text-slate-400 text-sm font-medium">No projects found. Launch your first campaign today.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Campaign Architect</h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full shadow-sm border border-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Supply Source</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Partner</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Target Market</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Campaign Title</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="e.g. 2024 Beverage Consumption Habits"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Endpoint URL (Client Destination)</label>
                <input
                  type="url"
                  value={formData.clientBaseUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientBaseUrl: e.target.value }))}
                  placeholder="https://surveys.partner.com/start"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
              <button onClick={() => setIsModalOpen(false)} className="text-sm font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Cancel</button>
              <button
                onClick={handleAddProject}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-0.5 uppercase tracking-wider"
              >
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
