"use client";

import Link from "next/link";
import { adminSections } from "@/components/admin/admin-shell";

export default function AdminHomePage() {
  return (
    <>
      <h1 className="text-3xl font-semibold text-navy">Mirë se vini</h1>
      <p className="mt-2 text-steel">
        Zgjidhni çfarë doni të ndryshoni. Pasi të shtypni “Ruaj ndryshimet”, ndryshimi shfaqet në faqe brenda pak sekondave.
      </p>

      <ul className="mt-10 grid gap-px overflow-hidden rounded-[24px] border border-frost bg-frost sm:grid-cols-2">
        {adminSections.map((s) => (
          <li key={s.href} className="bg-white">
            <Link href={s.href} className="group block h-full p-7 transition-colors hover:bg-navy">
              <h2 className="text-xl font-semibold text-navy group-hover:text-white">{s.title}</h2>
              <p className="mt-2 text-steel group-hover:text-white/75">{s.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
