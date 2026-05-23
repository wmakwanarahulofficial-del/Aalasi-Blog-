import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Mail, Shield, Trash2, Edit, X, Key, UserCheck, Settings } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'Administrator' | 'Editor' | 'Writer' | 'Contributor';
  avatar: string;
  status: 'Active' | 'Pending';
  articlesCount: number;
  joinedDate: string;
}

export function AdminTeam() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Rahul Makwana",
      email: "rahul@aalasi.com",
      role: 'Administrator',
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      status: 'Active',
      articlesCount: 14,
      joinedDate: "Mar 12, 2024"
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      email: "sarah@aalasi.com",
      role: 'Editor',
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      status: 'Active',
      articlesCount: 22,
      joinedDate: "Apr 05, 2025"
    },
    {
      id: 3,
      name: "Aman Varma",
      email: "aman@aalasi.com",
      role: 'Writer',
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman",
      status: 'Active',
      articlesCount: 8,
      joinedDate: "Jan 18, 2026"
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Administrator' | 'Editor' | 'Writer' | 'Contributor'>('Writer');

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newMember: TeamMember = {
      id: Date.now(),
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      status: 'Pending',
      articlesCount: 0,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setMembers([...members, newMember]);
    setName('');
    setEmail('');
    setRole('Writer');
    setIsAdding(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setMembers(members.map(m => m.id === editingMember.id ? { ...editingMember } : m));
    setEditingMember(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to remove this team member? All active session credentials will be immediately revoked.")) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center bg-[#0B0F19] p-6 rounded-2xl border border-[#1E2536]">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Editorial Team</h1>
          <p className="text-xs text-gray-400">Manage writer profiles, assign server role privileges, and invite active editors.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {/* Grid of Crew cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="relative group bg-[#0B0F19] border border-[#1E2536] rounded-2xl p-6 transition-all hover:border-indigo-500/40 hover:shadow-xl flex flex-col justify-between">
            <div>
              {/* Profile Top line */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-950/40 p-1 border border-indigo-500/10 overflow-hidden relative">
                    <img src={member.avatar} className="w-full h-full object-cover" alt="" />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0B0F19] rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-tight">{member.name}</h3>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {member.email}</p>
                  </div>
                </div>
              </div>

              {/* Roles Badge & info */}
              <div className="grid grid-cols-2 gap-4 bg-[#111624] p-3 rounded-xl border border-[#1E2536] mt-5">
                <div>
                  <div className="text-[9px] text-gray-500 uppercase font-black">Role Privilege</div>
                  <span className={`inline-block mt-0.5 text-[10px] font-bold ${member.role === 'Administrator' ? 'text-indigo-400' : member.role === 'Editor' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {member.role}
                  </span>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 uppercase font-black">Articles</div>
                  <p className="text-xs font-bold text-white mt-0.5">{member.articlesCount} published</p>
                </div>
              </div>
            </div>

            {/* Options bar */}
            <div className="flex items-center justify-between border-t border-[#1E2536]/40 mt-5 pt-4">
              <span className="text-[10px] text-gray-600 font-bold uppercase font-mono">Crew since {member.joinedDate}</span>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setEditingMember(member)}
                  className="p-1.5 bg-[#111624] text-gray-400 hover:text-white rounded-lg transition-colors border border-[#1E2536]"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDelete(member.id)}
                  disabled={member.id === 1} // Can't delete main admin
                  className={`p-1.5 bg-[#111624] text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-[#1E2536] ${member.id === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adding Member Modal Popup */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-3xl w-full max-w-md shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" /> Invite New Team Member
                </h2>
                <button onClick={() => setIsAdding(false)} className="p-1 text-gray-400 hover:text-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMember} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                    placeholder="e.g. writer@aalasi.com"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Publishing Privilege</label>
                  <select 
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="Administrator">Administrator (All Permissions)</option>
                    <option value="Editor">Editor (Edit and Publish)</option>
                    <option value="Writer">Writer (Write and Save Drafts)</option>
                    <option value="Contributor">Contributor (Submit Draft Proposals)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#1E2536]/20">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-transparent text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg">Invite Member</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Editing Member Roles Popup */}
      <AnimatePresence>
        {editingMember && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-3xl w-full max-w-sm shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-400" /> Edit Credentials
                </h2>
                <button onClick={() => setEditingMember(null)} className="p-1 text-gray-400 hover:text-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="flex items-center gap-3 bg-[#111624] p-3 rounded-xl border border-[#1E2536]">
                  <img src={editingMember.avatar} className="w-10 h-10 rounded-lg" alt="" />
                  <div>
                    <h4 className="text-white font-bold text-xs">{editingMember.name}</h4>
                    <p className="text-[10px] text-gray-500">{editingMember.email}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 font-mono">Assigned Role Group</label>
                  <select 
                    value={editingMember.role}
                    onChange={e => setEditingMember({ ...editingMember, role: e.target.value as any })}
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Editor">Editor</option>
                    <option value="Writer">Writer</option>
                    <option value="Contributor">Contributor</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#1E2536]/20">
                  <button type="button" onClick={() => setEditingMember(null)} className="px-4 py-2 bg-transparent text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg">Save Settings</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
