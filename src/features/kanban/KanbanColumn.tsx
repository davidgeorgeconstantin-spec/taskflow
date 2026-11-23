'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import type { Board, Column } from '@/types';
import { AddCardForm } from './AddCardForm';
import { SortableCard } from './SortableCard';

interface Props {
  board: Board;
  column: Column;
  onAddCard: (title: string) => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onOpenCard: (cardId: string) => void;
}

export function KanbanColumn({ board, column, onAddCard, onRename, onDelete, onOpenCard }: Props) {
  // The column itself is a drop target, so cards can be dropped into an empty column.
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: 'column' } });
  const [editing, setEditing] = useState(false);

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn('flex w-72 shrink-0 flex-col rounded-3xl bg-slate-100/80 p-3 transition-colors', isOver && 'bg-indigo-50 ring-2 ring-indigo-200')}
    >
      <header className="mb-3 flex items-center gap-2 px-1">
        {editing ? (
          <input
            autoFocus
            defaultValue={column.title}
            onBlur={(e) => {
              onRename(e.target.value.trim() || column.title);
              setEditing(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            className="flex-1 rounded-lg border border-indigo-300 px-2 py-1 text-sm font-semibold outline-none"
          />
        ) : (
          <h3 onDoubleClick={() => setEditing(true)} className="flex-1 cursor-text text-sm font-bold" title="Double-click to rename">
            {column.title}
          </h3>
        )}
        <motion.span key={column.cardIds.length} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="rounded-full bg-white px-2 text-xs font-semibold text-slate-500">
          {column.cardIds.length}
        </motion.span>
        <button onClick={onDelete} aria-label={`Delete column ${column.title}`} className="rounded p-1 text-slate-400 hover:bg-white hover:text-rose-500">
          ✕
        </button>
      </header>

      <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="flex min-h-12 flex-1 flex-col gap-2">
          <AnimatePresence initial={false}>
            {column.cardIds.map((id) => {
              const card = board.cards[id];
              return card ? <SortableCard key={id} card={card} onOpen={() => onOpenCard(id)} /> : null;
            })}
          </AnimatePresence>
        </ul>
      </SortableContext>
      <div className="mt-2">
        <AddCardForm onAdd={onAddCard} />
      </div>
    </motion.section>
  );
}
