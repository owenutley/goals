import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Search, Download, Calendar, ArrowRight, Save, X } from 'lucide-react';
import type { JournalEntry } from '../types';

interface JournalSectionProps {
  entries: JournalEntry[];
  setEntries: (entries: JournalEntry[]) => void;
}

export default function JournalSection({ entries, setEntries }: JournalSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  const addEntry = () => {
    if (newEntry.title.trim() || newEntry.content.trim()) {
      const entry: JournalEntry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        title: newEntry.title || 'Untitled Entry',
        content: newEntry.content
      };
      setEntries([entry, ...entries]);
      setNewEntry({ title: '', content: '' });
      setIsAdding(false);
    }
  };

  const removeEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEntries(entries.filter(en => en.id !== id));
  };

  const exportEntries = (format: 'json' | 'txt') => {
    const data = format === 'json' 
      ? JSON.stringify(entries, null, 2)
      : entries.map(e => `--- ${new Date(e.date).toLocaleDateString()}: ${e.title} ---\n\n${e.content}\n\n`).join('\n');
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-journal-export-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEntries = entries.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-natural-sage" size={18} />
          <input 
            type="text" 
            placeholder="Search your library of thoughts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-natural-soft dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-1 focus:ring-natural-olive outline-none transition-all shadow-sm italic font-serif"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex bg-natural-soft dark:bg-zinc-800 p-1 rounded-2xl">
            <button onClick={() => exportEntries('txt')} className="p-3 text-natural-olive hover:bg-white dark:hover:bg-zinc-700 rounded-xl transition-all" title="Export TXT">
              <Download size={20} />
            </button>
            <button onClick={() => exportEntries('json')} className="p-3 text-natural-olive hover:bg-white dark:hover:bg-zinc-700 rounded-xl transition-all font-mono text-[10px] font-bold" title="Export JSON">
              JS
            </button>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-natural-tan text-white rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-md"
          >
            <Plus size={18} />
            New Entry
          </button>
        </div>
      </div>

      {/* Grid of Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredEntries.map(entry => (
            <motion.div
              layout
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setViewingEntry(entry)}
              className="group cursor-pointer bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-natural-soft dark:border-zinc-800 hover:border-natural-beige transition-all shadow-sm flex flex-col h-[300px]"
            >
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-natural-tan italic">
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                    <h3 className="text-xl font-serif text-natural-olive leading-tight line-clamp-1">{entry.title}</h3>
                  </div>
                  <button 
                    onClick={(e) => removeEntry(entry.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-natural-pale hover:text-red-400 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex-1 relative">
                  <p className="text-natural-sage text-sm line-clamp-6 leading-relaxed italic font-serif">
                    {entry.content}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent" />
                </div>
              </div>
              <div className="flex items-center gap-3 text-natural-tan font-bold text-[9px] uppercase tracking-[0.3em] mt-6 group-hover:gap-4 transition-all pb-1 border-b border-transparent group-hover:border-natural-beige w-fit">
                Revisit <ArrowRight size={12} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-natural-olive/20 backdrop-blur-sm"
              onClick={() => setIsAdding(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-natural-bg dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-natural-beige dark:border-zinc-800"
            >
              <div className="p-10 space-y-8 h-[80vh] flex flex-col">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-serif text-natural-olive font-semibold">New Reflection</h2>
                  <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-natural-soft dark:hover:bg-zinc-900 rounded-full transition-colors font-medium">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 flex flex-col space-y-6 overflow-y-auto custom-scrollbar pr-2">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-natural-sage ml-1">Title your moment</label>
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Give this reflection a name..."
                      value={newEntry.title}
                      onChange={e => setNewEntry({...newEntry, title: e.target.value})}
                      className="w-full text-2xl font-serif font-bold bg-transparent border-none outline-none placeholder-natural-beige text-natural-olive"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-natural-sage ml-1">The substance</label>
                    <textarea 
                      placeholder="Let your thoughts flow onto the page..."
                      value={newEntry.content}
                      onChange={e => setNewEntry({...newEntry, content: e.target.value})}
                      className="w-full h-full bg-transparent border-none outline-none resize-none text-lg leading-relaxed placeholder-natural-beige font-serif italic text-natural-olive pr-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-6 border-t border-natural-beige dark:border-zinc-800">
                  <button 
                    onClick={addEntry}
                    className="flex items-center gap-3 px-10 py-4 bg-natural-olive text-white rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-natural-olive/10"
                  >
                    <Save size={18} />
                    Commit to Ledger
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewingEntry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-natural-olive/20 backdrop-blur-sm"
              onClick={() => setViewingEntry(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl overflow-hidden border border-natural-beige dark:border-zinc-800"
            >
              <div className="p-12 space-y-8 h-[80vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-natural-tan italic">
                       {new Date(viewingEntry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h2 className="text-4xl font-serif font-black text-natural-olive leading-tight">{viewingEntry.title}</h2>
                  </div>
                  <button onClick={() => setViewingEntry(null)} className="p-3 hover:bg-natural-soft dark:hover:bg-zinc-900 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <div className="w-16 h-1.5 bg-natural-lime rounded-full" />
                <p className="text-xl leading-relaxed text-natural-ink dark:text-zinc-300 font-serif italic whitespace-pre-wrap">
                  {viewingEntry.content}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
