# Moving TaskFlow to Supabase (production auth + database)

The live demo uses `src/features/auth/authService.ts`, a **browser-only demo** of authentication.
For a real product, replace it with Supabase (free tier):

1. Create a project at https://supabase.com and run `schema.sql` in the SQL editor.
2. `npm install @supabase/supabase-js` and add `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` (never commit it).
3. Implement the same methods as `authService` with `supabase.auth.signUp`, `signInWithPassword`, `signOut` and `getUser`.
4. Replace the Zustand `persist` storage with queries to the `boards`, `columns` and `cards` tables.

Row Level Security policies in `schema.sql` make sure every user can only read and write their own boards.
