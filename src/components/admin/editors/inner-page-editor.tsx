"use client";

import type { InnerPage, InnerPageId } from "@/lib/content/content-types";
import { defaultSiteContent } from "@/lib/content/default-site-content";
import { loadDocument, saveDocument } from "@/lib/admin/admin-content-store";
import { useAdminEditor } from "../use-admin-editor";
import { AdminEditorFrame } from "../admin-editor-frame";
import { FieldGroup, ImageInput, LocalizedInput, SeoFields, imageSizes } from "../admin-form-fields";

/** Public URL (Albanian) of each inner page, for "Shiko në faqe". */
const publicHref: Record<InnerPageId, string> = {
  about: "/rreth-nesh/",
  services: "/detyrat/",
  doctors: "/mjeket/",
  clients: "/klientet-tane/",
  contact: "/kontakto/",
  book: "/rezervo/",
};

/** Pages whose body text and side image are shown on the site. */
const usesBody: InnerPageId[] = ["about"];

export function InnerPageEditor({ id, title }: { id: InnerPageId; title: string }) {
  const path = `pages/${id}`;
  const editor = useAdminEditor(
    () => loadDocument<InnerPage>(path, defaultSiteContent.pages[id]),
    (v) => saveDocument(path, v),
  );
  const p = editor.value;
  const set = <K extends keyof InnerPage>(key: K, v: InnerPage[K]) => editor.setValue((prev) => ({ ...prev, [key]: v }));

  return (
    <AdminEditorFrame title={title} view={{ label: title, href: publicHref[id] }} {...editor}>
      {p && (
        <>
          <FieldGroup title="Krye e faqes" where={`${title} → pjesa e parë, në krye të faqes`}>
            <ImageInput
              label="Fotoja e sfondit"
              hint="Shfaqet pas titullit, me një shtresë blu sipër që teksti të lexohet. Pa foto, sfondi mbetet blu."
              size={imageSizes.hero}
              value={p.heroImageUrl}
              onChange={(v) => set("heroImageUrl", v)}
            />
            <LocalizedInput label="Titulli" value={p.title} onChange={(v) => set("title", v)} />
            <LocalizedInput label="Teksti nën titull" multiline value={p.intro} onChange={(v) => set("intro", v)} />
          </FieldGroup>

          {usesBody.includes(id) && (
            <FieldGroup title="Përmbajtja" where={`${title} → teksti dhe imazhi poshtë pjesës së parë`}>
              <LocalizedInput
                label="Teksti"
                hint="Lini një rresht bosh mes paragrafëve."
                multiline
                value={p.body}
                onChange={(v) => set("body", v)}
              />
              <ImageInput
                label="Imazhi pranë tekstit"
                hint="Pa imazh, në vend të tij shfaqet thënia e klinikës."
                size={imageSizes.portrait}
                value={p.imageUrl}
                onChange={(v) => set("imageUrl", v)}
              />
            </FieldGroup>
          )}

          <SeoFields value={p.seo} onChange={(v) => set("seo", v)} />
        </>
      )}
    </AdminEditorFrame>
  );
}
