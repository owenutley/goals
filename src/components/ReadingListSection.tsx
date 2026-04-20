import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, BookOpen, CheckCircle, Search, Star } from 'lucide-react';
import type { Book } from '../types';

interface ReadingListSectionProps {
  books: Book[];
  setBooks: (books: Book[]) => void;
}

export default function ReadingListSection({ books, setBooks }: ReadingListSectionProps) {
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [filter, setFilter] = useState<'all' | 'to-read' | 'reading' | 'completed'>('all');

  const addBook = () => {
    if (newBook.title.trim()) {
      const book: Book = {
        id: Math.random().toString(36).substr(2, 9),
        title: newBook.title,
        author: newBook.author || 'Unknown Author',
        status: 'to-read',
        progress: 0
      };
      setBooks([book, ...books]);
      setNewBook({ title: '', author: '' });
    }
  };

  const updateStatus = (id: string, status: Book['status']) => {
    setBooks(books.map(b => b.id === id ? { ...b, status, progress: status === 'completed' ? 100 : b.progress } : b));
  };

  const updateProgress = (id: string, progress: number) => {
    setBooks(books.map(b => b.id === id ? { ...b, progress } : b));
  };

  const removeBook = (id: string) => {
    setBooks(books.filter(b => b.id !== id));
  };

  const currentBook = books.find(b => b.status === 'reading');
  const filteredBooks = books.filter(b => filter === 'all' || b.status === filter);

  return (
    <div className="grid grid-cols-12 gap-8 max-w-6xl mx-auto">
      {/* Featured Header */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        {currentBook ? (
          <div className="bg-natural-olive p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col sm:flex-row items-center gap-8 border border-white/10">
            <div className="w-32 h-48 bg-natural-sage rounded-xl shadow-inner flex-shrink-0 flex items-center justify-center border border-white/20 p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
               <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-center italic drop-shadow-sm">{currentBook.title}</span>
            </div>
            <div className="flex-1 space-y-6 text-center sm:text-left">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2 font-bold">Currently Immersed In</p>
                <h4 className="text-2xl font-serif italic mb-1">{currentBook.title}</h4>
                <p className="text-white/60 font-medium">{currentBook.author}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Progress</span>
                  <span>{currentBook.progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentBook.progress}%` }}
                    className="h-full bg-natural-lime"
                  />
                </div>
                <input 
                  type="range" 
                  value={currentBook.progress}
                  onChange={e => updateProgress(currentBook.id, parseInt(e.target.value))}
                  className="w-full h-1 opacity-0 absolute cursor-pointer"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 p-12 rounded-[2.5rem] border border-dashed border-zinc-800 flex flex-col items-center justify-center text-center">
            <BookOpen size={40} className="text-zinc-700 mb-4" />
            <h3 className="font-serif italic text-xl text-natural-sage">Select a volume to begin.</h3>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-2xl text-natural-olive">Personal Library</h2>
            <div className="flex-1 h-[1px] bg-zinc-800" />
            <div className="flex gap-2 p-1 bg-zinc-800 rounded-xl">
              {['all', 'reading', 'to-read', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-zinc-700 shadow-sm text-natural-olive' : 'text-natural-sage'}`}
                >
                  {f === 'to-read' ? 'Pending' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredBooks.map(book => (
                <motion.div
                  layout
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
                >
                  <div className={`w-12 h-20 rounded-lg flex-shrink-0 flex items-center justify-center border ${
                    book.status === 'completed' ? 'bg-natural-lime/20 border-natural-lime text-natural-olive' : 'bg-zinc-800 border-zinc-700 text-natural-sage'
                  }`}>
                    <Search size={14} className="opacity-20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{book.title}</h3>
                    <p className="text-natural-sage text-[10px] mb-3">{book.author}</p>
                    <div className="flex gap-2">
                       {book.status === 'to-read' && (
                        <button onClick={() => updateStatus(book.id, 'reading')} className="text-[9px] font-bold uppercase py-1 px-3 bg-natural-tan text-white rounded-md">Start</button>
                      )}
                      {book.status !== 'completed' && (
                        <button onClick={() => updateStatus(book.id, 'completed')} className="text-[9px] font-bold uppercase py-1 px-3 border border-natural-sage text-natural-sage rounded-md hover:bg-natural-sage hover:text-white transition-colors">Finish</button>
                      )}
                    </div>
                  </div>
                  <button onClick={() => removeBook(book.id)} className="opacity-0 group-hover:opacity-100 p-1 text-natural-pale hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add Tool Sidebar */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 shadow-sm">
          <h2 className="font-serif text-xl mb-6 text-natural-olive">Register Volume</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest font-bold text-natural-sage ml-2">Title</label>
              <input 
                type="text" 
                value={newBook.title}
                onChange={e => setNewBook({...newBook, title: e.target.value})}
                className="w-full bg-zinc-950 border-none rounded-2xl px-5 py-3 text-sm focus:ring-1 focus:ring-natural-tan outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest font-bold text-natural-sage ml-2">Author</label>
              <input 
                type="text" 
                value={newBook.author}
                onChange={e => setNewBook({...newBook, author: e.target.value})}
                className="w-full bg-zinc-950 border-none rounded-2xl px-5 py-3 text-sm focus:ring-1 focus:ring-natural-tan outline-none"
              />
            </div>
            <button 
              onClick={addBook}
              className="w-full bg-natural-olive text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:opacity-90 active:scale-95 transition-all mt-4"
            >
              Add to Collection
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/40 p-8 rounded-[2.5rem] border border-zinc-800">
           <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-natural-tan mb-2 text-center underline decoration-2 underline-offset-4">Library Stats</p>
           <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-serif italic text-natural-olive">{books.filter(b => b.status === 'completed').length}</p>
                <p className="text-[8px] uppercase tracking-widest font-bold text-natural-sage">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif italic text-natural-olive">{books.length}</p>
                <p className="text-[8px] uppercase tracking-widest font-bold text-natural-sage">Volumes</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: number, color: 'blue' | 'green' | 'amber' }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  };
  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} text-center`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}
