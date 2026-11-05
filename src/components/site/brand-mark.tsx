import { clsx } from "clsx";
import { optimizedImageUrl } from "@/lib/cloudinary-image-url";

/**
 * Built-in logo: a small 24h dial with the work-hours arc, echoing the hero.
 * When the client uploads their logo in the admin panel, logoUrl replaces it.
 */
export function BrandMark({
  name,
  logoUrl,
  tone = "dark",
}: {
  name: string;
  logoUrl?: string;
  tone?: "dark" | "light";
}) {
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={optimizedImageUrl(logoUrl, 400)} alt={name} className="h-10 w-auto" />;
  }
  const [first, ...rest] = name.split(" e ");
  return (
    <span className={clsx("flex items-center gap-2.5", tone === "light" ? "text-white" : "text-navy")}>
      <svg viewBox="0 0 40 40" className="size-9 shrink-0" aria-hidden>
        <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="4" />
        <path d="M20 4 A16 16 0 0 1 33.86 28" fill="none" stroke="var(--color-amber)" strokeWidth="4" strokeLinecap="round" />
        <path d="M20 20 L20 11 M20 20 L26 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="font-display text-[1.05rem] leading-none font-semibold tracking-tight whitespace-nowrap">
        {first}
        {rest.length > 0 && <span className="font-normal opacity-70"> e {rest.join(" e ")}</span>}
      </span>
    </span>
  );
}
