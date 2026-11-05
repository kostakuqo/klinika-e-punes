import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/site/reveal";

/** Closing call to action in hi-vis amber. */
export function BookingCtaBand({ title, text, bookLabel, phone }: { title: string; text: string; bookLabel: string; phone: string }) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] bg-amber px-8 py-14 text-navy-deep sm:px-14 sm:py-20">
          {/* hazard-stripe edge, the one decorative nod to workplace signage */}
          <span
            aria-hidden
            className="absolute inset-y-0 right-0 hidden w-24 opacity-90 md:block"
            style={{ backgroundImage: "repeating-linear-gradient(-45deg, var(--color-navy-deep) 0 14px, transparent 14px 28px)" }}
          />
          <div className="relative max-w-2xl md:pr-24">
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] font-semibold">{title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-deep/80">{text}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/rezervo" className="rounded-full bg-navy-deep px-7 py-4 font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5">
                {bookLabel}
              </Link>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="rounded-full border-2 border-navy-deep/25 px-7 py-[14px] font-semibold tabular-nums transition-colors hover:border-navy-deep">
                {phone}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
