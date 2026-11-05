"use client";

import type { HomePage, ProcessStep } from "@/lib/content/content-types";
import { defaultSiteContent } from "@/lib/content/default-site-content";
import { loadDocument, saveDocument } from "@/lib/admin/admin-content-store";
import { useAdminEditor } from "../use-admin-editor";
import { AdminEditorFrame, ListItemCard, moveItem } from "../admin-editor-frame";
import { FieldGroup, ImageInput, LocalizedInput, SeoFields, imageSizes } from "../admin-form-fields";

const PATH = "pages/home";
const empty = { sq: "", en: "", it: "" };

export function HomePageEditor() {
  const editor = useAdminEditor(
    () => loadDocument<HomePage>(PATH, defaultSiteContent.home),
    (v) => saveDocument(PATH, v),
  );
  const h = editor.value;
  const set = <K extends keyof HomePage>(key: K, v: HomePage[K]) => editor.setValue((prev) => ({ ...prev, [key]: v }));
  const setSteps = (steps: ProcessStep[]) => set("processSteps", steps);

  return (
    <AdminEditorFrame title="Kreu" description="Faqja kryesore e faqes." view={{ label: "Kreu", href: "/" }} {...editor}>
      {h && (
        <>
          <FieldGroup title="Krye e faqes" where="Kreu → pjesa e parë, me orën e 8 orëve të punës">
            <ImageInput
              label="Fotoja e sfondit"
              hint="Shfaqet pas titullit, me një shtresë blu sipër që teksti të lexohet. Pa foto, sfondi mbetet blu."
              size={imageSizes.hero}
              value={h.heroImageUrl}
              onChange={(v) => set("heroImageUrl", v)}
            />
            <LocalizedInput label="Titulli kryesor" value={h.heroTitle} onChange={(v) => set("heroTitle", v)} />
            <LocalizedInput label="Teksti nën titull" multiline value={h.heroLead} onChange={(v) => set("heroLead", v)} />
          </FieldGroup>

          <FieldGroup title="Detyrat" where="Kreu → seksioni i bardhë pas pjesës së parë" description="Vetë detyrat ndryshohen te Admin → Detyrat.">
            <LocalizedInput label="Titulli i seksionit" value={h.servicesTitle} onChange={(v) => set("servicesTitle", v)} />
            <LocalizedInput label="Hyrja e seksionit" value={h.servicesIntro} onChange={(v) => set("servicesIntro", v)} />
          </FieldGroup>

          <FieldGroup title="Sektorët" where="Kreu → shiriti lëvizës me sektorët" description="Lista e sektorëve ndryshohet te Admin → Sektorët.">
            <LocalizedInput label="Titulli mbi shiritin lëvizës" value={h.industriesTitle} onChange={(v) => set("industriesTitle", v)} />
          </FieldGroup>

          <FieldGroup title="Hapat" where="Kreu → seksioni blu me hapat e numëruar (edhe te faqja Detyrat)">
            <LocalizedInput label="Titulli i seksionit" value={h.processTitle} onChange={(v) => set("processTitle", v)} />
            <LocalizedInput label="Hyrja e seksionit" multiline value={h.processIntro} onChange={(v) => set("processIntro", v)} />
          </FieldGroup>

          {h.processSteps.map((step, i) => (
            <ListItemCard
              key={i}
              title={step.title.sq}
              index={i}
              total={h.processSteps.length}
              onMove={(from, to) => setSteps(moveItem(h.processSteps, from, to))}
              onRemove={() => setSteps(h.processSteps.filter((_, j) => j !== i))}
            >
              <LocalizedInput
                label="Titulli i hapit"
                value={step.title}
                onChange={(title) => setSteps(h.processSteps.map((s, j) => (j === i ? { ...s, title } : s)))}
              />
              <LocalizedInput
                label="Përshkrimi"
                multiline
                value={step.text}
                onChange={(text) => setSteps(h.processSteps.map((s, j) => (j === i ? { ...s, text } : s)))}
              />
            </ListItemCard>
          ))}
          <button
            type="button"
            onClick={() => setSteps([...h.processSteps, { title: { ...empty }, text: { ...empty } }])}
            className="w-full rounded-[22px] border-2 border-dashed border-[#c6d0dd] bg-white/60 py-5 font-semibold text-steel hover:border-navy hover:text-navy"
          >
            + Shto hap
          </button>

          <FieldGroup title="Mjekët" where="Kreu → seksioni i mjekëve" description="Seksioni shfaqet vetëm kur ka të paktën një mjek te Admin → Mjekët.">
            <LocalizedInput label="Titulli i seksionit" value={h.doctorsTitle} onChange={(v) => set("doctorsTitle", v)} />
          </FieldGroup>

          <FieldGroup title="Thënia dhe ftesa për rezervim" where="Kreu → fundi i faqes (kutia e verdhë shfaqet edhe në faqet e tjera)">
            <LocalizedInput label="Thënia e madhe" value={h.quote} onChange={(v) => set("quote", v)} />
            <LocalizedInput label="Titulli i kutisë së verdhë" value={h.ctaTitle} onChange={(v) => set("ctaTitle", v)} />
            <LocalizedInput label="Teksti i kutisë së verdhë" multiline value={h.ctaText} onChange={(v) => set("ctaText", v)} />
          </FieldGroup>

          <SeoFields value={h.seo} onChange={(v) => set("seo", v)} />
        </>
      )}
    </AdminEditorFrame>
  );
}
