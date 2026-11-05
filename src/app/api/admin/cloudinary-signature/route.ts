import { createHash } from "node:crypto";
import { unauthorized, verifyAdminRequest } from "@/lib/admin/verify-admin-request";

/** Every image of this site goes into one Cloudinary folder. */
const FOLDER = "klinika-e-punes";

/**
 * Signs an upload so the browser can send the file straight to Cloudinary
 * without ever seeing the API secret. Only signed-in admins get a signature.
 * https://cloudinary.com/documentation/authentication_signatures
 */
export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) return unauthorized();

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json(
      { error: "Cloudinary nuk është konfiguruar. Plotësoni CLOUDINARY_* në .env.local." },
      { status: 500 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  // parameters sorted alphabetically, joined with &, then the secret appended
  const toSign = `folder=${FOLDER}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(toSign + apiSecret).digest("hex");

  return Response.json({ cloudName, apiKey, timestamp, signature, folder: FOLDER });
}
