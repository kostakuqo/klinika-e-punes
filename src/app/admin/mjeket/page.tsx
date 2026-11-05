"use client";

import type { Doctor } from "@/lib/content/content-types";
import { defaultSiteContent } from "@/lib/content/default-site-content";
import { loadList, newId, saveList } from "@/lib/admin/admin-content-store";
import { useAdminEditor } from "@/components/admin/use-admin-editor";
import { AdminEditorFrame, ListItemCard, moveItem } from "@/components/admin/admin-editor-frame";
import { ImageInput, LocalizedInput, TextInput, imageSizes } from "@/components/admin/admin-form-fields";

const empty = { sq: "", en: "", it: "" };

export default function AdminDoctorsPage() {
  const editor = useAdminEditor(
    () => loadList<Doctor>("doctors", defaultSiteContent.doctors),
    (v) => saveList("doctors", v),
  );
  const list = editor.value;
  const update = (i: number, patch: Partial<Doctor>) =>
    editor.setValue((prev) => prev.map((d, j) => (j === i ? { ...d, ...patch } : d)));

  return (
    <AdminEditorFrame
      title="Mjekët"
      description="Faqja kryesore shfaq 4 mjekët e parë; faqja Mjekët i shfaq të gjithë. Pa asnjë mjek, seksioni fshihet."
      view={{ label: "Mjekët (dhe Kreu)", href: "/mjeket/" }}
      {...editor}
    >
      {list && (
        <>
          {list.length === 0 && (
            <p className="rounded-[22px] border border-[#d5dde8] bg-white p-8 text-steel">
              Ende nuk ka mjekë. Shtoni të parin me butonin më poshtë.
            </p>
          )}
          {list.map((d, i) => (
            <ListItemCard
              key={d.id}
              title={d.name}
              index={i}
              total={list.length}
              onMove={(from, to) => editor.setValue(moveItem(list, from, to))}
              onRemove={() => editor.setValue(list.filter((x) => x.id !== d.id))}
            >
              <ImageInput label="Fotoja" hint="Portret me sfond të thjeshtë, fytyra në qendër." size={imageSizes.portrait} value={d.photoUrl} onChange={(photoUrl) => update(i, { photoUrl })} />
              <TextInput label="Emri dhe mbiemri" hint="P.sh. Dr. Arben Hoxha" value={d.name} onChange={(name) => update(i, { name })} />
              <LocalizedInput label="Funksioni" hint="P.sh. Mjek i punës" value={d.role} onChange={(role) => update(i, { role })} />
              <LocalizedInput label="Përshkrimi" hint="Shfaqet vetëm te faqja Mjekët." multiline value={d.bio} onChange={(bio) => update(i, { bio })} />
            </ListItemCard>
          ))}
          <button
            type="button"
            onClick={() =>
              editor.setValue([...list, { id: newId("mjek"), order: list.length + 1, name: "", role: { ...empty }, bio: { ...empty }, photoUrl: "" }])
            }
            className="w-full rounded-[22px] border-2 border-dashed border-[#c6d0dd] bg-white/60 py-5 font-semibold text-steel hover:border-navy hover:text-navy"
          >
            + Shto mjek
          </button>
        </>
      )}
    </AdminEditorFrame>
  );
}
