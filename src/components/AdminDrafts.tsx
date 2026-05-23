import React from 'react';
import { motion } from 'motion/react';
import { FileText, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';

interface AdminDraftsProps {
  blogs: any[];
  onEdit: (blog: any) => void;
  onPublish: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

export function AdminDrafts({ blogs, onEdit, onPublish, onDelete }: AdminDraftsProps) {
  const drafts = blogs.filter(b => b.status === 'draft');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Saved Drafts</h1>
          <p className="text-gray-400 text-sm">You have {drafts.length} unfinished articles waiting for polish.</p>
        </div>
      </div>

      {drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-[#0B0F19] rounded-3xl border border-dashed border-[#1E2536] text-center">
          <Clock className="w-12 h-12 text-gray-700 mb-4" />
          <h3 className="text-lg font-medium text-white">No drafts found</h3>
          <p className="text-gray-500 mt-1">Start a new story and it will appear here as a draft.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft) => (
            <div key={draft.id} className="group bg-[#0B0F19] rounded-2xl border border-[#1E2536] overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
               <div className="relative h-40 bg-gray-900 overflow-hidden">
                 {draft.featured_image ? (
                   <img src={draft.featured_image} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-indigo-950/20">
                     <FileText className="w-10 h-10 text-gray-800" />
                   </div>
                 )}
                 <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                   {draft.category_slug}
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent opacity-60"></div>
               </div>
               <div className="p-5 space-y-4">
                 <div>
                   <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{draft.title || 'Untitled Draft'}</h3>
                   <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Last edited {new Date(draft.created_at).toLocaleDateString()}</span>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between pt-4 border-t border-[#1E2536]">
                    <div className="flex gap-2">
                       <button onClick={() => onEdit(draft)} className="p-2 bg-[#1E2536] text-white rounded-lg hover:bg-indigo-600 transition-colors">
                         <Edit className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => {
                           if (window.confirm("Are you sure you want to delete this draft?")) {
                             onDelete(draft.id);
                           }
                         }}
                         className="p-2 bg-[#1E2536] text-gray-400 hover:text-red-400 rounded-lg transition-colors bg-opacity-80 hover:bg-opacity-100"
                         title="Delete Draft"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                    <button 
                      onClick={() => onPublish(draft.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <CheckCircle className="w-3 h-3" /> Publish
                    </button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
