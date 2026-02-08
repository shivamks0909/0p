
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Project } from '../types';

interface RedirectSimProps {
  projects: Project[];
}

const RedirectSim: React.FC<RedirectSimProps> = ({ projects }) => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error' | 'paused'>('loading');
  const [targetUrl, setTargetUrl] = useState('');

  const uid = searchParams.get('uid') || 'GUEST_USER';

  useEffect(() => {
    // We check localStorage directly to simulate a "live" database check
    const liveProjects: Project[] = JSON.parse(localStorage.getItem('oi_projects') || '[]');
    
    const timer = setTimeout(() => {
      const project = liveProjects.find(p => p.id === projectId);
      
      if (!project) {
        setStatus('error');
        return;
      }

      if (project.status === 'paused') {
        setStatus('paused');
        return;
      }

      if (project.status === 'completed') {
        window.location.href = '#/complete';
        return;
      }

      const finalUrl = `${project.clientBaseUrl}?external_uid=${uid}&source=opinioninsights`;
      setTargetUrl(finalUrl);
      setStatus('redirecting');
      
      setTimeout(() => {
        window.location.href = finalUrl;
      }, 1500);
    }, 1000);

    return () => clearTimeout(timer);
  }, [projectId, uid]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-blue-200">
        OI
      </div>
      
      {status === 'loading' && (
        <div className="space-y-4 animate-pulse">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h1 className="text-xl font-black text-slate-800">Security Gate</h1>
          <p className="text-slate-500 font-medium">Validating participant integrity...</p>
        </div>
      )}

      {status === 'redirecting' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="text-green-500 text-4xl">🛡️</div>
          <h1 className="text-xl font-black text-slate-800">Verified</h1>
          <p className="text-slate-500 font-medium">Transferring to research environment...</p>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-[10px] font-mono text-slate-400 break-all max-w-sm mx-auto shadow-sm">
            Handshake: {targetUrl}
          </div>
        </div>
      )}

      {status === 'paused' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="text-yellow-500 text-5xl">⏸️</div>
          <h1 className="text-2xl font-black text-slate-800">Campaign Inactive</h1>
          <p className="text-slate-500 font-medium max-w-sm">This research study is currently paused by the administrator. Please try again later.</p>
          <button 
            onClick={() => window.close()}
            className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm"
          >
            Close Survey
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="text-red-500 text-5xl mb-2">⚠️</div>
          <h1 className="text-xl font-black text-slate-800">Invalid Entry Point</h1>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">The project code provided is invalid or has been permanently removed from our tracking system.</p>
        </div>
      )}
    </div>
  );
};

export default RedirectSim;
