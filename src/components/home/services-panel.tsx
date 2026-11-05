import type { Locale } from "@/i18n/routing";
import type { Service } from "@/lib/content/content-types";
import { Reveal } from "@/components/site/reveal";
import { ServiceIcon } from "@/components/site/service-icon";

/** One panel split by hairlines, instead of a row of identical cards. */
export function ServicesPanel({ services, locale }: { services: Service[]; locale: Locale }) {
  return (
    <Reveal>
      <div className="grid gap-px overflow-hidden rounded-[28px] border border-frost bg-frost sm:grid-cols-2">
        {services.map((s) => (
          <article key={s.id} className="group relative bg-white p-8 transition-colors duration-500 hover:bg-navy sm:p-10">
            <span className="grid size-14 place-items-center rounded-2xl bg-amber-soft text-navy transition-colors duration-500 group-hover:bg-amber">
              <ServiceIcon name={s.icon} className="size-7" />
            </span>
            <h3 className="mt-7 text-2xl font-semibold text-navy transition-colors duration-500 group-hover:text-white">
              {s.title[locale]}
            </h3>
            <p className="mt-3 max-w-md leading-relaxed text-steel transition-colors duration-500 group-hover:text-white/75">
              {s.text[locale]}
            </p>
          </article>
        ))}
      </div>
    </Reveal>
  );
}
