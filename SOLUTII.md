# TaskFlow — Soluții

## Lecția 1 — features/stats
```tsx
// src/features/stats/ColumnStats.tsx
import type { Board } from '@/types';

export function ColumnStats({ board }: { board: Board }) {
  return (
    <ul className="mb-4 flex gap-4 text-sm text-slate-600">
      {board.columns.map((c) => (
        <li key={c.id}>{c.title}: <b>{c.cardIds.length}</b></li>
      ))}
    </ul>
  );
}
```
Observă: coloana ține doar `cardIds` (ordinea), iar cardurile sunt în `board.cards` (un obiect id → card). Așa mutarea unui card schimbă doar un array de id-uri.
Pune `<ColumnStats board={board} />` în `KanbanBoard.tsx`, deasupra coloanelor.

## Lecția 2 — parola cu cifră
În `AuthForm.tsx`, lângă celelalte validări:
```ts
if (mode === 'signup' && !/\d/.test(form.password)) return setError('Password must contain a number.');
```

## Lecția 3 — duplicateCard
În interfața `BoardState`:
```ts
duplicateCard: (boardId: string, cardId: string) => void;
```
În store:
```ts
duplicateCard: (boardId, cardId) =>
  set((s) =>
    patchBoard(s, boardId, (b) => {
      const original = b.cards[cardId];
      if (!original) return b;
      const copy: Card = { ...original, id: createId(), title: `${original.title} (copy)`, createdAt: now() };
      return {
        ...b,
        cards: { ...b.cards, [copy.id]: copy },
        columns: b.columns.map((c) => {
          const i = c.cardIds.indexOf(cardId);
          if (i === -1) return c;
          const ids = [...c.cardIds];
          ids.splice(i + 1, 0, copy.id);
          return { ...c, cardIds: ids };
        }),
      };
    }),
  ),
```

## Lecția 4 — limită WIP (max 3 în „In progress”)
În `KanbanBoard.tsx`, în `onDragOver`, după `if (!from || !to || from.id === to.id) return;`:
```ts
if (to.title === 'In progress' && to.cardIds.length >= 3) return;
```
Cardul pur și simplu nu intră în coloană. Bonus: colorează coloana în roșu când e plină.

## Lecția 5
Cu `tween` mișcarea are durată fixă și pare „mecanică”; cu `spring` cardul accelerează și se oprește natural. La 1000 ms animațiile se suprapun mai des — de aceea un interval puțin mai mare decât durata animației arată mai curat.
