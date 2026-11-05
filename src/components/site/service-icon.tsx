import type { ServiceIcon as IconName } from "@/lib/content/content-types";

const paths: Record<IconName, string> = {
  shield: "M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z M9 12l2 2 4-4",
  gauge: "M4 17a8 8 0 1116 0 M12 17l4-6 M7 17h.01 M17 17h.01",
  pulse: "M3 12h4l2-5 4 10 2-5h6",
  certificate: "M6 3h12v13H6z M9 7h6 M9 10h6 M10 16v5l2-1.5 2 1.5v-5",
  clipboard: "M9 4h6v3H9z M7 5H5v16h14V5h-2 M8 12l2.5 2.5L16 9",
  flask: "M9 3h6 M10 3v6L5 19a1.5 1.5 0 001.3 2h11.4a1.5 1.5 0 001.3-2L14 9V3 M7.5 15h9",
};

/** Line icons the admin can pick from for each service. */
export function ServiceIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={paths[name] ?? paths.shield} />
    </svg>
  );
}
