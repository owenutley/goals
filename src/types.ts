
export type Timeframe = {
  name: string;
  color: string;
};

export type Category = {
  name: string;
  color: string;
};

export type Goal = {
  id: string;
  text: string;
  category: string | null;
  timeframe: string | null;
  dueDate: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
};

export type Book = {
  id: string;
  title: string;
  author: string;
  status: 'to-read' | 'reading' | 'completed';
  progress?: number; // 0 to 100
  rating?: number;
};

export type JournalEntry = {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
};
