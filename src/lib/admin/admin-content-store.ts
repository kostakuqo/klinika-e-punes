"use client";

import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, writeBatch } from "firebase/firestore";
import { clientDb } from "@/lib/firebase/firebase-client";
import { refreshPublicSite } from "./admin-api";

/**
 * Admin-side reads and writes. The browser writes to Firestore directly
 * (allowed by firestore.rules for admins), then asks the server to clear the
 * public site's cache.
 */

/** One document, merged over its default so fields added later always exist. */
export async function loadDocument<T extends object>(path: string, fallback: T): Promise<T> {
  const snap = await getDoc(doc(clientDb(), path));
  return snap.exists() ? { ...fallback, ...(snap.data() as Partial<T>) } : fallback;
}

export async function saveDocument<T extends object>(path: string, data: T): Promise<void> {
  await setDoc(doc(clientDb(), path), data);
  await refreshPublicSite();
}

type Ordered = { id: string; order: number };

/** A whole collection, sorted by "order". Falls back to defaults when empty. */
export async function loadList<T extends Ordered>(name: string, fallback: T[]): Promise<T[]> {
  const snap = await getDocs(query(collection(clientDb(), name), orderBy("order")));
  if (snap.empty) return fallback;
  return snap.docs.map((d) => ({ ...(d.data() as Omit<T, "id">), id: d.id }) as T);
}

/**
 * Saves a list exactly as shown in the editor: writes every item with its
 * position as "order" and deletes documents that were removed.
 */
export async function saveList<T extends Ordered>(name: string, items: T[]): Promise<void> {
  const db = clientDb();
  const existing = await getDocs(collection(db, name));
  const keep = new Set(items.map((i) => i.id));
  const batch = writeBatch(db);

  items.forEach(({ id, ...rest }, index) => {
    batch.set(doc(db, name, id), { ...rest, order: index + 1 });
  });
  existing.docs.filter((d) => !keep.has(d.id)).forEach((d) => batch.delete(d.ref));

  await batch.commit();
  await refreshPublicSite();
}

/** Short random id for a new list item, e.g. "sh-4k2p9a". */
export const newId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
