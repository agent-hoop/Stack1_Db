import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutGrid, PenTool, Book, Film, Library, 
  Plus, Search, Save, ChevronLeft, Trash2, 
  X, Image as ImageIcon, Video, Music, Link as LinkIcon,
  Zap, Bell, Lock, Unlock, ShieldCheck, ShieldAlert,
  Eye, Globe, FileText, Settings2
} from 'lucide-react';
import Editor from './Compoents/Editor';

// --- CONSTANTS ---
const CATEGORIES = ['Dashboard', 'Poems', 'Stories', 'Media', 'Notes'];

const INITIAL_FORM_STATE = {
  id: null,
  title: '',
  author: '',
  category: 'Poems',
  status: 'Draft',
  content: '',
  mediaType: 'image',
  mediaUrl: '',
  publishDate: new Date().toISOString().split('T')[0],
  views: 0,
  tags: [],
  isLocked: false, // New Feature
  isGsn: false,    // New Feature
};

// --- ADVANCED UI COMPONENTS ---

const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-slate-800 text-slate-400 border-white/5',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[variant]}`}>
      {children}
    </span>
  );
};

const CustomToggle = ({ label, isActive, onClick, icon: Icon, activeColor = "bg-indigo-600" }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between w-full p-3 rounded-xl border transition-all duration-300 ${
      isActive ? `bg-white/5 border-white/20` : 'bg-transparent border-white/5 opacity-60 hover:opacity-100'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${isActive ? activeColor : 'bg-white/5'}`}>
        <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
      </div>
      <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>{label}</span>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${isActive ? activeColor : 'bg-slate-700'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isActive ? 'left-6' : 'left-1'}`} />
    </div>
  </button>
);

// --- MAIN APPLICATION ---

export default function AdminEntry() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [view, setView] = useState('list');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [tagInput, setTagInput] = useState('');

  const API = "http://localhost:3000/api/entries";

  // 1. DATA FETCHING
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. HANDLERS
  const handleCreateNew = () => {
    setFormData({ ...INITIAL_FORM_STATE, category: activeTab === 'Dashboard' ? 'Poems' : activeTab });
    setView('editor');
  };

  const handleEdit = (entry) => {
    setFormData({ ...entry });
    setView('editor');
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return alert("Title required.");
    
    try {
      const method = formData._id ? "PUT" : "POST";
      const url = formData._id ? `${API}/${formData._id}` : API;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const saved = await res.json();
      
      setEntries(prev => formData._id ? prev.map(e => e._id === saved._id ? saved : e) : [saved, ...prev]);
      setView("list");
    } catch (err) {
      alert("Error saving entry");
      console.log(err)
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Confirm deletion?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setEntries(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(e => 
      (activeTab === 'Dashboard' ? true : e.category === activeTab) &&
      (e.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [entries, activeTab, searchTerm]);

  // 3. UI RENDERERS
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#08090b]">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-black text-xs tracking-[0.3em] uppercase">Initializing Archive</p>
       </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#08090b] text-slate-200 selection:bg-indigo-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#050505] border-r border-white/5 flex flex-col h-screen sticky top-0 p-6 z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Zap size={20} fill="white" className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">Muse Admin</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveTab(cat); setView('list'); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === cat ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              {cat === 'Dashboard' ? <LayoutGrid size={18} /> : 
               cat === 'Poems' ? <PenTool size={18} /> : 
               cat === 'Stories' ? <Book size={18} /> : 
               cat === 'Media' ? <Film size={18} /> : <Library size={18} />}
              <span className="font-bold text-sm">{cat}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col bg-[#0c0e12] relative overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 px-8 border-b border-white/5 flex items-center justify-between bg-[#0c0e12]/80 backdrop-blur-xl z-40 sticky top-0">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input 
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 ring-indigo-500/50 outline-none" 
              placeholder="Search archive..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleCreateNew} className="bg-white text-black px-6 py-2 rounded-xl font-black text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
            <Plus size={16} strokeWidth={3} /> NEW ENTRY
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {view === 'list' ? (
            /* LIST VIEW */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="mb-10 flex items-end justify-between">
                <div>
                  <Badge variant="indigo">{activeTab}</Badge>
                  <h2 className="text-5xl font-serif font-black text-white mt-2 tracking-tighter italic">Content Library</h2>
                </div>
                <div className="flex gap-2 pb-2">
                   <div className="flex flex-col items-center px-4 border-r border-white/10">
                      <span className="text-[10px] font-black text-slate-500 uppercase">Total</span>
                      <span className="text-xl font-bold text-white">{filteredEntries.length}</span>
                   </div>
                </div>
              </div>

              <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Content</th>
                      <th className="px-8 py-5">Author</th>
                      <th className="px-8 py-5">Flags</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {filteredEntries.map(entry => (
                      <tr key={entry._id} onClick={() => handleEdit(entry)} className="hover:bg-white/[0.01] transition-all cursor-pointer group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            {entry.isLocked && <Lock size={14} className="text-amber-500" />}
                            <div className="text-white font-serif text-xl font-bold group-hover:text-indigo-400">{entry.title || 'Untitled'}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-slate-400 font-medium">{entry.author}</td>
                        <td className="px-8 py-6">
                           <div className="flex gap-2">
                             {entry.isGsn && <Badge variant="indigo">GSN</Badge>}
                             {entry.category === 'Media' && <Badge variant="default">{entry.mediaType}</Badge>}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <Badge variant={entry.status === 'Published' ? 'success' : 'warning'}>{entry.status}</Badge>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={(e) => handleDelete(entry._id, e)} className="p-2 text-slate-600 hover:text-rose-400 transition-colors"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ADVANCED EDITOR VIEW */
            <div className="h-full flex flex-col animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                 <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest">
                   <ChevronLeft size={18}/> Back to Archive
                 </button>
                 <div className="flex items-center gap-3">
                    <button onClick={() => setIsPreviewOpen(!isPreviewOpen)} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${isPreviewOpen ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'}`}>
                      {isPreviewOpen ? 'Exit Preview' : 'Live Preview'}
                    </button>
                    <button onClick={handleSave} className="px-8 py-2 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 shadow-lg flex items-center gap-2">
                      <Save size={16} /> Save Changes
                    </button>
                 </div>
              </div>

              <div className="flex gap-8 h-full overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative">
                  {/* LOCK OVERLAY */}
                  {formData.isLocked && (
                    <div className="absolute inset-0 z-10 bg-[#0c0e12]/40 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-white/10">
                        <Lock size={48} className="text-amber-500/50 mb-4" />
                        <p className="text-amber-500 font-black text-xs uppercase tracking-widest">Entry is Locked</p>
                        <p className="text-slate-500 text-[10px] mt-1">Unlock in settings to enable editing</p>
                    </div>
                  )}

                  <input 
                    disabled={formData.isLocked}
                    className="w-full bg-transparent text-6xl font-serif font-black text-white outline-none mb-8 placeholder:text-white/5"
                    placeholder="Entry Title..."
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />

                  {formData.category === 'Media' ? (
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        {['image', 'video', 'audio'].map(m => (
                          <button key={m} onClick={() => !formData.isLocked && setFormData({...formData, mediaType: m})} className={`flex-1 py-4 rounded-xl border transition-all ${formData.mediaType === m ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-white/5 text-slate-500'}`}>
                             <span className="text-[10px] font-black uppercase tracking-widest">{m}</span>
                          </button>
                        ))}
                      </div>
                      <input 
                        disabled={formData.isLocked}
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs font-mono text-indigo-400 outline-none" 
                        placeholder="Asset URL (HTTPS)" 
                        value={formData.mediaUrl} 
                        onChange={e => setFormData({...formData, mediaUrl: e.target.value})} 
                      />
                    </div>
                  ) : (
                    <Editor 
                      content={formData.content} 
                      setContent={(html) => !formData.isLocked && setFormData({ ...formData, content: html })} 
                    />
                  )}
                </div>

                {/* ADVANCED SETTINGS SIDEBAR */}
                <div className="w-72 space-y-6">
                  <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-5 space-y-6">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Settings2 size={12}/> Document Settings
                      </h3>
                      
                      <div className="space-y-3">
                        {/* THE TWO REQUESTED TOGGLES */}
                        <CustomToggle 
                          label="Lock Content" 
                          isActive={formData.isLocked} 
                          icon={formData.isLocked ? Lock : Unlock}
                          activeColor="bg-amber-600"
                          onClick={() => setFormData({...formData, isLocked: !formData.isLocked})}
                        />
                        <CustomToggle 
                          label="Is GSN" 
                          isActive={formData.isGsn} 
                          icon={formData.isGsn ? ShieldCheck : ShieldAlert}
                          activeColor="bg-indigo-600"
                          onClick={() => setFormData({...formData, isGsn: !formData.isGsn})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-white/5 pt-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-600 uppercase mb-2 block tracking-widest">Author</label>
                        <input disabled={formData.isLocked} className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-600 uppercase mb-2 block tracking-widest">Status</label>
                        <select disabled={formData.isLocked} className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-indigo-400 outline-none appearance-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                          <option>Draft</option>
                          <option>Published</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-600 uppercase mb-3 block tracking-widest">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-slate-400 flex items-center gap-1">
                            #{tag} <X size={10} className="cursor-pointer hover:text-white" onClick={() => !formData.isLocked && setFormData({...formData, tags: formData.tags.filter(t => t !== tag)})} />
                          </span>
                        ))}
                      </div>
                      <input 
                        disabled={formData.isLocked}
                        placeholder="Add tag..." 
                        className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs outline-none"
                        onKeyDown={e => {
                          if(e.key === 'Enter' && e.target.value.trim()){
                            setFormData({...formData, tags: [...formData.tags, e.target.value.trim().toLowerCase()]});
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl p-20 overflow-y-auto">
          <button onClick={() => setIsPreviewOpen(false)} className="fixed top-10 right-10 text-white hover:rotate-90 transition-all">
            <X size={40} />
          </button>
          <div className="max-w-2xl mx-auto bg-white text-black p-20 rounded-[3rem]">
            {formData.category === 'Media' && formData.mediaUrl && <img src={formData.mediaUrl} className="w-full rounded-2xl mb-10" />}
            <h1 className="text-6xl font-serif font-black mb-4">{formData.title || "Untitled"}</h1>
            <p className="italic text-slate-400 mb-10">by {formData.author || "Anonymous"}</p>
            <div className="prose prose-lg prose-slate" dangerouslySetInnerHTML={{ __html: formData.content }} />
          </div>
        </div>
      )}
    </div>
  );
}