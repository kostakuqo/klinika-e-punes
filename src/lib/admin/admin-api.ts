"use client";

import { clientAuth } from "@/lib/firebase/firebase-client";

/** POST to an /api/admin route with the signed-in admin's ID token. */
async function adminPost<T>(path: string): Promise<T> {
  const user = clientAuth().currentUser;
  if (!user) throw new Error("Sesioni ka mbaruar. Hyni përsëri.");
  const token = await user.getIdToken();
  const res = await fetch(path, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Gabim ${res.status}`);
  return body as T;
}

/** Clears the site's content cache so a save shows up on the next page load. */
export const refreshPublicSite = () => adminPost<{ ok: true }>("/api/admin/revalidate/");

type Signature = { cloudName: string; apiKey: string; timestamp: number; signature: string; folder: string };

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Uploads an image straight from the browser to Cloudinary using a signature
 * from our server (the API secret never reaches the browser).
 * Returns the image's https URL.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Zgjidhni një skedar imazhi (JPG, PNG, WebP).");
  if (file.size > MAX_BYTES) throw new Error("Imazhi është më i madh se 10 MB. Zgjidhni një më të vogël.");

  const sig = await adminPost<Signature>("/api/admin/cloudinary-signature/");
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: form });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error?.message ?? "Ngarkimi i imazhit dështoi.");
  return body.secure_url as string;
}
