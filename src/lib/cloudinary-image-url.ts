/**
 * Adds Cloudinary's automatic format + quality and a max width to an uploaded
 * image URL, so a 6 MB phone photo is served as a light WebP/AVIF.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function optimizedImageUrl(url: string, width = 1200): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}
