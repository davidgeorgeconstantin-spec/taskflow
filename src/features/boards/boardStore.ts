'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createId } from '@/lib/id';
import type { Board, Card, Column } from '@/types';

export const BOARD_COLORS = [
  'from-indigo-500 to-violet-500',
  'from-sky-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-rose-500 to-orange-400',
  'from-fuchsia-500 to-pink-400',
];

interface BoardState {
  boards: Record<string, Board>;
  createBoard: (ownerId: string, title: string, color?: string) => string;
  deleteBoard: (boardId: string) => void;
  addColumn: (boardId: string, title: string) => void;
  renameColumn: (boardId: string, columnId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addCard: (boardId: string, columnId: string, title: string) => void;
  updateCard: (boardId: string, cardId: string, patch: Partial<Card>) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  moveCard: (boardId: string, cardId: string, toColumnId: string, toIndex: number) => void;
}

const now = () => new Date().toISOString();
const column = (title: string, cardIds: string[] = []): Column => ({ id: createId(), title, cardIds });

/** Helper: update one board immutably. */
function patchBoard(state: BoardState, boardId: string, fn: (b: Board) => Board) {
  const board = state.boards[boardId];
  return board ? { boards: { ...state.boards, [boardId]: fn(board) } } : state;
}

/**
 * Global store with Zustand. `persist` saves it in localStorage automatically.
 * Every action returns NEW objects (immutability), like setState in React.
 */
export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      boards: {},

      createBoard: (ownerId, title, color = BOARD_COLORS[0]!) => {
        const id = createId();
        const board: Board = { id, ownerId, title, color, columns: [column('To do'), column('In progress'), column('Done')], cards: {}, createdAt: now() };
        set((s) => ({ boards: { ...s.boards, [id]: board } }));
        return id;
      },

      deleteBoard: (boardId) =>
        set((s) => {
          const rest = { ...s.boards };
          delete rest[boardId];
          return { boards: rest };
        }),

      addColumn: (boardId, title) => set((s) => patchBoard(s, boardId, (b) => ({ ...b, columns: [...b.columns, column(title)] }))),

      renameColumn: (boardId, columnId, title) =>
        set((s) => patchBoard(s, boardId, (b) => ({ ...b, columns: b.columns.map((c) => (c.id === columnId ? { ...c, title } : c)) }))),

      deleteColumn: (boardId, columnId) =>
        set((s) =>
          patchBoard(s, boardId, (b) => {
            const col = b.columns.find((c) => c.id === columnId);
            const cards = { ...b.cards };
            col?.cardIds.forEach((id) => delete cards[id]);
            return { ...b, cards, columns: b.columns.filter((c) => c.id !== columnId) };
          }),
        ),

      addCard: (boardId, columnId, title) =>
        set((s) =>
          patchBoard(s, boardId, (b) => {
            const card: Card = { id: createId(), title, description: '', labels: [], dueDate: null, createdAt: now() };
            return {
              ...b,
              cards: { ...b.cards, [card.id]: card },
              columns: b.columns.map((c) => (c.id === columnId ? { ...c, cardIds: [...c.cardIds, card.id] } : c)),
            };
          }),
        ),

      updateCard: (boardId, cardId, patch) =>
        set((s) => patchBoard(s, boardId, (b) => ({ ...b, cards: { ...b.cards, [cardId]: { ...b.cards[cardId]!, ...patch } } }))),

      deleteCard: (boardId, cardId) =>
        set((s) =>
          patchBoard(s, boardId, (b) => {
            const cards = { ...b.cards };
            delete cards[cardId];
            return { ...b, cards, columns: b.columns.map((c) => ({ ...c, cardIds: c.cardIds.filter((id) => id !== cardId) })) };
          }),
        ),

      moveCard: (boardId, cardId, toColumnId, toIndex) =>
        set((s) =>
          patchBoard(s, boardId, (b) => {
            // 1. remove the card from wherever it is, 2. insert it at the new position
            const without = b.columns.map((c) => ({ ...c, cardIds: c.cardIds.filter((id) => id !== cardId) }));
            return {
              ...b,
              columns: without.map((c) => {
                if (c.id !== toColumnId) return c;
                const ids = [...c.cardIds];
                ids.splice(Math.max(0, Math.min(toIndex, ids.length)), 0, cardId);
                return { ...c, cardIds: ids };
              }),
            };
          }),
        ),
    }),
    { name: 'taskflow:boards' },
  ),
);

/** Creates a board with example cards (used by "Try the demo"). */
export function seedDemoBoard(ownerId: string) {
  const store = useBoardStore.getState();
  const id = store.createBoard(ownerId, 'Portfolio launch 🚀', BOARD_COLORS[0]);
  const [todo, doing, done] = useBoardStore.getState().boards[id]!.columns;
  const add = (col: Column, title: string, extra: Partial<Card> = {}) => {
    store.addCard(id, col.id, title);
    const b = useBoardStore.getState().boards[id]!;
    const cardId = b.columns.find((c) => c.id === col.id)!.cardIds.at(-1)!;
    store.updateCard(id, cardId, extra);
  };
  const inDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
  add(todo!, 'Write README in English', { labels: ['blue'], dueDate: inDays(3) });
  add(todo!, 'Record a 1-minute demo GIF', { labels: ['violet'] });
  add(todo!, 'Add dark mode', { labels: ['amber'], description: 'Use a `dark` class on <html>.' });
  add(doing!, 'Drag & drop with dnd-kit', { labels: ['green', 'blue'], dueDate: inDays(1) });
  add(doing!, 'Protect pages for logged-in users', { labels: ['red'] });
  add(done!, 'Set up Next.js + Tailwind', { labels: ['green'] });
  add(done!, 'Design the board layout', { labels: ['violet'] });
  store.createBoard(ownerId, 'Learning plan 📚', BOARD_COLORS[2]);
  return id;
}
