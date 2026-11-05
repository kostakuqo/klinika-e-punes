import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/firebase-admin";

/**
 * Receives the public contact / booking form and stores it in Firestore
 * "messages". Written with the Admin SDK, so visitors never get direct
 * database access. Includes validation, a hidden honeypot field against bots
 * and a small per-IP rate limit.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return Response.json({ error: "invalid" }, { status: 400 });

  // Bots fill every field, people never see this one
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) return Response.json({ error: "rate" }, { status: 429 });

  const message = {
    name: clean(body.name, 120),
    company: clean(body.company, 160),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    employees: clean(body.employees, 20),
    message: clean(body.message, 4000),
    source: body.source === "book" ? "book" : "contact",
    locale: ["sq", "en", "it"].includes(body.locale) ? body.locale : "sq",
  };

  if (message.name.length < 2 || message.message.length < 5) return Response.json({ error: "missing" }, { status: 400 });
  if (!message.phone && !message.email) return Response.json({ error: "contact" }, { status: 400 });
  if (message.email && !EMAIL.test(message.email)) return Response.json({ error: "email" }, { status: 400 });

  const db = getAdminDb();
  if (!db) return Response.json({ error: "server" }, { status: 500 });

  await db.collection("messages").add({ ...message, read: false, createdAt: FieldValue.serverTimestamp() });
  return Response.json({ ok: true });
}
