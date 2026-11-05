"use client";

import type { ReactNode } from "react";
import { useAdminAuth } from "./admin-auth-provider";
import { AdminLoginForm } from "./admin-login-form";

/** Shows the login form until the visitor is a signed-in admin. */
export function AdminGate({ children }: { children: ReactNode }) {
  const { status, user, logout } = useAdminAuth();

  if (status === "loading") {
    return (
      <div className="grid min-h-dvh place-items-center bg-navy-deep" role="status" aria-label="Duke u ngarkuar">
        <span className="size-10 animate-spin rounded-full border-4 border-white/15 border-t-amber" />
      </div>
    );
  }

  if (status === "unconfigured") {
    return (
      <Notice title="Firebase nuk është konfiguruar">
        Plotësoni variablat <code>NEXT_PUBLIC_FIREBASE_*</code> në <code>.env.local</code> dhe rinisni serverin.
      </Notice>
    );
  }

  if (status === "signed-out") return <AdminLoginForm />;

  if (status === "not-admin") {
    return (
      <Notice title="Kjo llogari nuk ka të drejta administrimi">
        Jeni futur si <strong>{user?.email}</strong>, por nuk ka dokument për këtë përdorues te koleksioni{" "}
        <code>admins</code> në Firestore. ID-ja e dokumentit duhet të jetë UID-ja e përdoruesit:
        <code className="mt-3 block rounded-lg bg-frost px-3 py-2 break-all">{user?.uid}</code>
        <button onClick={logout} className="mt-6 rounded-full bg-navy px-6 py-3 font-semibold text-white">
          Dil
        </button>
      </Notice>
    );
  }

  return <>{children}</>;
}

function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-navy-deep px-4">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 sm:p-10">
        <h1 className="text-2xl font-semibold text-navy">{title}</h1>
        <div className="mt-3 leading-relaxed text-steel">{children}</div>
      </div>
    </div>
  );
}
