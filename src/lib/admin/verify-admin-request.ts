import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { getAdminDb } from "@/lib/firebase/firebase-admin";

/**
 * Checks the "Authorization: Bearer <Firebase ID token>" header sent by the
 * admin panel. Returns the admin's uid, or null if the caller is not a
 * signed-in user listed in Firestore admins/{uid}.
 *
 * The token is verified with `jose` against Google's published keys, as in
 * https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
 * We don't use firebase-admin/auth: it loads jwks-rsa, which require()s the
 * ESM-only jose and crashes on Vercel (ERR_REQUIRE_ESM).
 */
const googleKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

async function verifyFirebaseIdToken(token: string, projectId: string): Promise<string> {
  const { payload } = await jwtVerify(token, googleKeys, {
    algorithms: ["RS256"],
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`,
  });
  if (typeof payload.sub !== "string" || !payload.sub) throw new Error("Token has no user id");
  const authTime = Number(payload.auth_time);
  if (!Number.isFinite(authTime) || authTime > Date.now() / 1000 + 60) throw new Error("Invalid auth_time");
  return payload.sub;
}

export async function verifyAdminRequest(request: Request): Promise<string | null> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const db = getAdminDb();
  if (!token || !projectId || !db) return null;

  try {
    const uid = await verifyFirebaseIdToken(token, projectId);
    const admin = await db.doc(`admins/${uid}`).get();
    return admin.exists ? uid : null;
  } catch (error) {
    console.warn("[admin] token check failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

export const unauthorized = () =>
  Response.json({ error: "Nuk keni të drejta administrimi." }, { status: 401 });
