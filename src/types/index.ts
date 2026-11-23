export interface User {
  id: string;
  name: string;
  email: string;
}

export type LabelColor = 'red' | 'amber' | 'green' | 'blue' | 'violet';

export interface Card {
  id: string;
  title: string;
  description: string;
  labels: LabelColor[];
  dueDate: string | null; // YYYY-MM-DD
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[]; // order of cards in the column
}

export interface Board {
  id: string;
  ownerId: string;
  title: string;
  color: string; // Tailwind gradient classes
  columns: Column[];
  cards: Record<string, Card>;
  createdAt: string;
}
