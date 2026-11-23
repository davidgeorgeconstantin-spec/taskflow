# TaskFlow — Lecții (în română)

Proiectul 5: o aplicație Kanban (ca Trello) cu conturi, drag & drop și animații.

## Lecția 1 — Structura pe „features”
În loc să punem toate componentele într-un singur folder, le grupăm după **funcționalitate**:
- `features/auth` — tot ce ține de cont (login, signup, protecție pagini)
- `features/boards` — lista de board-uri și store-ul
- `features/kanban` — coloane, carduri, drag & drop

Regula: `components/ui` = piese generice (Button, Modal), `features/*` = logica aplicației.
Așa găsești repede orice fișier și poți șterge o funcționalitate fără să strici restul.

**Exercițiu:** creează `features/stats/` cu o componentă care arată câte carduri sunt în fiecare coloană.

## Lecția 2 — Autentificare și pagini protejate
`AuthProvider` ține utilizatorul curent într-un **Context**. Orice componentă îl citește cu `useAuth()`.
`RequireAuth` verifică: dacă nu ești logat → te trimite la `/login`.

Parolele nu se salvează niciodată în clar: facem **hash** (SHA-256 + salt) cu `crypto.subtle`.
Atenție: în demo totul e în browser (localStorage), deci NU e sigur pentru producție.
În producție folosim Supabase Auth (vezi `supabase/README.md`) — serverul verifică parola.

**Exercițiu:** la înregistrare, cere ca parola să conțină cel puțin o cifră (vezi validările din `AuthForm.tsx`).

## Lecția 3 — State global cu Zustand + persist
`boardStore.ts` creează un store cu `create()`. Orice componentă citește doar ce îi trebuie:
```ts
const boards = useBoardStore((s) => s.boards);
```
Middleware-ul `persist` salvează automat în localStorage sub cheia `taskflow:boards`.
Acțiunile (`addCard`, `moveCard`) modifică starea **imutabil** (copii noi, nu modificăm direct).

**Exercițiu:** adaugă acțiunea `duplicateCard(boardId, cardId)` care pune copia imediat sub original.

## Lecția 4 — Drag & drop cu dnd-kit
- `DndContext` — „zona” în care tragem
- `SortableContext` — lista sortabilă dintr-o coloană
- `useSortable` — face un card „trăgabil”
- `onDragOver` — mută cardul în altă coloană **în timp ce** tragi
- `onDragEnd` — fixează poziția finală
- `DragOverlay` — copia cardului care urmărește mouse-ul (am rotit-o puțin pentru efect)

Am adăugat `KeyboardSensor` → se poate muta un card și din tastatură (Space, săgeți). Asta e **accesibilitate**.

**Exercițiu:** adaugă o limită: coloana „In progress” să nu accepte mai mult de 3 carduri.

## Lecția 5 — Animații: layout și layoutId
- `layout` pe un `motion.div` → elementul se mută lin când i se schimbă poziția în pagină
- `layoutId` → același element „zboară” dintr-un loc în altul (vezi `BoardPreview` pe landing)
- `AnimatePresence` → animație la ieșire (modal, carduri șterse)
- `MotionConfig reducedMotion="user"` → dacă utilizatorul a cerut mai puțină mișcare în sistem, animațiile se opresc

**Exercițiu:** în `BoardPreview`, schimbă intervalul la 1000 ms și tipul de tranziție la `tween`. Ce diferență vezi?
