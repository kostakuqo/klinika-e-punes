"use client";

import { useState, type FormEvent } from "react";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "@/lib/firebase/firebase-client";
import { BrandMark } from "@/components/site/brand-mark";

/** Firebase error codes → Albanian messages that say what to do. */
function messageFor(error: unknown): string {
  const code = error instanceof FirebaseError ? error.code : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email-i ose fjalëkalimi është i gabuar.";
    case "auth/invalid-email":
      return "Shkruani një adresë email të vlefshme.";
    case "auth/too-many-requests":
      return "Shumë përpjekje të gabuara. Provoni përsëri pas disa minutash.";
    case "auth/network-request-failed":
      return "Nuk ka lidhje me internetin. Kontrolloni rrjetin dhe provoni përsëri.";
    case "auth/unauthorized-domain":
      return "Ky domen nuk është i lejuar në Firebase. Shtojeni te Authentication → Settings → Authorized domains.";
    default:
      return "Hyrja dështoi. Provoni përsëri.";
  }
}

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(clientAuth(), email.trim(), password);
    } catch (err) {
      setError(messageFor(err));
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    setError("");
    setNotice("");
    if (!email.trim()) return setError("Shkruani email-in tuaj, pastaj shtypni “Keni harruar fjalëkalimin?”.");
    try {
      await sendPasswordResetEmail(clientAuth(), email.trim());
      setNotice("Nëse ky email ka llogari, ju dërguam një link për të vendosur fjalëkalim të ri.");
    } catch (err) {
      setError(messageFor(err));
    }
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-frost bg-white px-4 py-3 text-ink outline-none transition-shadow focus:border-navy focus:shadow-[0_0_0_4px_var(--color-amber-soft)]";

  return (
    <div className="grid min-h-dvh place-items-center bg-navy-deep px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandMark name="Klinika e Punës" tone="light" />
        </div>
        <form onSubmit={onSubmit} className="rounded-[28px] bg-white p-8 shadow-2xl sm:p-10" noValidate>
          <h1 className="text-2xl font-semibold text-navy">Hyrje në panelin e administrimit</h1>
          <p className="mt-2 text-steel">Përdorni llogarinë e krijuar në Firebase.</p>

          <label className="mt-8 block">
            <span className="text-sm font-medium text-navy">Email</span>
            <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
          </label>
          <label className="mt-5 block">
            <span className="text-sm font-medium text-navy">Fjalëkalimi</span>
            <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
          </label>

          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          {notice && <p role="status" className="mt-5 rounded-xl bg-amber-soft px-4 py-3 text-sm text-navy">{notice}</p>}

          <button
            type="submit"
            disabled={busy || !email || !password}
            className="mt-7 w-full rounded-full bg-navy px-6 py-3.5 font-semibold text-white transition-opacity disabled:opacity-50"
          >
            {busy ? "Duke hyrë…" : "Hyr"}
          </button>
          <button type="button" onClick={onReset} className="mt-4 w-full text-sm text-steel underline-offset-4 hover:text-navy hover:underline">
            Keni harruar fjalëkalimin?
          </button>
        </form>
      </div>
    </div>
  );
}
