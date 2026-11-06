"use client";

import type { PromoSlide, Promotions } from "@/lib/content/content-types";
import { defaultSiteContent } from "@/lib/content/default-site-content";
import { loadDocument, newId, saveDocument } from "@/lib/admin/admin-content-store";
import { useAdminEditor } from "@/components/admin/use-admin-editor";
import { AdminEditorFrame, ListItemCard, moveItem } from "@/components/admin/admin-editor-frame";
import { FieldGroup, ImageInput, LocalizedInput, SelectInput, TextInput, ToggleInput, imageSizes } from "@/components/admin/admin-form-fields";

const PATH = "settings/promotions";
const empty = { sq: "", en: "", it: "" };
const delays = [0, 1, 2, 3, 5, 8].map((n) => ({ value: String(n), label: n === 0 ? "Menjëherë" : `Pas ${n} sekondash` }));

export default function AdminPromotionsPage() {
  const editor = useAdminEditor(
    () => loadDocument<Promotions>(PATH, defaultSiteContent.promotions),
    (v) => saveDocument(PATH, v),
  );
  const p = editor.value;
  const set = <K extends keyof Promotions>(key: K, v: Promotions[K]) => editor.setValue((prev) => ({ ...prev, [key]: v }));
  const setSlides = (slides: PromoSlide[]) => set("slides", slides);
  const updateSlide = (i: number, patch: Partial<PromoSlide>) =>
    editor.setValue((prev) => ({ ...prev, slides: prev.slides.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));

  const withImage = p?.slides.filter((s) => s.image?.sq).length ?? 0;

  return (
    <AdminEditorFrame
      title="Promocionet"
      description="Dritarja me oferta që hapet sipër faqes kryesore sa herë që hapet faqja. Me disa imazhe, ato ndërrohen vetë çdo 5 sekonda dhe me shigjeta."
      view={{ label: "Kreu", href: "/" }}
      {...editor}
    >
      {p && (
        <>
          <FieldGroup title="Statusi" where="Kreu → dritare sipër faqes">
            <ToggleInput
              label="Dritarja me oferta"
              checked={p.enabled}
              onChange={(v) => set("enabled", v)}
              onText={
                withImage > 0
                  ? `Vizitorët e shohin në faqen kryesore (${withImage} ${withImage === 1 ? "imazh" : "imazhe"}).`
                  : "Është aktive, por nuk shfaqet derisa të ngarkoni të paktën një imazh në shqip."
              }
              offText="Nuk shfaqet. Imazhet ruhen dhe mund ta aktivizoni përsëri kur të doni."
            />
            <SelectInput
              label="Kur të hapet"
              value={String(p.delaySeconds)}
              options={delays}
              onChange={(v) => set("delaySeconds", Number(v))}
            />
          </FieldGroup>

          {p.slides.length === 0 && (
            <p className="rounded-[22px] border border-[#d5dde8] bg-white p-8 text-steel">
              Ende nuk ka imazhe. Shtoni të parin me butonin më poshtë.
            </p>
          )}

          {p.slides.map((slide, i) => (
            <ListItemCard
              key={slide.id}
              title={slide.alt?.sq || `Imazhi ${i + 1}`}
              index={i}
              total={p.slides.length}
              onMove={(from, to) => setSlides(moveItem(p.slides, from, to))}
              onRemove={() => setSlides(p.slides.filter((s) => s.id !== slide.id))}
            >
              <ImageInput
                label="Imazhi në shqip"
                hint="I detyrueshëm. Përdoret edhe për anglisht dhe italisht nëse ato mbeten bosh."
                size={imageSizes.promo}
                value={slide.image?.sq ?? ""}
                onChange={(v) => updateSlide(i, { image: { ...empty, ...slide.image, sq: v } })}
              />
              <details className="rounded-xl border border-[#d5dde8] bg-[#fafbfd] p-4 open:pb-6">
                <summary className="cursor-pointer font-semibold text-navy">
                  Imazhe të veçanta për anglisht dhe italisht (opsionale)
                </summary>
                <div className="mt-5 space-y-6">
                  <ImageInput
                    label="Imazhi në anglisht"
                    hint="Për vizitorët që e kanë faqen në EN."
                    size={imageSizes.promo}
                    value={slide.image?.en ?? ""}
                    onChange={(v) => updateSlide(i, { image: { ...empty, ...slide.image, en: v } })}
                  />
                  <ImageInput
                    label="Imazhi në italisht"
                    hint="Për vizitorët që e kanë faqen në IT."
                    size={imageSizes.promo}
                    value={slide.image?.it ?? ""}
                    onChange={(v) => updateSlide(i, { image: { ...empty, ...slide.image, it: v } })}
                  />
                </div>
              </details>
              <TextInput
                label="Linku kur klikohet imazhi (opsional)"
                hint="P.sh. /rezervo/ për faqen e rezervimit, tel:+355682053180 për të telefonuar, ose një adresë https://…"
                value={slide.link ?? ""}
                onChange={(link) => updateSlide(i, { link })}
              />
              <LocalizedInput
                label="Përshkrimi i imazhit"
                hint="Një fjali e shkurtër për lexuesit e ekranit dhe Google, p.sh. “15% zbritje në analiza”."
                value={slide.alt ?? empty}
                onChange={(alt) => updateSlide(i, { alt })}
              />
            </ListItemCard>
          ))}

          <button
            type="button"
            onClick={() => setSlides([...p.slides, { id: newId("promo"), image: { ...empty }, link: "", alt: { ...empty } }])}
            className="w-full rounded-[22px] border-2 border-dashed border-[#c6d0dd] bg-white/60 py-5 font-semibold text-steel hover:border-navy hover:text-navy"
          >
            + Shto imazh
          </button>
        </>
      )}
    </AdminEditorFrame>
  );
}
