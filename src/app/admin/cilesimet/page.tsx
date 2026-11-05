"use client";

import type { SiteSettings } from "@/lib/content/content-types";
import { defaultSiteContent } from "@/lib/content/default-site-content";
import { loadDocument, saveDocument } from "@/lib/admin/admin-content-store";
import { useAdminEditor } from "@/components/admin/use-admin-editor";
import { AdminEditorFrame } from "@/components/admin/admin-editor-frame";
import { FieldGroup, ImageInput, LocalizedInput, TextInput, imageSizes } from "@/components/admin/admin-form-fields";

const PATH = "settings/general";

export default function AdminSettingsPage() {
  const editor = useAdminEditor(
    () => loadDocument<SiteSettings>(PATH, defaultSiteContent.settings),
    (v) => saveDocument(PATH, v),
  );
  const s = editor.value;
  const set = <K extends keyof SiteSettings>(key: K, v: SiteSettings[K]) => editor.setValue((prev) => ({ ...prev, [key]: v }));

  return (
    <AdminEditorFrame
      title="Cilësimet"
      description="Të dhënat e kontaktit dhe logoja e klinikës."
      view={{ label: "Kontakto (dhe në fund të çdo faqeje)", href: "/kontakto/" }}
      {...editor}
    >
      {s && (
        <>
          <FieldGroup title="Kontakti" where="krye e faqes (telefoni), fundi i çdo faqeje dhe faqja Kontakto">
            <TextInput label="Emri i klinikës" value={s.name} onChange={(v) => set("name", v)} />
            <TextInput label="Telefoni" hint="Si shfaqet në faqe, p.sh. +355 69 91 92 613" value={s.phone} onChange={(v) => set("phone", v)} />
            <TextInput label="Email" type="email" value={s.email} onChange={(v) => set("email", v)} />
            <LocalizedInput label="Adresa" value={s.address} onChange={(v) => set("address", v)} />
            <LocalizedInput
              label="Orari"
              hint="Një rresht për çdo ditë ose grup ditësh. Bosh = nuk shfaqet."
              multiline
              value={s.hours}
              onChange={(v) => set("hours", v)}
            />
            <TextInput
              label="Kërkimi në hartë"
              hint="Teksti që kërkohet në Google Maps për hartën te Kontakto."
              value={s.mapQuery}
              onChange={(v) => set("mapQuery", v)}
            />
          </FieldGroup>

          <FieldGroup title="Rrjetet sociale" where="fundi i çdo faqeje" description="Lini bosh ato që nuk i përdorni; nuk shfaqen në faqe.">
            <TextInput label="Facebook" type="url" value={s.facebook} onChange={(v) => set("facebook", v)} />
            <TextInput label="Instagram" type="url" value={s.instagram} onChange={(v) => set("instagram", v)} />
            <TextInput label="LinkedIn" type="url" value={s.linkedin} onChange={(v) => set("linkedin", v)} />
          </FieldGroup>

          <FieldGroup title="Logoja" where="krye dhe fundi i çdo faqeje" description="Pa logo, faqja përdor shenjën me orën. Logoja shfaqet mbi blu (në krye dhe në fund) dhe mbi të bardhë kur vizitori zbret poshtë faqes, prandaj zgjidhni një logo që lexohet mirë në të dy sfondet.">
            <ImageInput label="Logoja e klinikës" size={imageSizes.logo} value={s.logoUrl} onChange={(v) => set("logoUrl", v)} />
          </FieldGroup>
        </>
      )}
    </AdminEditorFrame>
  );
}
