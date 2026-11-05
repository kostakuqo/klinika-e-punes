import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Cleans FIREBASE_PRIVATE_KEY however it was pasted into .env.local / Vercel:
 * surrounding quotes, a trailing comma copied from the JSON file,
 * literal "\n" sequences and Windows line endings.
 */
function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if (key.endsWith(",")) key = key.slice(0, -1).trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n").replace(/\r/g, "").trim() + "\n";
}

let cachedApp: App | null | undefined;

/**
 * Firebase Admin app. Returns null when the service-account env vars are
 * missing or invalid, so the public site still renders from default content.
 */
export function getAdminApp(): App | null {
  if (cachedApp !== undefined) return cachedApp;

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !rawKey) return (cachedApp = null);

  try {
    cachedApp =
      getApps()[0] ??
      initializeApp({ credential: cert({ projectId, clientEmail, privateKey: normalizePrivateKey(rawKey) }) });
    return cachedApp;
  } catch (error) {
    console.error(
      "[firebase-admin] Could not read the service account. Check FIREBASE_PRIVATE_KEY in .env.local — " +
        "it must start with -----BEGIN PRIVATE KEY----- and end with -----END PRIVATE KEY-----.",
      error instanceof Error ? error.message : error,
    );
    return (cachedApp = null);
  }
}

/** Server-side Firestore, or null when Firebase Admin is not configured. */
export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}
