"use client";

import type { ReactNode } from "react";
import { clsx } from "clsx";
import type { EditorStatus } from "./use-admin-editor";

const statusText: Record<EditorStatus, string> = {
  loading: "",
  ready: "",
  saving: "Duke ruajtur…",
  saved: "U ruajt. Ndryshimet janë në faqe.",
  error: "",
};

/**
 * Page title, the editor's fields, and a save bar fixed to the bottom of
 * the screen so "Ruaj" is always in reach.
 */
export function AdminEditorFrame({
  title,
  description,
  view,
  status,
  error,
  dirty,
  onSave,
  children,
}: {
  title: string;
  description?: string;
  /** Public page where these changes appear, e.g. { label: "Kreu", href: "/" } */
  view?: { label: string; href: string };
  status: EditorStatus;
  error: string;
  dirty: boolean;
  onSave: () => void;
  children: ReactNode;
}) {
  return (
    <div className="pb-28">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-navy">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-steel">{description}</p>}
        </div>
        {view && (
          <a
            href={view.href}
            target="_blank"
            rel="noopener"
            className="shrink-0 rounded-full border-2 border-navy px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Shiko në faqe ↗
          </a>
        )}
      </div>
      {view && (
        <p className="mt-4 rounded-xl border border-[#d5dde8] bg-white px-4 py-3 text-sm text-navy">
          Ndryshimet që bëni këtu shfaqen në faqen <strong>{view.label}</strong> (<code className="text-steel">{view.href}</code>), në të tre gjuhët.
        </p>
      )}

      <div className="mt-8">
        {status === "loading" ? (
          <div className="grid h-48 place-items-center" role="status" aria-label="Duke u ngarkuar">
            <span className="size-9 animate-spin rounded-full border-4 border-navy/15 border-t-navy" />
          </div>
        ) : (
          <div className="space-y-6">{children}</div>
        )}
      </div>

      {status !== "loading" && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-[#d5dde8] bg-white/95 shadow-[0_-4px_16px_rgba(14,26,46,0.06)] backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
            <p role="status" className={clsx("text-sm", status === "error" ? "text-red-700" : "text-steel")}>
              {status === "error" ? error : dirty ? "Keni ndryshime të paruajtura." : statusText[status]}
            </p>
            <button
              type="button"
              onClick={onSave}
              disabled={!dirty || status === "saving"}
              className="shrink-0 rounded-full bg-amber px-7 py-3 font-semibold text-navy-deep transition-opacity disabled:opacity-40"
            >
              {status === "saving" ? "Duke ruajtur…" : "Ruaj ndryshimet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Card wrapper for one item in a list editor, with move and delete buttons. */
export function ListItemCard({
  title,
  index,
  total,
  onMove,
  onRemove,
  children,
}: {
  title: string;
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  children: ReactNode;
}) {
  const btn = "grid size-9 place-items-center rounded-full border-2 border-[#c6d0dd] text-steel hover:border-navy hover:text-navy disabled:opacity-30";
  return (
    <article className="rounded-[22px] border border-[#d5dde8] bg-white p-6 shadow-[0_1px_2px_rgba(14,26,46,0.05)] sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="truncate text-lg font-semibold text-navy">
          <span className="mr-2 text-steel tabular-nums">{index + 1}.</span>
          {title || "Pa titull"}
        </h2>
        <div className="flex shrink-0 gap-1.5">
          <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="Lëvize lart">↑</button>
          <button type="button" className={btn} disabled={index === total - 1} onClick={() => onMove(index, index + 1)} aria-label="Lëvize poshtë">↓</button>
          <button
            type="button"
            className={clsx(btn, "hover:border-red-200 hover:text-red-700")}
            onClick={() => window.confirm(`Ta fshij “${title || "këtë element"}”? Ndryshimi bëhet pasi të shtypni Ruaj.`) && onRemove()}
            aria-label="Fshi"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </article>
  );
}

/** Immutable move helper for list editors. */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
