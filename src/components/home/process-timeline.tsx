"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

type Step = { title: string; text: string };

/**
 * An employee's path through occupational care. The steps really are a
 * sequence, so they are numbered, and an amber line fills as you scroll.
 */
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <ol ref={ref} className="relative space-y-12 pl-16 sm:pl-20">
      <span aria-hidden className="absolute top-2 bottom-2 left-[1.45rem] w-px bg-white/15 sm:left-[1.95rem]" />
      <motion.span
        aria-hidden
        className="absolute top-2 left-[1.45rem] w-px bg-amber sm:left-[1.95rem]"
        style={{ height: reduce ? "100%" : height }}
      />
      {steps.map((step, i) => (
        <motion.li
          key={i}
          className="relative"
          initial={reduce ? false : { opacity: 0.35 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-45% 0px -45% 0px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="absolute top-0 -left-16 grid size-12 place-items-center rounded-full border border-white/20 bg-navy-deep font-display text-lg font-semibold text-amber tabular-nums sm:-left-20 sm:size-16 sm:text-xl">
            {i + 1}
          </span>
          <h3 className="pt-2 text-2xl font-semibold sm:pt-3.5 sm:text-[1.7rem]">{step.title}</h3>
          <p className="mt-3 max-w-lg text-lg leading-relaxed text-white/68">{step.text}</p>
        </motion.li>
      ))}
    </ol>
  );
}
