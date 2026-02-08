
import React, { useState, useContext, useMemo } from 'react';
import { Client } from '../types';
import { ToastContext } from '../App';

interface ClientsProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const Clients: React.FC<ClientsProps> = ({ clients, setClients }) => {
  const toast = useContext(ToastContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [clients, searchQuery]);

  const handleAddClient = () => {
    if (!newClientName.trim()) return;

    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, name: newClientName } : c));
      toast?.notify('Client updated successfully');
    } else {
      const newClient: Client = {
        id: `c${Date.now()}`,
        name: newClientName,
        created_at: new Date().toISOString().split('T')[0]
      };
      setClients(prev => [...prev, newClient]);
      toast?.notify('New client added');
    }

    setNewClientName('');
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const deleteClient = (id: string) => {
    if (confirm('Are you sure you want to delete this client? All associated projects will remain but reference may break.')) {
      setClients(prev => prev.filter(c => c.id !== id));
      toast?.notify('Client deleted', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Partner Management</h3>
          <p className="text-sm text-slate-500">Configure your global research supply partners.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-2.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <button
            onClick={() => { setIsModalOpen(true); setEditingClient(null); setNewClientName(''); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-100"
          >
            Add New Client
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 font-black">
            <tr>
              <th className="px-6 py-4">Client Identifier</th>
              <th className="px-6 py-4">Date Added</th>
              <th className="px-6 py-4 text-right">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredClients.map(client => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-700">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">{client.created_at}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setEditingClient(client); setNewClientName(client.name); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    <button onClick={() => deleteClient(client.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClients.length === 0 && (
          <div className="p-20 text-center space-y-2">
            <div className="text-slate-200 text-6xl">🏢</div>
            <p className="text-slate-400 text-sm font-medium">No clients found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-150">
            <div className="p-6 border-b border-slate-100">
              <h4 className="text-lg font-bold text-slate-900">{editingClient ? 'Update Client' : 'New Client Registry'}</h4>
            </div>
            <div className="p-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Legal Client Name</label>
              <input
                type="text"
                autoFocus
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="e.g. Kantar Media"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="p-4 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600">Cancel</button>
              <button onClick={handleAddClient} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">
                {editingClient ? 'Save Changes' : 'Register Client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
