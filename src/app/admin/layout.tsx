import type { ReactNode } from "react";
import type { Metadata } from "next";
import { familjen, atkinson } from "../site-fonts";
import { AdminAuthProvider } from "@/components/admin/admin-auth-provider";
import { AdminGate } from "@/components/admin/admin-gate";
import { AdminShell } from "@/components/admin/admin-shell";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin – Klinika e Punës",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sq" className={`${familjen.variable} ${atkinson.variable}`}>
      <body className="min-h-dvh bg-clinic">
        <AdminAuthProvider>
          <AdminGate>
            <AdminShell>{children}</AdminShell>
          </AdminGate>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
