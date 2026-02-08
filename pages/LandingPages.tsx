
import React from 'react';
import { Link } from 'react-router-dom';

interface OutcomePageProps {
  type: 'complete' | 'terminate' | 'quotefull';
}

const OutcomePage: React.FC<OutcomePageProps> = ({ type }) => {
  const configs = {
    complete: {
      icon: '✅',
      title: 'Survey Completed',
      subtitle: 'Thank you for your valuable feedback!',
      message: 'Your responses have been successfully recorded. Your rewards will be processed according to the panel guidelines.',
      color: 'bg-green-50 text-green-600 border-green-100'
    },
    terminate: {
      icon: '❌',
      title: 'Study Screen-out',
      subtitle: 'Not a match this time',
      message: 'Unfortunately, your profile does not match the specific requirements for this study. We appreciate your time nonetheless!',
      color: 'bg-red-50 text-red-600 border-red-100'
    },
    quotefull: {
      icon: '📊',
      title: 'Quota Reached',
      subtitle: 'Maximum responses reached',
      message: 'The researchers have already collected the required number of responses for your demographic. We hope to see you in the next study!',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-100'
    }
  };

  const config = configs[type];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-10">
        <div className="text-6xl mb-6">{config.icon}</div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">{config.title}</h1>
        <h2 className="text-lg font-bold text-slate-500 mb-6">{config.subtitle}</h2>
        
        <div className={`p-6 rounded-2xl border ${config.color} mb-8 text-sm leading-relaxed`}>
          {config.message}
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => window.close()} 
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
          >
            Close Window
          </button>
          <Link 
            to="/login" 
            className="block text-xs text-slate-400 font-bold hover:text-blue-600 uppercase tracking-widest"
          >
            Panel Member Login
          </Link>
        </div>
      </div>
      
      <p className="mt-10 text-[10px] text-slate-300 font-black tracking-widest uppercase">
        Powered by Opinion Insights Redirect Engine
      </p>
    </div>
  );
};

export default OutcomePage;
