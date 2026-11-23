'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
import type { Card } from '@/types';
import { TaskCard } from './TaskCard';

export function SortableCard({ card, onOpen }: { card: Card; onOpen: () => void }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: card.id, data: { type: 'card' } });

  return (
    <motion.li
      ref={setNodeRef}
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={isDragging ? 'opacity-30' : ''}
      {...attributes}
      {...listeners}
    >
      <TaskCard card={card} onClick={onOpen} />
    </motion.li>
  );
}
