"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { BrandMark } from "./brand-mark";
import { LanguageSwitcher } from "./language-switcher";

const navItems: { href: AppPathname; key: string }[] = [
  { href: "/", key: "home" },
  { href: "/rreth-nesh", key: "about" },
  { href: "/detyrat", key: "services" },
  { href: "/mjeket", key: "doctors" },
  { href: "/klientet-tane", key: "clients" },
  { href: "/kontakto", key: "contact" },
];

/**
 * Every page opens on a navy band, so the header starts in light tone and
 * turns into a white bar once the visitor scrolls past it.
 */
export function SiteHeader({ name, logoUrl, phone }: { name: string; logoUrl: string; phone: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // The active link is marked only in the browser: on translated URLs
  // (/en/about) the server and the browser resolve the pathname differently.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const light = !scrolled && !open;

  return (
    <>
      <a href="#content" className="sr-only z-[60] rounded bg-amber px-4 py-2 text-navy-deep focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        {t("skip")}
      </a>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled && !open && "bg-white/85 shadow-[0_1px_0_var(--color-frost)] backdrop-blur-xl",
        )}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="relative z-10" aria-label={name}>
            <BrandMark name={name} logoUrl={logoUrl} tone={light || open ? "light" : "dark"} />
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = mounted && pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={clsx(
                        "relative rounded-full px-3.5 py-2 text-[0.95rem] whitespace-nowrap transition-colors",
                        light ? "text-white/80 hover:text-white" : "text-steel hover:text-navy",
                        active && (light ? "text-white" : "text-navy"),
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className={clsx("absolute inset-0 -z-10 rounded-full", light ? "bg-white/12" : "bg-navy/6")}
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher tone={light || open ? "light" : "dark"} />
            </div>
            <Link
              href="/rezervo"
              className="hidden rounded-full bg-amber px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-navy-deep transition-transform duration-300 hover:-translate-y-0.5 md:inline-block"
            >
              {t("book")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("close") : t("menu")}
              className={clsx("grid size-11 place-items-center rounded-full xl:hidden", light || open ? "text-white" : "text-navy")}
            >
              <span className="relative block h-3 w-6">
                <motion.span
                  className="absolute left-0 h-0.5 w-6 rounded bg-current"
                  animate={open ? { top: 5, rotate: 45 } : { top: 0, rotate: 0 }}
                />
                <motion.span
                  className="absolute left-0 h-0.5 w-6 rounded bg-current"
                  animate={open ? { top: 5, rotate: -45 } : { top: 10, rotate: 0 }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-navy-deep px-6 pt-28 pb-10 text-white xl:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link href={item.href} className="block py-2 font-display text-4xl font-medium">
                      {t(item.key)}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto space-y-6">
              <LanguageSwitcher tone="light" />
              <div className="flex flex-col gap-3">
                <Link href="/rezervo" className="rounded-full bg-amber px-6 py-4 text-center font-semibold text-navy-deep">
                  {t("book")}
                </Link>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="rounded-full border border-white/20 px-6 py-4 text-center">
                  {phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
