/**
 * Writes the default content into Firestore once, so the admin panel has
 * something to edit. Safe to re-run: it skips documents that already exist
 * unless you pass --force.
 *
 *   npm run seed            (reads .env.local)
 *   npm run seed -- --force
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defaultSiteContent as c } from "../src/lib/content/default-site-content";

const force = process.argv.includes("--force");
const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error("Missing FIREBASE_* variables. Copy .env.example to .env.local and fill them in.");
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore();

async function put(path: string, data: object) {
  const ref = db.doc(path);
  if (!force && (await ref.get()).exists) return console.log("skip ", path);
  await ref.set(data);
  console.log("write", path);
}

await put("settings/general", c.settings);
await put("pages/home", c.home);
for (const [id, page] of Object.entries(c.pages)) await put(`pages/${id}`, page);
for (const { id, ...s } of c.services) await put(`services/${id}`, s);
for (const { id, ...d } of c.doctors) await put(`doctors/${id}`, d);
for (const { id, ...i } of c.industries) await put(`industries/${id}`, i);
console.log("Done.");
