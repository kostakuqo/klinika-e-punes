import type { ReactNode } from "react";

// The real <html> lives in app/[locale]/layout.tsx so it can set lang="sq|en|it".
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
