import type { Locale } from "@/i18n/routing";
import type { Doctor } from "@/lib/content/content-types";
import { Reveal } from "@/components/site/reveal";

/** Doctor profiles from the admin panel. Hidden entirely until there is at least one. */
export function DoctorsGrid({ doctors, locale, showBio = false }: { doctors: Doctor[]; locale: Locale; showBio?: boolean }) {
  return (
    <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {doctors.map((d, i) => (
        <li key={d.id}>
          <Reveal delay={i * 0.08}>
            <div className="group aspect-[4/5] overflow-hidden rounded-[22px] bg-frost">
              {d.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={d.photoUrl}
                  alt={d.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <span className="grid size-full place-items-center font-display text-6xl font-semibold text-navy/20">
                  {d.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
              )}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-navy">{d.name}</h3>
            <p className="text-steel">{d.role[locale]}</p>
            {showBio && d.bio[locale] && <p className="mt-3 leading-relaxed text-steel">{d.bio[locale]}</p>}
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
