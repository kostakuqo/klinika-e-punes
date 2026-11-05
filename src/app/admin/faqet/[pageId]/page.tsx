"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { InnerPageId } from "@/lib/content/content-types";
import { adminPages } from "@/components/admin/admin-page-list";
import { HomePageEditor } from "@/components/admin/editors/home-page-editor";
import { InnerPageEditor } from "@/components/admin/editors/inner-page-editor";

export default function AdminEditPage() {
  const { pageId } = useParams<{ pageId: string }>();
  const page = adminPages.find((p) => p.id === pageId);

  return (
    <>
      <Link href="/admin/faqet/" className="mb-6 inline-block text-sm text-steel hover:text-navy">← Të gjitha faqet</Link>
      {!page ? (
        <p className="text-steel">Kjo faqe nuk ekziston.</p>
      ) : page.id === "kreu" ? (
        <HomePageEditor />
      ) : (
        <InnerPageEditor key={page.id} id={page.id as InnerPageId} title={page.title} />
      )}
    </>
  );
}
