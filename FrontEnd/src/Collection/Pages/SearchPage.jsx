import React, {
  useEffect,
  useRef,
  useState,
  useDeferredValue,
  useMemo,
} from "react";
import {
  Search,
  ArrowUpRight,
  Clock,
  X,
  Command,
  CornerDownLeft,
  Loader2,
  BookOpen,
  Feather,
  Image as ImageIcon,
  Quote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- CONFIG ---------------- */
// NOTE: Ensure your backend is running, or this will return fetch errors.
const API = "http://localhost:3000" || import.meta.env.VITE_API_URL ; 
const RECENT_KEY = "premium-search-recent";

const CATEGORY_META = {
  poems: { icon: Feather, color: "text-pink-400" },
  stories: { icon: BookOpen, color: "text-indigo-400" },
  media: { icon: ImageIcon, color: "text-emerald-400" },
  lines: { icon: Quote, color: "text-amber-400" },
  // Fallback for recent items
  history: { icon: Clock, color: "text-gray-400" }, 
};

/* ---------------- UTILS ---------------- */
const saveRecent = (term) => {
  if (!term || !term.trim()) return [];
  const existing = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  // Remove duplicates and keep top 5
  const updated = [term, ...existing.filter((t) => t !== term)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  return updated;
};

/* ---------------- UI HELPERS ---------------- */
const HighlightedText = ({ text, indices = [] }) => {
  if (!indices || !indices.length) return <span>{text}</span>;

  const chunks = [];
  let last = 0;

  indices.forEach(([start, end], i) => {
    // Text before match
    if (start > last) {
      chunks.push(<span key={`${i}-pre`}>{text.slice(last, start)}</span>);
    }
    // Match
    chunks.push(
      <span key={`${i}-match`} className="font-medium text-blue-400">
        {text.slice(start, end + 1)}
      </span>
    );
    last = end + 1;
  });

  // Text after last match
  if (last < text.length) {
    chunks.push(<span key="last">{text.slice(last)}</span>);
  }
  return <span>{chunks}</span>;
};

const Kbd = ({ children }) => (
  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-white/15 bg-white/5 text-[10px] font-medium text-white/40 font-mono">
    {children}
  </kbd>
);

/* ---------------- MAIN COMPONENT ---------------- */
export default function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load Recent Searches on mount
  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  // Keyboard Shortcuts (Cmd+K, Esc)
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setShowDropdown(true);
      }
      if (e.key === "Escape") {
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Search Data Fetching
  useEffect(() => {
    if (deferredQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      setShowDropdown(true);
      try {
        const res = await fetch(`${API}/api/search?q=${encodeURIComponent(deferredQuery)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        setResults(data);
        setActiveIndex(0);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setResults([]); 
        }
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(run, 200); // 200ms debounce
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [deferredQuery]);

  // Handle Input Focus
  const handleFocus = () => {
    setShowDropdown(true);
    setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
  };

  // Selection Logic
  const handleSelect = (item, isRecent = false) => {
    if (isRecent) {
      setQuery(item); // If it's a history item, fill the search
      return;
    }

    saveRecent(deferredQuery); // Save current query to history
    setShowDropdown(false);
    
    // Navigate based on item data
    if (item?.category && item?.id) {
      navigate(`/${item.category.toLowerCase()}/view/${item.id}`);
    }
  };

  // Keyboard Navigation
  const handleKeyDown = (e) => {
    const listLength = query.trim().length < 2 ? recent.length : results.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % listLength);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + listLength) % listLength);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim().length < 2) {
        // Selecting a recent item
        if (recent[activeIndex]) handleSelect(recent[activeIndex], true);
      } else {
        // Selecting a result
        if (results[activeIndex]) handleSelect(results[activeIndex]);
      }
    }
  };

  // Grouping Results
  const groupedResults = useMemo(() => {
    if (!results) return {};
    return results.reduce((acc, item) => {
      const cat = item.category || "General";
      acc[cat] ||= [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [results]);

  return (
    <div className="w-full min-h-screen  text-zinc-100 font-sans p-6">
      <div className="max-w-2xl mx-auto relative">
        
        {/* --- SEARCH BAR --- */}
        <div className="relative z-50">
          <div className="flex items-center border border-white/10 rounded-xl bg-zinc-900/50 backdrop-blur-md focus-within:border-blue-500/40 focus-within:bg-zinc-900 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300">
            <div className="pl-4 text-white/40">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder="Search poems, stories, media…"
              className="w-full h-12 bg-transparent outline-none px-4 text-sm placeholder:text-white/30 text-white"
            />

            <div className="flex items-center gap-2 pr-4">
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-full hover:bg-white/10 text-white/40 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <Kbd>
                <Command size={10} /> K
              </Kbd>
            </div>
          </div>
        </div>

        {/* --- DROPDOWN RESULTS --- */}
        <AnimatePresence>
          {showDropdown && (query.length >= 2 || recent.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden z-40"
            >
              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                
                {/* 1. LOADING SKELETON */}
                {loading && <SkeletonList />}

                {/* 2. SEARCH RESULTS */}
                {!loading && query.length >= 2 && results.length > 0 && (
                  <div className="py-2">
                    {Object.entries(groupedResults).map(([category, items]) => (
                      <div key={category} className="mb-2">
                        <div className="sticky top-0 z-10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30 bg-zinc-900/95 backdrop-blur">
                          {category}
                        </div>
                        <div className="px-2">
                          {items.map((item) => {
                             // Find global index for keyboard navigation
                             const globalIndex = results.indexOf(item);
                             return (
                               <SearchResultItem
                                 key={item.id}
                                 item={item}
                                 isActive={globalIndex === activeIndex}
                                 onClick={() => handleSelect(item)}
                                 onMouseEnter={() => setActiveIndex(globalIndex)}
                               />
                             );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. NO RESULTS */}
                {!loading && query.length >= 2 && results.length === 0 && (
                  <div className="py-12 text-center text-white/30">
                     <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                     <p className="text-sm">No results found for "{query}"</p>
                  </div>
                )}

                {/* 4. RECENT SEARCHES (When query is empty) */}
                {!loading && query.length < 2 && recent.length > 0 && (
                   <div className="py-2">
                     <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/30">
                       Recent Searches
                     </div>
                     <div className="px-2">
                       {recent.map((term, idx) => (
                         <div
                           key={term}
                           onClick={() => handleSelect(term, true)}
                           onMouseEnter={() => setActiveIndex(idx)}
                           className={`
                             flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                             ${idx === activeIndex ? "bg-white/10" : "hover:bg-white/5"}
                           `}
                         >
                           <Clock className="w-4 h-4 text-white/40" />
                           <span className="text-sm text-zinc-200 flex-1">{term}</span>
                           {idx === activeIndex && <CornerDownLeft className="w-3.5 h-3.5 text-white/30" />}
                         </div>
                       ))}
                     </div>
                   </div>
                )}

              </div>
              
              {/* Footer / Meta info */}
              <div className="border-t border-white/5 bg-white/[0.02] px-4 py-2 flex items-center justify-between text-[10px] text-white/30">
                 <span>Navigate with arrows</span>
                 <span>Enter to select</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- SUB-COMPONENTS ---------------- */

function SearchResultItem({ item, isActive, onClick, onMouseEnter }) {
  // Safe access to category meta
  const meta = CATEGORY_META[item.category?.toLowerCase()] || CATEGORY_META.lines;
  const Icon = meta.icon;
  const titleMatch = item.matches?.find((m) => m.key === "title");

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`
        group relative flex items-center gap-3
        rounded-lg px-3 py-2.5
        cursor-pointer transition-all duration-200
        ${isActive ? "bg-white/10" : "hover:bg-white/5"}
      `}
    >
      {/* Icon Box */}
      <div
        className={`
          flex-shrink-0 w-8 h-8 rounded-lg
          flex items-center justify-center
          bg-white/5 ring-1 ring-white/5
          ${meta.color}
        `}
      >
        <Icon size={16} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="text-sm text-zinc-200 truncate font-medium">
          <HighlightedText text={item.title} indices={titleMatch?.indices} />
        </div>
        <div className="text-[11px] text-zinc-500 truncate capitalize">
          {item.category} • {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Action Indicator */}
      <div className={`flex-shrink-0 text-white/40 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}>
         <CornerDownLeft size={14} />
      </div>
    </div>
  );
}

/* ---------------- SKELETONS ---------------- */
const ResultSkeleton = () => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
    <div className="space-y-2 flex-1">
      <div className="h-3 w-1/3 bg-white/10 rounded animate-pulse" />
      <div className="h-2 w-1/5 bg-white/5 rounded animate-pulse" />
    </div>
  </div>
);

const SkeletonList = () => (
  <div className="py-2">
    {[...Array(3)].map((_, i) => (
      <ResultSkeleton key={i} />
    ))}
  </div>
);