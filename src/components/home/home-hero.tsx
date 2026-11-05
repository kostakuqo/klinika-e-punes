"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { WorkHoursDial } from "./work-hours-dial";

const ease = [0.16, 1, 0.3, 1] as const;

export function HomeHero({
  title,
  lead,
  phone,
  bookLabel,
  dialLabels,
}: {
  title: string;
  lead: string;
  phone: string;
  bookLabel: string;
  dialLabels: { hours: string; work: string; day: string };
}) {
  const reduce = useReducedMotion();
  const words = title.split(" ");

  return (
    <section className="relative overflow-hidden bg-navy-deep text-white">
      {/* quiet blueprint grid: the workplace is a plan we inspect */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-32 pb-20 sm:px-6 md:pt-40 lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:px-8 lg:pb-28">
        <div>
          <h1 className="text-[clamp(2.4rem,5.6vw,4.6rem)] leading-[1.02] font-semibold">
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.05 + i * 0.035, duration: 0.8, ease }}
                >
                  {word}
                  {i < words.length - 1 && " "}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/72 sm:text-xl"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease }}
          >
            {lead}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease }}
          >
            <Link
              href="/rezervo"
              className="group relative overflow-hidden rounded-full bg-amber px-7 py-4 font-semibold text-navy-deep"
            >
              <span className="relative z-10">{bookLabel}</span>
              <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-500 ease-out group-hover:translate-x-0" />
            </Link>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="rounded-full border border-white/20 px-7 py-4 font-medium tabular-nums transition-colors hover:border-white/60"
            >
              {phone}
            </a>
          </motion.div>
        </div>

        <WorkHoursDial labels={dialLabels} />
      </div>
    </section>
  );
}
