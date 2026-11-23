/**
 * DEMO authentication that runs fully in the browser (localStorage).
 * It shows the real flow (sign up → hashed password → session → protected pages),
 * but it is NOT secure for production: anyone can read localStorage.
 * For production, swap this file for Supabase Auth (see supabase/README.md).
 */
import type { User } from '@/types';

interface StoredUser extends User {
  salt: string;
  passwordHash: string;
}

const USERS_KEY = 'taskflow:users';
const SESSION_KEY = 'taskflow:session';

const readUsers = (): StoredUser[] => JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as StoredUser[];
const writeUsers = (u: StoredUser[]) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

/** SHA-256 with a random salt, using the browser's Web Crypto API. */
async function hashPassword(password: string, salt: string) {
  const bytes = new TextEncoder().encode(salt + password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const publicUser = ({ id, name, email }: StoredUser): User => ({ id, name, email });

export class AuthError extends Error {}

export const authService = {
  async signUp(name: string, email: string, password: string): Promise<User> {
    const users = readUsers();
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalized)) throw new AuthError('An account with this email already exists.');
    const salt = crypto.randomUUID();
    const user: StoredUser = { id: crypto.randomUUID(), name: name.trim(), email: normalized, salt, passwordHash: await hashPassword(password, salt) };
    writeUsers([...users, user]);
    localStorage.setItem(SESSION_KEY, user.id);
    return publicUser(user);
  },

  async signIn(email: string, password: string): Promise<User> {
    const user = readUsers().find((u) => u.email === email.trim().toLowerCase());
    // Same message for "no user" and "wrong password", so attackers can't guess emails.
    if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) throw new AuthError('Wrong email or password.');
    localStorage.setItem(SESSION_KEY, user.id);
    return publicUser(user);
  },

  signOut() {
    localStorage.removeItem(SESSION_KEY);
  },

  currentUser(): User | null {
    const id = localStorage.getItem(SESSION_KEY);
    const user = id ? readUsers().find((u) => u.id === id) : undefined;
    return user ? publicUser(user) : null;
  },
};
