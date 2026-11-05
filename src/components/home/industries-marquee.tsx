/** Endless band of the sectors the clinic serves. Pauses on hover. */
export function IndustriesMarquee({ items }: { items: string[] }) {
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((name, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span className="px-7 font-display text-[clamp(1.75rem,3.6vw,3rem)] font-medium text-navy">{name}</span>
          <span aria-hidden className="size-3 rotate-45 bg-amber" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="marquee-track flex w-max">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
