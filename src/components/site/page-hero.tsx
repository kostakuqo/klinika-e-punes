"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HeroBackgroundPhoto } from "./hero-background-photo";

/** Navy title band at the top of every inner page. */
export function PageHero({ title, intro, imageUrl = "" }: { title: string; intro?: string; imageUrl?: string }) {
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;
  return (
    <section className="relative overflow-hidden bg-navy-deep text-white">
      <HeroBackgroundPhoto url={imageUrl} />
      <div className="relative mx-auto max-w-7xl px-4 pt-36 pb-16 sm:px-6 md:pt-44 md:pb-24 lg:px-8">
        <motion.h1
          className="max-w-4xl text-[clamp(2.4rem,6vw,4.75rem)] leading-[1.02] font-semibold"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          {title}
        </motion.h1>
        {intro && (
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/72 sm:text-xl"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease }}
          >
            {intro}
          </motion.p>
        )}
        <motion.span
          aria-hidden
          className="mt-12 block h-1.5 w-24 origin-left rounded-full bg-amber"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.9, ease }}
        />
      </div>
    </section>
  );
}
