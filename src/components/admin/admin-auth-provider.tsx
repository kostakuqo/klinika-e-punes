"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { clientAuth, clientDb, isFirebaseClientConfigured } from "@/lib/firebase/firebase-client";

/**
 * loading     → checking the session
 * signed-out  → show the login form
 * not-admin   → signed in, but no admins/{uid} document
 * admin       → full access
 * unconfigured→ NEXT_PUBLIC_FIREBASE_* env vars are missing
 */
export type AdminStatus = "loading" | "signed-out" | "not-admin" | "admin" | "unconfigured";

type AdminAuth = { status: AdminStatus; user: User | null; logout: () => Promise<void> };

const AdminAuthContext = createContext<AdminAuth | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AdminStatus>(isFirebaseClientConfigured ? "loading" : "unconfigured");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isFirebaseClientConfigured) return;
    return onAuthStateChanged(clientAuth(), async (next) => {
      setUser(next);
      if (!next) return setStatus("signed-out");
      setStatus("loading");
      try {
        // Firestore rules let a signed-in user read only their own admins/{uid} doc
        const snap = await getDoc(doc(clientDb(), "admins", next.uid));
        setStatus(snap.exists() ? "admin" : "not-admin");
      } catch {
        setStatus("not-admin");
      }
    });
  }, []);

  const logout = async () => {
    if (isFirebaseClientConfigured) await signOut(clientAuth());
  };

  return <AdminAuthContext.Provider value={{ status, user, logout }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuth {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
