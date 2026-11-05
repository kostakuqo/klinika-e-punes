"use client";

import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";

const C = 200; // centre
const R = 128; // ring radius
const WORK_START = 9;
const WORK_END = 17;

/** 24h clock: noon at the top, hours run clockwise, so the work day sits on top. */
function point(hour: number, radius: number) {
  const a = ((hour - 12) / 24) * Math.PI * 2 - Math.PI / 2;
  return { x: C + radius * Math.cos(a), y: C + radius * Math.sin(a) };
}

function arc(from: number, to: number, radius: number) {
  const s = point(from, radius);
  const e = point(to, radius);
  const large = (to - from) / 24 > 0.5 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
}

/**
 * The hero's signature moment: a 24-hour dial whose work-day segment
 * (09:00–17:00) fills in hi-vis amber while the counter climbs to 8.
 */
export function WorkHoursDial({ labels }: { labels: { hours: string; work: string; day: string } }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? 8 : 0);
  const delay = 0.7;
  const duration = 1.8;

  useEffect(() => {
    if (reduce) return;
    const controls = animate(0, 8, {
      delay,
      duration,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [reduce]);

  const ticks = Array.from({ length: 24 }, (_, h) => h);
  // the hand is drawn pointing at noon (top); rotate it to the hour
  const hand = { from: ((WORK_START - 12) / 24) * 360, to: ((WORK_END - 12) / 24) * 360 };

  return (
    <figure className="relative mx-auto w-full max-w-[460px]">
      <svg viewBox="0 0 400 400" className="w-full" role="img" aria-label={`8 ${labels.hours} ${labels.work}, ${labels.day}`}>
        {/* faint outer rings */}
        <circle cx={C} cy={C} r={196} fill="none" stroke="white" strokeOpacity=".06" />
        <circle cx={C} cy={C} r={R} fill="none" stroke="white" strokeOpacity=".1" strokeWidth="22" />

        {/* hour ticks */}
        {ticks.map((h) => {
          const major = h % 6 === 0;
          const a = point(h, R + (major ? 26 : 22));
          const b = point(h, R + 32);
          const inWork = h >= WORK_START && h <= WORK_END;
          return (
            <motion.line
              key={h}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={inWork ? "var(--color-amber)" : "white"}
              strokeOpacity={inWork ? 0.9 : major ? 0.6 : 0.25}
              strokeWidth={major ? 2.5 : 1.5}
              strokeLinecap="round"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + h * 0.02, duration: 0.4 }}
            />
          );
        })}

        {/* hour numerals */}
        {[0, 6, 12, 18].map((h) => {
          const p = point(h, R + 48);
          return (
            <text key={h} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fill="white" fillOpacity=".55" fontSize="13" className="font-body tabular-nums">
              {String(h).padStart(2, "0")}
            </text>
          );
        })}

        {/* the work-day arc */}
        <motion.path
          d={arc(WORK_START, WORK_END, R)}
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth="22"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay, duration, ease: [0.65, 0, 0.35, 1] }}
        />

        {/* sweeping hand */}
        <motion.g
          initial={reduce ? { rotate: hand.to } : { rotate: hand.from, opacity: 0 }}
          animate={{ rotate: hand.to, opacity: 1 }}
          transition={{ rotate: { delay, duration, ease: [0.65, 0, 0.35, 1] }, opacity: { delay: delay - 0.2, duration: 0.3 } }}
        >
          {/* invisible full circle keeps the group's box centred on the dial, so it rotates around C */}
          <circle cx={C} cy={C} r={R + 8} fill="none" />
          <line x1={C} y1={C} x2={C} y2={C - R + 18} stroke="white" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="2 5" />
          <circle cx={C} cy={C - R} r="7" fill="var(--color-navy-deep)" stroke="white" strokeWidth="3" />
        </motion.g>

        {/* centre readout */}
        <text x={C} y={C + 18} textAnchor="middle" fill="white" fontSize="96" fontWeight="600" className="font-display tabular-nums" letterSpacing="-4">
          {count}
        </text>
        <text x={C} y={C + 52} textAnchor="middle" fill="white" fontSize="17" className="font-display">
          {labels.hours} {labels.work}
        </text>
        <text x={C} y={C + 74} textAnchor="middle" fill="white" fillOpacity=".55" fontSize="12.5" className="font-body">
          {labels.day}
        </text>
      </svg>
    </figure>
  );
}
