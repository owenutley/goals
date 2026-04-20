import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  BookOpen, 
  PenLine, 
  Settings, 
  LayoutDashboard,
  Moon,
  Sun,
  Plus,
  CloudUpload,
  CloudCheck
} from 'lucide-react';
import GoalsSection from './components/GoalsSection';
import ReadingListSection from './components/ReadingListSection';
import JournalSection from './components/JournalSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Goal, Book, JournalEntry, Category, Timeframe } from './types';

type Tab = 'dashboard' | 'reading' | 'journal' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('dark-mode', false);
  const hasLoaded = React.useRef(false);

  // States
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [books, setBooks] = useLocalStorage<Book[]>('books', []);
  const [journalEntries, setJournalEntries] = useLocalStorage<JournalEntry[]>('journal', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', [
    { name: 'Personal', color: '#6B705C' },
    { name: 'Work', color: '#D4A373' },
    { name: 'Health', color: '#A5A58D' },
  ]);
  const [timeframes, setTimeframes] = useLocalStorage<Timeframe[]>('timeframes', [
    { name: 'Immediate', color: '#D4A373' },
    { name: 'This Month', color: '#A5A58D' },
    { name: 'Future', color: '#B7B7A4' },
  ]);

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'saved' | 'error'>('idle');

  // Load from ledger.json on startup if available
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/data');
        if (response.ok) {
          const data = await response.json();
          if (data.goals) setGoals(data.goals);
          if (data.books) setBooks(data.books);
          if (data.journalEntries) setJournalEntries(data.journalEntries);
          if (data.categories) setCategories(data.categories);
          if (data.timeframes) setTimeframes(data.timeframes);
          setSyncStatus('saved');
        }
      } catch (err) {
        console.log('Local server not detected, using browser storage only.');
      } finally {
        hasLoaded.current = true;
      }
    }
    loadData();
  }, []);

  // Save to ledger.json whenever data changes (and we are on local server)
  useEffect(() => {
    if (!hasLoaded.current) return;

    const dataToSync = { goals, books, journalEntries, categories, timeframes };
    
    // Debounce save to avoid too many file writes
    const timer = setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        const response = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSync)
        });
        if (response.ok) {
          setSyncStatus('saved');
        }
      } catch (err) {
        setSyncStatus('idle'); // Just fail silently if no server
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [goals, books, journalEntries, categories, timeframes]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? 'dark bg-zinc-950 text-white' : 'bg-natural-bg text-natural-ink'}`}>
      {/* Sidebar / Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:left-0 lg:top-0 lg:bottom-0 lg:w-64 lg:flex-col lg:border-r border-natural-soft dark:border-zinc-800 bg-white dark:bg-zinc-900 lg:justify-between lg:p-8">
        <div className="flex justify-around items-center lg:block">
          <div className="hidden lg:block mb-10">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-serif italic text-natural-olive font-semibold tracking-tight">Life Ledger</h1>
              <div className="flex items-center gap-2">
                {syncStatus === 'syncing' && <CloudUpload size={14} className="animate-pulse text-natural-tan" />}
                {syncStatus === 'saved' && <CloudCheck size={14} className="text-natural-lime" />}
              </div>
            </div>
            <p className="text-[10px] text-natural-sage uppercase tracking-widest mt-1">Personal Compass</p>
          </div>

          <div className="flex justify-around items-center w-full lg:flex-col lg:items-start lg:gap-4">
            <NavButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={<LayoutDashboard size={24} />} 
              label="Dashboard"
            />
            <NavButton 
              active={activeTab === 'reading'} 
              onClick={() => setActiveTab('reading')} 
              icon={<BookOpen size={24} />} 
              label="Reading List"
            />
            <NavButton 
              active={activeTab === 'journal'} 
              onClick={() => setActiveTab('journal')} 
              icon={<PenLine size={24} />} 
              label="Daily Journal"
            />
            <NavButton 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
              icon={<Settings size={24} />} 
              label="Settings"
            />
          </div>
        </div>
        
        <div className="hidden lg:block space-y-6">
          <div className="bg-natural-soft dark:bg-zinc-800 p-6 rounded-3xl">
            <p className="text-[10px] uppercase tracking-widest text-natural-sage mb-3 font-bold">Quick Actions</p>
            <button 
              onClick={toggleDarkMode}
              className="w-full text-left py-2 px-3 mb-2 rounded-xl bg-white dark:bg-zinc-950 border border-natural-beige dark:border-zinc-700 text-[10px] font-bold text-natural-olive hover:bg-natural-peach transition-colors uppercase tracking-tight flex items-center gap-2"
            >
              {isDarkMode ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-24 lg:pb-8 lg:pl-72 p-6 max-w-7xl mx-auto min-h-screen">
        <header className="mb-12">
          <h2 className="text-3xl font-serif text-natural-olive">
            {activeTab === 'dashboard' && "Next Steps"}
            {activeTab === 'reading' && "Library"}
            {activeTab === 'journal' && "Daily reflection"}
            {activeTab === 'settings' && "Preferences"}
          </h2>
          <p className="text-sm text-natural-sage">
            {activeTab === 'dashboard' && "Focusing on today."}
            {activeTab === 'reading' && "Expanding the horizon of thought."}
            {activeTab === 'journal' && "Capturing the essence of the moment."}
            {activeTab === 'settings' && "Calibrating your personal compass."}
          </p>
        </header>

        <div className="relative overflow-hidden min-h-[70vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab === 'dashboard' && (
                <GoalsSection 
                  goals={goals} 
                  setGoals={setGoals} 
                  categories={categories} 
                  timeframes={timeframes}
                />
              )}
              {activeTab === 'reading' && (
                <ReadingListSection 
                  books={books} 
                  setBooks={setBooks} 
                />
              )}
              {activeTab === 'journal' && (
                <JournalSection 
                  entries={journalEntries} 
                  setEntries={setJournalEntries} 
                />
              )}
              {activeTab === 'settings' && (
                <SettingsTab 
                  categories={categories}
                  setCategories={setCategories}
                  timeframes={timeframes}
                  setTimeframes={setTimeframes}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative group flex items-center gap-3 w-full transition-all duration-200 py-3 lg:px-2 ${active ? 'text-natural-olive' : 'text-natural-sage hover:text-natural-olive'}`}
    >
      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${active ? 'bg-natural-pale' : 'bg-transparent border border-natural-sage'}`} />
      <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-active"
          className="absolute right-0 w-1 h-6 rounded-full bg-natural-olive hidden lg:block"
        />
      )}
    </button>
  );
}

function SettingsTab({ categories, setCategories, timeframes, setTimeframes }: { 
  categories: Category[], 
  setCategories: (c: Category[]) => void,
  timeframes: Timeframe[],
  setTimeframes: (t: Timeframe[]) => void
}) {
  const [newCat, setNewCat] = useState({ name: '', color: '#6B705C' });
  const [newTf, setNewTf] = useState({ name: '', color: '#6B705C' });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-10 border border-natural-soft dark:border-zinc-800 shadow-sm">
        <h2 className="text-xl font-serif text-natural-olive italic font-semibold mb-8 flex items-center gap-4">
          <div className="w-1 h-6 bg-natural-sage rounded-full" />
          Taxonomy of Life
        </h2>
        
        <div className="space-y-10">
          {/* Category Management */}
          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-natural-sage border-b border-natural-soft pb-2">Categories (Visual Tone)</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                value={newCat.name}
                onChange={e => setNewCat({...newCat, name: e.target.value})}
                placeholder="Category Name"
                className="flex-1 bg-natural-soft dark:bg-zinc-950 border border-natural-beige dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-natural-olive outline-none transition-all"
              />
              <div className="flex gap-4">
                <input 
                  type="color" 
                  value={newCat.color}
                  onChange={e => setNewCat({...newCat, color: e.target.value})}
                  className="w-14 h-14 p-1 bg-white dark:bg-zinc-950 rounded-xl border border-natural-soft dark:border-zinc-800 cursor-pointer"
                />
                <button 
                  onClick={() => {
                    if(newCat.name.trim()) {
                      setCategories([...categories, newCat]);
                      setNewCat({ name: '', color: '#6B705C' });
                    }
                  }}
                  className="bg-natural-olive text-white px-8 rounded-xl hover:opacity-90 transition-all font-bold text-xs uppercase tracking-widest active:scale-95"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <div key={cat.name} className="group flex items-center gap-3 px-4 py-2 rounded-full border transition-all" style={{ backgroundColor: `${cat.color}10`, color: cat.color, borderColor: `${cat.color}30` }}>
                  <span className="font-bold text-[10px] uppercase tracking-widest">{cat.name}</span>
                  <button 
                    onClick={() => setCategories(categories.filter(c => c.name !== cat.name))}
                    className="opacity-40 group-hover:opacity-100 hover:text-red-400 transition-all text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Timeframe Management */}
          <div className="space-y-6">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-natural-sage border-b border-natural-soft pb-2">Timeframes (Priority Rhythm)</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                value={newTf.name}
                onChange={e => setNewTf({...newTf, name: e.target.value})}
                placeholder="Timeframe Name"
                className="flex-1 bg-natural-soft dark:bg-zinc-950 border border-natural-beige dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-natural-olive outline-none transition-all"
              />
              <div className="flex gap-4">
                <input 
                  type="color" 
                  value={newTf.color}
                  onChange={e => setNewTf({...newTf, color: e.target.value})}
                  className="w-14 h-14 p-1 bg-white dark:bg-zinc-950 rounded-xl border border-natural-soft dark:border-zinc-800 cursor-pointer"
                />
                <button 
                  onClick={() => {
                    if(newTf.name.trim()) {
                      setTimeframes([...timeframes, newTf]);
                      setNewTf({ name: '', color: '#D4A373' });
                    }
                  }}
                  className="bg-natural-tan text-white px-8 rounded-xl hover:opacity-90 transition-all font-bold text-xs uppercase tracking-widest active:scale-95"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {timeframes.map(tf => (
                <div key={tf.name} className="group flex items-center gap-3 px-4 py-2 rounded-full border transition-all" style={{ backgroundColor: `${tf.color}10`, color: tf.color, borderColor: `${tf.color}30` }}>
                  <span className="font-bold text-[10px] uppercase tracking-widest">{tf.name}</span>
                  <button 
                    onClick={() => setTimeframes(timeframes.filter(t => t.name !== tf.name))}
                    className="opacity-40 group-hover:opacity-100 hover:text-red-400 transition-all text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
