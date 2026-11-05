"use client";

import type { Service, ServiceIcon as IconName } from "@/lib/content/content-types";
import { defaultSiteContent } from "@/lib/content/default-site-content";
import { loadList, newId, saveList } from "@/lib/admin/admin-content-store";
import { useAdminEditor } from "@/components/admin/use-admin-editor";
import { AdminEditorFrame, ListItemCard, moveItem } from "@/components/admin/admin-editor-frame";
import { LocalizedInput, SelectInput } from "@/components/admin/admin-form-fields";
import { ServiceIcon } from "@/components/site/service-icon";

const icons: { value: IconName; label: string }[] = [
  { value: "shield", label: "Mburojë (parandalim)" },
  { value: "gauge", label: "Matës (vlerësim)" },
  { value: "pulse", label: "Puls (mbikëqyrje)" },
  { value: "certificate", label: "Certifikatë" },
  { value: "clipboard", label: "Listë kontrolli" },
  { value: "flask", label: "Laborator" },
];
const empty = { sq: "", en: "", it: "" };

export default function AdminServicesPage() {
  const editor = useAdminEditor(
    () => loadList<Service>("services", defaultSiteContent.services),
    (v) => saveList("services", v),
  );
  const list = editor.value;
  const update = (i: number, patch: Partial<Service>) =>
    editor.setValue((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  return (
    <AdminEditorFrame
      title="Detyrat"
      description="Shfaqen në faqen kryesore dhe te faqja Detyrat, në këtë rend."
      view={{ label: "Detyrat (dhe Kreu)", href: "/detyrat/" }}
      {...editor}
    >
      {list && (
        <>
          {list.map((s, i) => (
            <ListItemCard
              key={s.id}
              title={s.title.sq}
              index={i}
              total={list.length}
              onMove={(from, to) => editor.setValue(moveItem(list, from, to))}
              onRemove={() => editor.setValue(list.filter((x) => x.id !== s.id))}
            >
              <div className="flex items-end gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-amber-soft text-navy">
                  <ServiceIcon name={s.icon} className="size-6" />
                </span>
                <div className="flex-1">
                  <SelectInput label="Ikona" value={s.icon} options={icons} onChange={(icon) => update(i, { icon })} />
                </div>
              </div>
              <LocalizedInput label="Titulli" value={s.title} onChange={(title) => update(i, { title })} />
              <LocalizedInput label="Përshkrimi" multiline value={s.text} onChange={(text) => update(i, { text })} />
            </ListItemCard>
          ))}
          <button
            type="button"
            onClick={() =>
              editor.setValue([...list, { id: newId("detyre"), order: list.length + 1, icon: "clipboard", title: { ...empty }, text: { ...empty } }])
            }
            className="w-full rounded-[22px] border-2 border-dashed border-[#c6d0dd] bg-white/60 py-5 font-semibold text-steel hover:border-navy hover:text-navy"
          >
            + Shto detyrë
          </button>
        </>
      )}
    </AdminEditorFrame>
  );
}
