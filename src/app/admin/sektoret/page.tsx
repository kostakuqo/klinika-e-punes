"use client";

import type { Industry } from "@/lib/content/content-types";
import { defaultSiteContent } from "@/lib/content/default-site-content";
import { loadList, newId, saveList } from "@/lib/admin/admin-content-store";
import { useAdminEditor } from "@/components/admin/use-admin-editor";
import { AdminEditorFrame, ListItemCard, moveItem } from "@/components/admin/admin-editor-frame";
import { LocalizedInput } from "@/components/admin/admin-form-fields";

export default function AdminIndustriesPage() {
  const editor = useAdminEditor(
    () => loadList<Industry>("industries", defaultSiteContent.industries),
    (v) => saveList("industries", v),
  );
  const list = editor.value;

  return (
    <AdminEditorFrame
      title="Sektorët"
      description="Shfaqen në listën lëvizëse të faqes kryesore, te Rreth nesh dhe te Klientët tanë."
      view={{ label: "Klientët tanë (dhe Kreu, Rreth nesh)", href: "/klientet-tane/" }}
      {...editor}
    >
      {list && (
        <>
          {list.map((ind, i) => (
            <ListItemCard
              key={ind.id}
              title={ind.name.sq}
              index={i}
              total={list.length}
              onMove={(from, to) => editor.setValue(moveItem(list, from, to))}
              onRemove={() => editor.setValue(list.filter((x) => x.id !== ind.id))}
            >
              <LocalizedInput
                label="Emri i sektorit"
                value={ind.name}
                onChange={(name) => editor.setValue((prev) => prev.map((x, j) => (j === i ? { ...x, name } : x)))}
              />
            </ListItemCard>
          ))}
          <button
            type="button"
            onClick={() => editor.setValue([...list, { id: newId("sektor"), order: list.length + 1, name: { sq: "", en: "", it: "" } }])}
            className="w-full rounded-[22px] border-2 border-dashed border-[#c6d0dd] bg-white/60 py-5 font-semibold text-steel hover:border-navy hover:text-navy"
          >
            + Shto sektor
          </button>
        </>
      )}
    </AdminEditorFrame>
  );
}
