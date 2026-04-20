import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, Clock, Filter, ListFilter } from 'lucide-react';
import type { Goal, Category, Timeframe } from '../types';

interface GoalsSectionProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  categories: Category[];
  timeframes: Timeframe[];
}

export default function GoalsSection({ goals, setGoals, categories, timeframes }: GoalsSectionProps) {
  const [newGoalText, setNewGoalText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [groupBy, setGroupBy] = useState<'category' | 'timeframe'>('timeframe');

  const addGoal = () => {
    if (newGoalText.trim()) {
      const newGoal: Goal = {
        id: Math.random().toString(36).substr(2, 9),
        text: newGoalText,
        category: selectedCategory || null,
        timeframe: selectedTimeframe || null,
        dueDate: dueDate || null,
        completed: false,
        priority: 'medium'
      };
      setGoals([newGoal, ...goals]);
      setNewGoalText('');
      setDueDate('');
    }
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const completedCount = goals.filter(g => g.completed).length;
  const progress = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

  const groups = groupBy === 'category' ? categories : timeframes;
  const groupKey = groupBy === 'category' ? 'category' : 'timeframe';

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* List Area */}
      <div className="col-span-12 lg:col-span-7 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
          <div className="flex bg-natural-soft dark:bg-zinc-800 p-1 rounded-xl">
            <button 
              onClick={() => setGroupBy('timeframe')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${groupBy === 'timeframe' ? 'bg-white dark:bg-zinc-700 shadow-sm text-natural-olive' : 'text-natural-sage'}`}
            >
              Timeframe
            </button>
            <button 
              onClick={() => setGroupBy('category')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${groupBy === 'category' ? 'bg-white dark:bg-zinc-700 shadow-sm text-natural-olive' : 'text-natural-sage'}`}
            >
              Category
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {groups.map(group => {
            const groupGoals = goals.filter(g => g[groupKey] === group.name);
            if (groupGoals.length === 0) return null;

            return (
              <div key={group.name} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="font-serif italic text-xl text-natural-olive">
                    {group.name}
                  </h3>
                  <div className="flex-1 h-[1px] bg-natural-soft dark:bg-zinc-800" />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence initial={false}>
                    {groupGoals.map(goal => (
                      <GoalItem 
                        key={goal.id} 
                        goal={goal} 
                        onToggle={() => toggleGoal(goal.id)} 
                        onRemove={() => removeGoal(goal.id)}
                        categoryColor={categories.find(c => c.name === goal.category)?.color}
                        timeframeColor={timeframes.find(t => t.name === goal.timeframe)?.color}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {/* Unassigned */}
          {goals.filter(g => !groups.find(gr => gr.name === g[groupKey])).length > 0 && (
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <h3 className="font-serif italic text-xl text-natural-sage">Unassigned</h3>
                  <div className="flex-1 h-[1px] bg-natural-soft dark:bg-zinc-800" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {goals.filter(g => !groups.find(gr => gr.name === g[groupKey])).map(goal => (
                    <GoalItem 
                      key={goal.id} 
                      goal={goal} 
                      onToggle={() => toggleGoal(goal.id)} 
                      onRemove={() => removeGoal(goal.id)}
                      categoryColor={categories.find(c => c.name === goal.category)?.color}
                      timeframeColor={timeframes.find(t => t.name === goal.timeframe)?.color}
                    />
                  ))}
                </div>
            </div>
          )}

          {/* Add Goal Placeholder */}
          <div className="bg-white/50 dark:bg-zinc-900/50 p-8 rounded-3xl border border-dashed border-natural-beige flex items-center justify-center">
            <p className="text-sm font-serif italic text-natural-sage">+ Add a new life priority</p>
          </div>
        </div>
      </div>

      {/* Sidebar Focus Area */}
      <div className="col-span-12 lg:col-span-5 space-y-8">
        {/* Progress Card */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm border border-natural-soft dark:border-zinc-800">
           <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-natural-sage mb-1">Total Progress</p>
              <h3 className="text-3xl font-serif text-natural-olive">{Math.round(progress)}%</h3>
            </div>
            <p className="text-xs font-serif italic text-natural-sage">
              {completedCount} / {goals.length}
            </p>
          </div>
          <div className="h-1.5 w-full bg-natural-soft dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-natural-olive"
            />
          </div>
        </div>

        {/* Add Task Area */}
        <div className="bg-natural-peach/30 dark:bg-zinc-900/30 p-8 rounded-[2.5rem] border border-natural-beige dark:border-zinc-800 space-y-6">
          <h3 className="font-serif text-xl text-natural-sage">New Priority</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              value={newGoalText}
              onChange={e => setNewGoalText(e.target.value)}
              placeholder="What's next?"
              className="w-full bg-transparent border-b border-natural-beige dark:border-zinc-800 pb-2 text-sm text-natural-olive placeholder-natural-sage focus:outline-none focus:border-natural-olive transition-all"
            />
            <div className="grid grid-cols-2 gap-4">
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-white dark:bg-zinc-950 border border-natural-soft dark:border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-tight text-natural-sage outline-none"
              >
                <option value="">Category</option>
                {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
              <select 
                value={selectedTimeframe} 
                onChange={e => setSelectedTimeframe(e.target.value)}
                className="bg-white dark:bg-zinc-950 border border-natural-soft dark:border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-tight text-natural-sage outline-none"
              >
                <option value="">Timeframe</option>
                {timeframes.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <input 
              type="date" 
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-natural-soft dark:border-zinc-800 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-tight text-natural-sage outline-none"
            />
            <button 
              onClick={addGoal}
              className="w-full bg-natural-tan text-white py-3 rounded-full text-xs font-bold shadow-md hover:opacity-90 transition-all active:scale-95"
            >
              Commit Priority
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GoalItemProps {
  key?: string;
  goal: Goal;
  onToggle: () => void;
  onRemove: () => void;
  categoryColor?: string;
  timeframeColor?: string;
}

function GoalItem({ goal, onToggle, onRemove, categoryColor, timeframeColor }: GoalItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group flex items-center gap-5 p-6 rounded-3xl border transition-all ${
        goal.completed 
        ? 'bg-natural-soft/50 border-natural-soft dark:bg-zinc-900 dark:border-zinc-800' 
        : 'bg-white dark:bg-zinc-900 border-natural-soft dark:border-zinc-800 shadow-sm hover:shadow-md'
      }`}
    >
      <button 
        onClick={onToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
          goal.completed 
          ? 'bg-natural-sage border-natural-sage text-white' 
          : 'border-natural-sage/30 text-transparent hover:border-natural-sage'
        }`}
      >
        <CheckCircle2 size={16} className={goal.completed ? 'block' : 'hidden'} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          {goal.category && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider" style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}>
              {goal.category}
            </span>
          )}
          {goal.dueDate && (
            <span className="text-[10px] font-serif italic text-natural-sage">
              {new Date(goal.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        <h4 className={`text-base font-medium leading-relaxed transition-all ${goal.completed ? 'opacity-50 text-natural-sage' : 'text-natural-olive'}`}>
          {goal.text}
        </h4>
      </div>

      <button 
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 p-2 text-natural-pale hover:text-red-400 transition-all active:scale-90"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}

