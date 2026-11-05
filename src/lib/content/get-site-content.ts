import "server-only";
import { unstable_cache } from "next/cache";
import { getAdminDb } from "@/lib/firebase/firebase-admin";
import { defaultSiteContent } from "./default-site-content";
import type { InnerPageId, SiteContent } from "./content-types";

/**
 * Firestore layout
 *   settings/general              SiteSettings
 *   pages/home                    HomePage
 *   pages/{about|services|…}      InnerPage
 *   services/{id}                 Service    (sorted by "order")
 *   doctors/{id}                  Doctor     (sorted by "order")
 *   industries/{id}               Industry   (sorted by "order")
 *
 * Everything is cached under the "content" tag. The admin panel calls
 * revalidateTag("content", "max") after each save, so changes go live
 * in seconds without a redeploy.
 */
export const CONTENT_TAG = "content";

const innerPageIds: InnerPageId[] = ["about", "services", "doctors", "clients", "contact", "book"];

/** Shallow-merge stored data over defaults so new fields never break the page. */
function merge<T extends object>(base: T, stored: unknown): T {
  if (!stored || typeof stored !== "object") return base;
  return { ...base, ...(stored as Partial<T>) };
}

async function loadFromFirestore(): Promise<SiteContent> {
  const db = getAdminDb();
  if (!db) return defaultSiteContent;

  try {
    const [settingsSnap, pagesSnap, servicesSnap, doctorsSnap, industriesSnap] =
      await Promise.all([
        db.doc("settings/general").get(),
        db.collection("pages").get(),
        db.collection("services").orderBy("order").get(),
        db.collection("doctors").orderBy("order").get(),
        db.collection("industries").orderBy("order").get(),
      ]);

    const pagesById = new Map(pagesSnap.docs.map((d) => [d.id, d.data()]));
    const pages = Object.fromEntries(
      innerPageIds.map((id) => [id, merge(defaultSiteContent.pages[id], pagesById.get(id))]),
    ) as SiteContent["pages"];

    const list = <T,>(snap: FirebaseFirestore.QuerySnapshot, fallback: T[]): T[] =>
      snap.empty ? fallback : snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);

    return {
      settings: merge(defaultSiteContent.settings, settingsSnap.data()),
      home: merge(defaultSiteContent.home, pagesById.get("home")),
      pages,
      services: list(servicesSnap, defaultSiteContent.services),
      doctors: list(doctorsSnap, defaultSiteContent.doctors),
      industries: list(industriesSnap, defaultSiteContent.industries),
    };
  } catch (error) {
    console.error("[content] Firestore read failed, using defaults", error);
    return defaultSiteContent;
  }
}

export const getSiteContent = unstable_cache(loadFromFirestore, ["site-content"], {
  tags: [CONTENT_TAG],
  revalidate: 3600,
});
