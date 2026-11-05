import type { Locale } from "@/i18n/routing";

/** What visitors see for each language. Internally Albanian stays "sq" (URLs, hreflang). */
export const languageLabels: Record<Locale, string> = { sq: "AL", en: "EN", it: "IT" };
export const languageNames: Record<Locale, string> = { sq: "Shqip", en: "English", it: "Italiano" };
const flagFile: Record<Locale, string> = { sq: "al", en: "gb", it: "it" };

/** Small rounded flag (SVG files in /public/flags; emoji flags don't render on Windows). */
export function LanguageFlag({ locale, className = "h-3.5 w-[1.15rem]" }: { locale: Locale; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${flagFile[locale]}.svg`}
      alt=""
      aria-hidden
      className={`${className} shrink-0 rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.12)]`}
    />
  );
}
