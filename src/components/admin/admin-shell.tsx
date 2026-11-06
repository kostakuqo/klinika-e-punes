"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { BrandMark } from "@/components/site/brand-mark";
import { useAdminAuth } from "./admin-auth-provider";
import { useUnreadMessages } from "./use-unread-messages";

export const adminSections = [
  { href: "/admin/mesazhet/", title: "Mesazhet", text: "Mesazhet dhe kërkesat për rezervim nga formulari i faqes." },
  { href: "/admin/promocionet/", title: "Promocionet", text: "Dritarja me oferta që hapet në faqen kryesore." },
  { href: "/admin/faqet/", title: "Faqet", text: "Tekstet e çdo faqeje në shqip, anglisht dhe italisht, dhe SEO." },
  { href: "/admin/detyrat/", title: "Detyrat", text: "Shërbimet që shfaqen në faqen kryesore dhe te Detyrat." },
  { href: "/admin/mjeket/", title: "Mjekët", text: "Profilet e mjekëve me foto." },
  { href: "/admin/sektoret/", title: "Sektorët", text: "Industritë që shfaqen te Klientët tanë." },
  { href: "/admin/cilesimet/", title: "Cilësimet", text: "Telefoni, email-i, adresa, orari, rrjetet sociale dhe logoja." },
];

/** Sidebar navigation + top bar for every admin page. */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const unread = useUnreadMessages();

  const nav = (
    <nav aria-label="Admin">
      <ul className="space-y-1">
        <li>
          <NavLink href="/admin/" active={pathname === "/admin/" || pathname === "/admin"} onClick={() => setOpen(false)}>Paneli</NavLink>
        </li>
        {adminSections.map((s) => (
          <li key={s.href}>
            <NavLink href={s.href} active={pathname.startsWith(s.href.replace(/\/$/, ""))} onClick={() => setOpen(false)}>
              {s.title}
              {s.href === "/admin/mesazhet/" && unread > 0 && (
                <span className="ml-auto rounded-full bg-amber px-2 py-0.5 text-xs font-bold text-navy-deep" aria-label={`${unread} të palexuara`}>{unread}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-[#eef2f7]">
      {/* sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-navy-deep p-5 text-white lg:flex">
        <Link href="/admin/" className="mb-8 px-3 pt-2"><BrandMark name="Klinika e Punës" tone="light" /></Link>
        {nav}
        <div className="mt-auto space-y-3 px-3">
          <a href="/" target="_blank" rel="noopener" className="block text-sm text-white/70 hover:text-white">Shiko faqen ↗</a>
          <p className="truncate text-xs text-white/50">{user?.email}</p>
          <button onClick={logout} className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-white/60">Dil</button>
        </div>
      </aside>

      {/* mobile top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-navy-deep px-4 text-white lg:hidden">
        <Link href="/admin/"><BrandMark name="Klinika e Punës" tone="light" /></Link>
        <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="rounded-full border border-white/20 px-4 py-2 text-sm">
          {open ? "Mbyll" : unread > 0 ? `Menuja (${unread})` : "Menuja"}
        </button>
      </header>
      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 space-y-6 overflow-y-auto bg-navy-deep p-5 text-white lg:hidden">
          {nav}
          <button onClick={logout} className="rounded-full border border-white/20 px-4 py-2 text-sm">Dil</button>
        </div>
      )}

      <main className="px-4 py-10 sm:px-8 lg:ml-64">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, active, onClick, children }: { href: string; active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors",
        active ? "bg-white/10 font-semibold text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}
