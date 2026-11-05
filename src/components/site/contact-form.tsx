"use client";

import { useId, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";

type Source = "contact" | "book";
type Fields = { name: string; company: string; employees: string; phone: string; email: string; message: string; website: string };

const emptyFields: Fields = { name: "", company: "", employees: "", phone: "", email: "", message: "", website: "" };
const errorKey: Record<string, string> = {
  missing: "errMissing",
  contact: "errContact",
  email: "errEmail",
  rate: "errRate",
};

const inputClass =
  "w-full rounded-xl border-2 border-frost bg-white px-4 py-3 text-ink outline-none transition-[border-color,box-shadow] hover:border-[#c6d0dd] focus:border-navy focus:shadow-[0_0_0_4px_var(--color-amber-soft)]";

/** Public contact / booking form. Messages land in Admin → Mesazhet. */
export function ContactForm({ source }: { source: Source }) {
  const t = useTranslations("form");
  const locale = useLocale();
  const id = useId();
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const set = (key: keyof Fields) => (e: { target: { value: string } }) => setFields((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (fields.name.trim().length < 2 || fields.message.trim().length < 5) return setError(t("errMissing"));
    if (!fields.phone.trim() && !fields.email.trim()) return setError(t("errContact"));

    setState("sending");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, source, locale }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(t(errorKey[body.error] ?? "errServer"));
        setState("idle");
        return;
      }
      setState("sent");
      setFields(emptyFields);
    } catch {
      setError(t("errServer"));
      setState("idle");
    }
  }

  const label = (key: string, text: string, optional = false) => (
    <label htmlFor={`${id}-${key}`} className="mb-1.5 block text-sm font-semibold text-navy">
      {text}
      {optional && <span className="font-normal text-steel"> ({t("optional")})</span>}
    </label>
  );

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-frost bg-white p-7 shadow-[0_1px_2px_rgba(14,26,46,0.05)] sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {state === "sent" ? (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-10 text-center"
          >
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber text-3xl text-navy-deep">✓</span>
            <h2 className="mt-6 text-3xl font-semibold text-navy">{t("sentTitle")}</h2>
            <p className="mx-auto mt-3 max-w-sm text-steel">{t("sentText")}</p>
            <button type="button" onClick={() => setState("idle")} className="mt-8 font-semibold text-navy underline decoration-amber decoration-2 underline-offset-6">
              {t("sendAnother")}
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-3xl font-semibold text-navy">{source === "book" ? t("titleBook") : t("title")}</h2>
            <p className="mt-2 text-steel">{t("intro")}</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                {label("name", t("name"))}
                <input id={`${id}-name`} autoComplete="name" required value={fields.name} onChange={set("name")} className={inputClass} />
              </div>
              {source === "book" && (
                <>
                  <div>
                    {label("company", t("company"), true)}
                    <input id={`${id}-company`} autoComplete="organization" value={fields.company} onChange={set("company")} className={inputClass} />
                  </div>
                  <div>
                    {label("employees", t("employees"), true)}
                    <input id={`${id}-employees`} inputMode="numeric" value={fields.employees} onChange={set("employees")} className={inputClass} />
                  </div>
                </>
              )}
              <div>
                {label("phone", t("phone"))}
                <input id={`${id}-phone`} type="tel" autoComplete="tel" value={fields.phone} onChange={set("phone")} className={inputClass} />
              </div>
              <div>
                {label("email", t("email"))}
                <input id={`${id}-email`} type="email" autoComplete="email" value={fields.email} onChange={set("email")} className={inputClass} />
              </div>
              <p className="-mt-2 text-sm text-steel sm:col-span-2">{t("contactHint")}</p>
              <div className="sm:col-span-2">
                {label("message", t("message"))}
                <textarea
                  id={`${id}-message`}
                  rows={5}
                  required
                  placeholder={source === "book" ? t("messageBookHint") : undefined}
                  value={fields.message}
                  onChange={set("message")}
                  className={`${inputClass} resize-y`}
                />
              </div>
              {/* honeypot: hidden from people, bots fill it in */}
              <div aria-hidden className="absolute -left-[9999px]">
                <input tabIndex={-1} autoComplete="off" value={fields.website} onChange={set("website")} />
              </div>
            </div>

            {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

            <button
              type="submit"
              disabled={state === "sending"}
              className="mt-7 w-full rounded-full bg-navy px-7 py-4 font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"
            >
              {state === "sending" ? t("sending") : t("send")}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
