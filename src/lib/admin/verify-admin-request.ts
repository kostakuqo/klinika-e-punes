import "server-only";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp, getAdminDb } from "@/lib/firebase/firebase-admin";

/**
 * Checks the "Authorization: Bearer <Firebase ID token>" header sent by the
 * admin panel. Returns the admin's uid, or null if the caller is not a
 * signed-in user listed in Firestore admins/{uid}.
 */
export async function verifyAdminRequest(request: Request): Promise<string | null> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const app = getAdminApp();
  const db = getAdminDb();
  if (!token || !app || !db) return null;

  try {
    const { uid } = await getAuth(app).verifyIdToken(token);
    const admin = await db.doc(`admins/${uid}`).get();
    return admin.exists ? uid : null;
  } catch {
    return null;
  }
}

export const unauthorized = () =>
  Response.json({ error: "Nuk keni të drejta administrimi." }, { status: 401 });
