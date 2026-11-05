"use client";

import Link from "next/link";
import { adminPages } from "@/components/admin/admin-page-list";


export default function AdminPagesListPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold text-navy">Faqet</h1>
      <p className="mt-2 text-steel">Zgjidhni faqen që doni të ndryshoni.</p>
      <ul className="mt-8 divide-y divide-frost overflow-hidden rounded-[22px] border border-frost bg-white">
        {adminPages.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/faqet/${p.id}/`} className="flex items-center justify-between gap-4 p-6 hover:bg-clinic">
              <span>
                <span className="block text-lg font-semibold text-navy">{p.title}</span>
                <span className="text-sm text-steel">{p.text}</span>
              </span>
              <span aria-hidden className="text-steel">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
