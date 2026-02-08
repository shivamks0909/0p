
import React, { useState, useMemo, useContext } from 'react';
import { Client, Project, DashboardMetric } from '../types';
import { MOCK_DASHBOARD_DATA, COUNTRIES } from '../constants';
import { ToastContext } from '../App';

const StatsCard: React.FC<{ label: string; value: string | number; change?: string; color: string }> = ({ label, value, change, color }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{value}</h3>
    </div>
    {change && (
      <div className="mt-4 flex items-center">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>
          {change} conversion
        </span>
      </div>
    )}
  </div>
);

const SimpleBarChart: React.FC<{ data: number[] }> = ({ data }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((v, i) => (
        <div
          key={i}
          className="bg-blue-200 hover:bg-blue-500 transition-all rounded-t-sm flex-1"
          style={{ height: `${(v / max) * 100}%` }}
          title={`Value: ${v}`}
        />
      ))}
    </div>
  );
};

interface DashboardProps {
  clients: Client[];
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ clients, projects }) => {
  const toast = useContext(ToastContext);
  const [filterClient, setFilterClient] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterCountry, setFilterCountry] = useState('');

  const filteredData = useMemo(() => {
    return MOCK_DASHBOARD_DATA.filter(item => {
      return (
        (filterClient === '' || item.clientId === filterClient) &&
        (filterProject === '' || item.projectId === filterProject) &&
        (filterCountry === '' || item.country === filterCountry)
      );
    });
  }, [filterClient, filterProject, filterCountry]);

  const totals = useMemo(() => {
    return filteredData.reduce((acc, curr) => ({
      clicks: acc.clicks + curr.totalClicks,
      completes: acc.completes + curr.completed,
      terminated: acc.terminated + curr.terminated,
      quotaFull: acc.quotaFull + curr.quotaFull,
    }), { clicks: 0, completes: 0, terminated: 0, quotaFull: 0 });
  }, [filteredData]);

  const handleExport = () => {
    if (filteredData.length === 0) {
      toast?.notify('No data to export', 'error');
      return;
    }

    const headers = ['Client', 'Project', 'Country', 'Clicks', 'Completes', 'Terminated', 'Quota Full', 'IR %'];
    const csvRows = filteredData.map(item => [
      item.clientName,
      item.projectName,
      item.country,
      item.totalClicks,
      item.completed,
      item.terminated,
      item.quotaFull,
      ((item.completed / (item.totalClicks || 1)) * 100).toFixed(2)
    ]);

    const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `OI_Performance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast?.notify('Performance report exported');
  };

  const clickTrend = [12, 45, 34, 67, 89, 43, 56, 78, 90, 120, 80, 60, 40, 95];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          label="Total Clicks" 
          value={totals.clicks.toLocaleString()} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatsCard 
          label="Completed" 
          value={totals.completes.toLocaleString()} 
          change={`${((totals.completes/totals.clicks)*100 || 0).toFixed(1)}%`} 
          color="bg-green-50 text-green-600" 
        />
        <StatsCard 
          label="Terminated" 
          value={totals.terminated.toLocaleString()} 
          change={`${((totals.terminated/totals.clicks)*100 || 0).toFixed(1)}%`} 
          color="bg-red-50 text-red-600" 
        />
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">7-Day Traffic Trend</p>
           <SimpleBarChart data={clickTrend} />
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-2 items-center">
        <div className="flex-1 flex gap-2 min-w-[300px]">
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Clients</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg p-2 outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {setFilterClient(''); setFilterProject(''); setFilterCountry('');}}
            className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Reset
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Traffic Monitor</h3>
            <p className="text-xs text-slate-500">Auto-updates every 60s</p>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 px-2 py-1 bg-green-50 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            LIVE
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 font-black">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4 text-center">Clicks</th>
                <th className="px-6 py-4 text-center">LOI (Min)</th>
                <th className="px-6 py-4 text-center text-green-600">Completes</th>
                <th className="px-6 py-4 text-center text-red-600">Terms</th>
                <th className="px-6 py-4 text-center text-yellow-600">QF</th>
                <th className="px-6 py-4 text-right">Incidence %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((item, idx) => {
                const ir = ((item.completed / (item.totalClicks || 1)) * 100).toFixed(1);
                return (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600">{item.projectName}</div>
                      <div className="text-[10px] text-slate-400">{item.clientName} &middot; {item.country}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-600">{item.totalClicks}</td>
                    <td className="px-6 py-4 text-center text-slate-500">12.5</td>
                    <td className="px-6 py-4 text-center font-bold text-green-600">{item.completed}</td>
                    <td className="px-6 py-4 text-center font-bold text-red-400">{item.terminated}</td>
                    <td className="px-6 py-4 text-center font-bold text-yellow-500">{item.quotaFull}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-slate-800">{ir}%</span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div className="bg-blue-500 h-full" style={{ width: `${ir}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
