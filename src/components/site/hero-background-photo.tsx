"use client";

import { motion, useReducedMotion } from "framer-motion";
import { optimizedImageUrl } from "@/lib/cloudinary-image-url";

/**
 * Full-bleed photo behind a hero. A navy gradient sits on top (solid on the
 * text side, lighter on the right) so white text stays readable on any photo.
 * The photo settles from a slight zoom when the page opens.
 */
export function HeroBackgroundPhoto({ url }: { url: string }) {
  const reduce = useReducedMotion();
  if (!url) return null;

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <motion.img
        src={optimizedImageUrl(url, 2000)}
        alt=""
        fetchPriority="high"
        className="size-full object-cover"
        initial={reduce ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(12,27,51,0.95)_0%,rgba(12,27,51,0.86)_45%,rgba(12,27,51,0.55)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-deep/70 to-transparent" />
    </div>
  );
}
