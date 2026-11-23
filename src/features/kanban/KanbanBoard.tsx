'use client';

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useBoardStore } from '@/features/boards/boardStore';
import type { Board } from '@/types';
import { CardDialog } from './CardDialog';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';

export function KanbanBoard({ board }: { board: Board }) {
  const { moveCard, addCard, addColumn, renameColumn, deleteColumn, updateCard, deleteCard } = useBoardStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  // Pointer: start dragging after 5px (so a click still opens the card). Keyboard: Space + arrows.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  /** Column that contains `id` (id can be a card id or a column id). */
  const findColumn = (id: string) => board.columns.find((c) => c.id === id || c.cardIds.includes(id));

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  // While dragging over ANOTHER column, move the card there right away (live preview).
  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const from = findColumn(String(active.id));
    const to = findColumn(String(over.id));
    if (!from || !to || from.id === to.id) return;
    const overIndex = to.cardIds.indexOf(String(over.id));
    moveCard(board.id, String(active.id), to.id, overIndex === -1 ? to.cardIds.length : overIndex);
  }

  // On drop, fix the final position inside the column.
  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;
    const col = findColumn(String(over.id));
    if (!col) return;
    const overIndex = col.cardIds.indexOf(String(over.id));
    if (overIndex !== -1 && String(active.id) !== String(over.id)) moveCard(board.id, String(active.id), col.id, overIndex);
  }

  const activeCard = activeId ? board.cards[activeId] : null;
  const openCard = openCardId ? (board.cards[openCardId] ?? null) : null;

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} onDragCancel={() => setActiveId(null)}>
        <div className="board-scroll flex items-start gap-4 overflow-x-auto pb-6">
          <AnimatePresence initial={false}>
            {board.columns.map((col) => (
              <KanbanColumn
                key={col.id}
                board={board}
                column={col}
                onAddCard={(t) => addCard(board.id, col.id, t)}
                onRename={(t) => renameColumn(board.id, col.id, t)}
                onDelete={() => confirm(`Delete "${col.title}" and its cards?`) && deleteColumn(board.id, col.id)}
                onOpenCard={setOpenCardId}
              />
            ))}
          </AnimatePresence>
          <motion.button
            layout
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              const title = prompt('Column name');
              if (title?.trim()) addColumn(board.id, title.trim());
            }}
            className="w-72 shrink-0 rounded-3xl border-2 border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 hover:border-indigo-400 hover:text-indigo-600"
          >
            + Add column
          </motion.button>
        </div>

        {/* The floating copy that follows the cursor while dragging */}
        <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
          {activeCard && (
            <motion.div initial={{ rotate: 0, scale: 1 }} animate={{ rotate: 3, scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <TaskCard card={activeCard} dragging />
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>

      <CardDialog
        card={openCard}
        onClose={() => setOpenCardId(null)}
        onChange={(patch) => openCardId && updateCard(board.id, openCardId, patch)}
        onDelete={() => {
          if (openCardId) deleteCard(board.id, openCardId);
          setOpenCardId(null);
        }}
      />
    </>
  );
}
