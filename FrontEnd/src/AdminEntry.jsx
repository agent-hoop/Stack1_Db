import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, PenTool, Book, Film, Library, Settings, 
  Plus, Search, Eye, Save, ChevronLeft, Trash2, 
  FileText, CheckCircle, Clock, BarChart3, X,
  Image as ImageIcon, Video, Music, Link as LinkIcon,
  Globe, Zap, Type, Hash, Bell, Calendar, MoreVertical
} from 'lucide-react';

// --- CONSTANTS & DEFAULTS ---
const CATEGORIES = ['Dashboard', 'Poems', 'Stories', 'Media', 'Novels'];

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
  views: 0
};

// --- STYLED UI COMPONENTS ---

const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-slate-800 text-slate-400',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- MAIN APPLICATION ---

export default function AdminEntry() {
// 1. GLOBAL STATE (MongoDB is source of truth)
const [entries, setEntries] = useState([]);
const [loading, setLoading] = useState(true);

// API
const API = "http://localhost:3000/api/entries";

useEffect(() => {
  let ignore = false;

  async function getEntries() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (!ignore) setEntries(data);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
    } finally {
      if (!ignore) setLoading(false);
    }
  }

  getEntries();
  return () => (ignore = true);
}, []);

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    localStorage.setItem('muse_ultimate_v5', JSON.stringify(entries));
  }, [entries]);

  // 2. WORKFLOW HANDLERS
  
  // FIX: Clear form and set fresh template for NEW entry
  const handleCreateNew = () => {
    const freshEntry = {
      ...INITIAL_FORM_STATE,
      id: Date.now(), // Generate a unique ID immediately
      category: activeTab === 'Dashboard' ? 'Poems' : activeTab,
    };
    setFormData(freshEntry); 
    setIsPreviewOpen(false);
    setView('editor');
  };

  const handleEdit = (entry) => {
    setFormData({ ...entry }); // Spread to ensure fresh reference
    setIsPreviewOpen(false);
    setView('editor');
  };

  const handleSave = async () => {
  if (!formData.title.trim()) {
    alert("Title required. Even legends need names.");
    return;
  }

  const method = formData._id ? "PUT" : "POST";
  const url = formData._id ? `${API}/${formData._id}` : API;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const saved = await res.json();

  setEntries(prev =>
    formData._id
      ? prev.map(e => e._id === saved._id ? saved : e)
      : [saved, ...prev]
  );

  setView("list");
};

const handleDelete = async (id, e) => {
  e.stopPropagation();
  if (!confirm("This goes to the void. Forever.")) return;

  await fetch(`${API}/${id}`, { method: "DELETE" });
  setEntries(prev => prev.filter(e => e._id !== id));
};


  // 3. COMPUTED DATA
  const filteredEntries = useMemo(() => {
    return entries.filter(e => 
      (activeTab === 'Dashboard' ? true : e.category === activeTab) &&
      (e.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [entries, activeTab, searchTerm]);

  // --- RENDER SUB-COMPONENTS ---

  const Sidebar = () => (
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
              activeTab === cat ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            {cat === 'Dashboard' && <LayoutGrid size={18} />}
            {cat === 'Poems' && <PenTool size={18} />}
            {cat === 'Stories' && <Book size={18} />}
            {cat === 'Media' && <Film size={18} />}
            {cat === 'Novels' && <Library size={18} />}
            <span className="font-bold text-sm">{cat}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-800" />
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin Panel v5.0</div>
        </div>
      </div>
    </aside>
  );
  if (loading) {
  return <div className="p-10 text-slate-500">Loading archive…</div>;
}


  return (
    <div className="flex min-h-screen bg-[#08090b] text-slate-200 selection:bg-indigo-500/30">
      <Sidebar />

      <main className="flex-1 flex flex-col bg-[#0c0e12] relative overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-20 px-8 border-b border-white/5 flex items-center justify-between bg-[#0c0e12]/80 backdrop-blur-xl z-40 sticky top-0">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input 
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-1 ring-indigo-500/50 text-xs transition-all" 
              placeholder="Search archive..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-white transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            </button>
            <button onClick={handleCreateNew} className="bg-white text-black px-6 py-2 rounded-xl font-black text-xs tracking-widest flex items-center gap-2 hover:bg-indigo-50 transition-all">
              <Plus size={16} strokeWidth={3} /> NEW ENTRY
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          
          {view === 'list' ? (
            <div className="animate-in fade-in duration-700">
              <div className="mb-10">
                <Badge variant="indigo">{activeTab}</Badge>
                <h2 className="text-5xl font-serif font-black text-white mt-2 tracking-tighter italic">Content Library</h2>
              </div>

              {activeTab === 'Media' ? (
                /* MEDIA GRID VIEW */
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredEntries.map(entry => (
                    <div key={entry.id} onClick={() => handleEdit(entry)} className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden group cursor-pointer hover:border-indigo-500/50 transition-all">
                      <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                        {entry.mediaUrl ? (
                          <img src={entry.mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        ) : (
                          <ImageIcon size={32} className="text-slate-800" />
                        )}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => handleDelete(entry.id, e)} className="p-2 bg-rose-500 text-white rounded-lg shadow-xl"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="font-bold text-white truncate">{entry.title}</div>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="default">{entry.mediaType}</Badge>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{entry.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* STANDARD TABLE VIEW */
                <div className="bg-[#0f1117] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                      <tr>
                        <th className="px-8 py-5">Title</th>
                        <th className="px-8 py-5">Author</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                      {filteredEntries.map(entry => (
                        <tr key={entry.id} onClick={() => handleEdit(entry)} className="hover:bg-white/[0.01] transition-all cursor-pointer group">
                          <td className="px-8 py-6">
                            <div className="text-white font-serif text-xl font-bold group-hover:text-indigo-400 transition-colors">{entry.title || 'Untitled'}</div>
                          </td>
                          <td className="px-8 py-6 text-slate-400 font-medium">{entry.author || 'Anonymous'}</td>
                          <td className="px-8 py-6">
                             <Badge variant={entry.status === 'Published' ? 'success' : 'warning'}>{entry.status}</Badge>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button onClick={(e) => handleDelete(entry.id, e)} className="p-2 text-slate-600 hover:text-rose-400 transition-colors"><Trash2 size={18}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* ADVANCED SCHEMA EDITOR */
            <div className="h-full flex flex-col animate-in slide-in-from-bottom-5 duration-500">
              <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
                 <button onClick={() => setView('list')} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all font-bold text-xs tracking-widest uppercase">
                   <ChevronLeft size={20}/> Archive
                 </button>
                 <div className="flex gap-3">
                    <button onClick={() => setIsPreviewOpen(!isPreviewOpen)} className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase transition-all ${isPreviewOpen ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                      {isPreviewOpen ? 'Edit Mode' : 'Live Preview'}
                    </button>
                    <button onClick={handleSave} className="px-10 py-2.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">PUBLISH</button>
                 </div>
              </div>

              <div className="flex-1 flex gap-10 overflow-hidden">
                <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-700 ${isPreviewOpen ? 'w-1/2 border-r border-white/5 pr-10' : 'max-w-4xl mx-auto w-full'}`}>
                  
                  {/* Title & Meta */}
                  <input 
                    className="w-full bg-transparent text-6xl font-serif font-black text-white outline-none mb-10 placeholder:text-white/5 border-none focus:ring-0 p-0"
                    placeholder="Masterpiece Title..."
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />

                  <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                      <label className="text-[10px] font-black text-slate-600 uppercase mb-2 block tracking-widest">Author</label>
                      <input className="bg-transparent border-none focus:ring-0 p-0 text-white font-bold text-sm w-full outline-none" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="Pen Name" />
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                      <label className="text-[10px] font-black text-slate-600 uppercase mb-2 block tracking-widest">Status</label>
                      <select className="bg-transparent border-none focus:ring-0 p-0 text-indigo-400 font-bold text-sm w-full outline-none appearance-none cursor-pointer" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option>Draft</option>
                        <option>Published</option>
                      </select>
                    </div>
                  </div>

                  {/* Schema Selection: Media vs Text */}
                  {formData.category === 'Media' ? (
                    <div className="space-y-10 animate-in fade-in">
                       <div className="grid grid-cols-3 gap-4">
                          {['image', 'video', 'audio'].map(m => (
                            <button key={m} onClick={() => setFormData({...formData, mediaType: m})} className={`py-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${formData.mediaType === m ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'border-white/5 text-slate-600 hover:bg-white/5'}`}>
                              {m === 'image' && <ImageIcon size={24}/>}
                              {m === 'video' && <Video size={24}/>}
                              {m === 'audio' && <Music size={24}/>}
                              <span className="text-[10px] font-black uppercase tracking-widest">{m}</span>
                            </button>
                          ))}
                       </div>
                       <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset URL Source</label>
                          <div className="flex items-center gap-3 bg-black/40 rounded-xl px-4 py-3">
                            <LinkIcon size={16} className="text-indigo-500" />
                            <input className="bg-transparent flex-1 text-xs font-mono text-indigo-400 outline-none" placeholder="https://..." value={formData.mediaUrl} onChange={e => setFormData({...formData, mediaUrl: e.target.value})} />
                          </div>
                       </div>
                    </div>
                  ) : (
                    <textarea 
                      className="w-full flex-1 bg-transparent text-2xl font-serif text-slate-300 leading-relaxed outline-none resize-none whitespace-pre-wrap border-none focus:ring-0 p-0 mb-40 min-h-[600px]"
                      placeholder="Start writing..."    
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                    />
                  )}
                </div>

                {/* DYNAMIC PREVIEW CANVAS */}
                {isPreviewOpen && (
                  <div className="w-1/2 bg-[#faf9f6] h-full overflow-y-auto p-20 shadow-2xl rounded-tl-[3rem] animate-in slide-in-from-right-10 duration-700">
                    <div className="max-w-prose mx-auto">
                      {formData.category === 'Media' && formData.mediaUrl && (
                        <div className="mb-12 rounded-[2rem] overflow-hidden shadow-2xl border-[10px] border-white">
                           <img src={formData.mediaUrl} className="w-full object-cover" alt="Media Asset" />
                        </div>
                      )}
                      <h1 className="text-6xl font-serif font-black text-slate-900 mb-4 leading-none">{formData.title || "The Unwritten"}</h1>
                      <p className="text-slate-400 font-serif italic text-xl mb-16 border-l-4 border-indigo-100 pl-6">by {formData.author || "Anonymous"}</p>
                      
                      {formData.category !== 'Media' && (
                        <div className="font-serif text-2xl leading-[1.8] text-slate-800 whitespace-pre-wrap first-letter:text-8xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-slate-900">
                          {formData.content || "Every journey begins with a word."}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}