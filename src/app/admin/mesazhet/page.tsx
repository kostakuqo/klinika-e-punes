"use client";

import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, type Timestamp } from "firebase/firestore";
import { clientDb } from "@/lib/firebase/firebase-client";
import type { Locale } from "@/i18n/routing";
import { languageLabels } from "@/components/site/language-flag";

type Message = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  employees: string;
  message: string;
  source: "contact" | "book";
  locale: Locale;
  read: boolean;
  createdAt?: Timestamp | null;
};

const dateFormat = new Intl.DateTimeFormat("sq-AL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** WhatsApp link from a phone number written any way ("069 91 92 613" → 35569…). */
function whatsappLink(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `355${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

/** Inbox for the Kontakto / Rezervo form: one card per message, newest first, live updates. */
export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    const q = query(collection(clientDb(), "messages"), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) => setMessages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) }))),
      () => setError("Mesazhet nuk u ngarkuan. Rifreskoni faqen."),
    );
  }, []);

  const unread = messages?.filter((m) => !m.read).length ?? 0;
  const shown = useMemo(() => (filter === "unread" ? (messages ?? []).filter((m) => !m.read) : (messages ?? [])), [messages, filter]);

  const setRead = (m: Message, read: boolean) => updateDoc(doc(clientDb(), "messages", m.id), { read }).catch(() => {});

  async function remove(m: Message) {
    if (!window.confirm(`Ta fshij mesazhin nga ${m.name}? Nuk mund të rikthehet.`)) return;
    await deleteDoc(doc(clientDb(), "messages", m.id));
  }

  const tab = (key: "all" | "unread", label: string) => (
    <button
      role="tab"
      aria-selected={filter === key}
      onClick={() => setFilter(key)}
      className={clsx(
        "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
        filter === key ? "border-navy bg-navy text-white" : "border-[#c6d0dd] bg-white text-navy hover:border-navy",
      )}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-navy">Mesazhet</h1>
        <div role="tablist" className="flex gap-2">
          {tab("all", `Të gjitha (${messages?.length ?? 0})`)}
          {tab("unread", `Të palexuara (${unread})`)}
        </div>
      </div>
      <p className="mt-2 max-w-2xl text-steel">
        Nga formulari te faqet Kontakto dhe Rezervo. Mesazhet e reja shfaqen vetë, pa rifreskuar faqen.
      </p>

      <div className="mt-8 space-y-4">
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-red-800">{error}</p>}
        {!messages && !error && (
          <div className="grid h-40 place-items-center" role="status" aria-label="Duke u ngarkuar">
            <span className="size-9 animate-spin rounded-full border-4 border-navy/15 border-t-navy" />
          </div>
        )}
        {messages && shown.length === 0 && (
          <p className="rounded-[18px] border border-[#d5dde8] bg-white p-10 text-center text-steel">
            {filter === "unread" ? "Nuk ka mesazhe të palexuara." : "Ende nuk ka mesazhe. Kur dikush plotëson formularin, mesazhi shfaqet këtu."}
          </p>
        )}

        {shown.map((m) => {
          const date = m.createdAt ? dateFormat.format(m.createdAt.toDate()) : "tani";
          return (
            <article
              key={m.id}
              className={clsx(
                "rounded-[18px] border border-[#d5dde8] bg-white p-6 shadow-[0_1px_2px_rgba(14,26,46,0.04)]",
                !m.read && "border-l-4 border-l-navy",
              )}
            >
              <header className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-navy">{m.name}</h2>
                {!m.read && <span className="rounded-full bg-navy px-2 py-0.5 text-xs font-semibold text-white">I ri</span>}
                <span className={clsx("rounded-full px-2.5 py-0.5 text-xs font-semibold", m.source === "book" ? "bg-amber text-navy-deep" : "bg-[#eef2f7] text-navy")}>
                  {m.source === "book" ? "Rezervim" : "Kontakt"}
                </span>
                {m.company && <span className="rounded-full bg-[#eef2f7] px-2.5 py-0.5 text-xs font-semibold text-navy">{m.company}</span>}
                {m.employees && <span className="rounded-full bg-[#eef2f7] px-2.5 py-0.5 text-xs font-semibold text-navy">{m.employees} punonjës</span>}
                <span className="rounded-full bg-[#eef2f7] px-2.5 py-0.5 text-xs font-semibold text-navy">{languageLabels[m.locale ?? "sq"]}</span>
                <span className="text-sm text-steel tabular-nums">{date}</span>
              </header>

              {(m.email || m.phone) && (
                <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  {m.email && <a href={`mailto:${m.email}`} className="text-navy underline underline-offset-2 hover:decoration-amber">{m.email}</a>}
                  {m.phone && <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="text-navy underline underline-offset-2 tabular-nums hover:decoration-amber">{m.phone}</a>}
                </p>
              )}

              <p className="mt-4 whitespace-pre-line leading-relaxed text-ink">{m.message}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {m.email ? (
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent("Klinika e Punës")}`}
                    onClick={() => setRead(m, true)}
                    className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Përgjigju
                  </a>
                ) : m.phone ? (
                  <a href={`tel:${m.phone.replace(/\s/g, "")}`} onClick={() => setRead(m, true)} className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white">
                    Telefono
                  </a>
                ) : null}
                {m.phone && (
                  <a href={whatsappLink(m.phone)} target="_blank" rel="noopener noreferrer" onClick={() => setRead(m, true)} className="rounded-xl border border-[#c6d0dd] px-5 py-2.5 text-sm font-semibold text-navy hover:border-navy">
                    WhatsApp
                  </a>
                )}
                <button onClick={() => setRead(m, !m.read)} className="rounded-xl border border-[#c6d0dd] px-5 py-2.5 text-sm font-semibold text-navy hover:border-navy">
                  {m.read ? "Shëno si të palexuar" : "Shëno si të lexuar"}
                </button>
                <button onClick={() => remove(m)} className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50">
                  Fshi
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
