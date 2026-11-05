import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content/get-site-content";
import { unauthorized, verifyAdminRequest } from "@/lib/admin/verify-admin-request";

/**
 * Called by the admin panel after every save. Drops the cached site content
 * so the next visitor sees the change immediately (no stale copy served).
 */
export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) return unauthorized();
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return Response.json({ ok: true });
}
