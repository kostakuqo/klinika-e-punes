"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { clsx } from "clsx";
import { locales, type Locale } from "@/i18n/routing";
import type { Localized } from "@/lib/content/content-types";
import { uploadImage } from "@/lib/admin/admin-api";
import { optimizedImageUrl } from "@/lib/cloudinary-image-url";
import { LanguageFlag, languageLabels, languageNames } from "@/components/site/language-flag";

/** Clearly visible inputs: grey fill + strong border, white with navy border when focused. */
const inputClass =
  "w-full rounded-xl border-2 border-[#c6d0dd] bg-[#f5f7fa] px-4 py-3 text-[1rem] text-ink outline-none transition-[border-color,background-color,box-shadow] placeholder:text-steel/60 hover:border-[#9eadc2] focus:border-navy focus:bg-white focus:shadow-[0_0_0_4px_var(--color-amber-soft)]";

/**
 * A titled block of fields. "where" tells the editor which part of the
 * public page these fields change.
 */
export function FieldGroup({
  title,
  description,
  where,
  children,
}: {
  title: string;
  description?: string;
  where?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-[#d5dde8] bg-white shadow-[0_1px_2px_rgba(14,26,46,0.05)]">
      <header className="border-b border-[#e3e9f1] bg-[#fafbfd] px-6 py-5 sm:px-8">
        <h2 className="flex items-center gap-3 text-xl font-semibold text-navy">
          <span aria-hidden className="h-6 w-1.5 rounded-full bg-amber" />
          {title}
        </h2>
        {where && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-navy/[0.06] px-3 py-1 text-xs font-medium text-navy">
            <span aria-hidden>📍</span> Shfaqet në: {where}
          </p>
        )}
        {description && <p className="mt-2 text-sm text-steel">{description}</p>}
      </header>
      <div className="space-y-7 px-6 py-7 sm:px-8">{children}</div>
    </section>
  );
}

function FieldLabel({ htmlFor, label, hint }: { htmlFor?: string; label: string; hint?: string }) {
  return (
    <div className="mb-2">
      <label htmlFor={htmlFor} className="text-[0.95rem] font-semibold text-navy">{label}</label>
      {hint && <p className="mt-0.5 text-[0.82rem] text-steel">{hint}</p>}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  value,
  onChange,
  type = "text",
  multiline = false,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} hint={hint} />
      {multiline ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={5} className={clsx(inputClass, "resize-y leading-relaxed")} />
      ) : (
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      )}
    </div>
  );
}

/**
 * One text in three languages. Flag tabs switch the language; an amber dot
 * means that language is still empty.
 */
export function LocalizedInput({
  label,
  hint,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  hint?: string;
  value: Localized;
  onChange: (v: Localized) => void;
  multiline?: boolean;
}) {
  const id = useId();
  const [active, setActive] = useState<Locale>("sq");
  const current = value?.[active] ?? "";

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <FieldLabel htmlFor={`${id}-${active}`} label={label} hint={hint} />
        <div role="tablist" aria-label={`${label}: gjuha`} className="mb-2 flex gap-1 rounded-full border border-[#d5dde8] bg-[#eef2f7] p-1">
          {locales.map((l) => {
            const empty = !value?.[l]?.trim();
            return (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={active === l}
                title={`${languageNames[l]}${empty ? " (bosh)" : ""}`}
                onClick={() => setActive(l)}
                className={clsx(
                  "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                  active === l ? "bg-navy text-white shadow" : "text-navy/70 hover:bg-white hover:text-navy",
                )}
              >
                <LanguageFlag locale={l} />
                {languageLabels[l]}
                {empty && <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#eef2f7] bg-amber" />}
              </button>
            );
          })}
        </div>
      </div>
      {multiline ? (
        <textarea
          id={`${id}-${active}`}
          lang={active}
          value={current}
          rows={6}
          placeholder={`Shkruani në ${languageNames[active].toLowerCase()}…`}
          onChange={(e) => onChange({ ...value, [active]: e.target.value })}
          className={clsx(inputClass, "resize-y leading-relaxed")}
        />
      ) : (
        <input
          id={`${id}-${active}`}
          lang={active}
          value={current}
          placeholder={`Shkruani në ${languageNames[active].toLowerCase()}…`}
          onChange={(e) => onChange({ ...value, [active]: e.target.value })}
          className={inputClass}
        />
      )}
    </div>
  );
}

export function SelectInput<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} />
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className={inputClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/** Google title + description for one page, in three languages. */
export function SeoFields({
  value,
  onChange,
}: {
  value: { title: Localized; description: Localized };
  onChange: (v: { title: Localized; description: Localized }) => void;
}) {
  return (
    <FieldGroup title="Google (SEO)" where="rezultatet e kërkimit në Google dhe skeda e shfletuesit">
      <LocalizedInput label="Titulli" hint="Rreth 50–60 shkronja." value={value.title} onChange={(title) => onChange({ ...value, title })} />
      <LocalizedInput
        label="Përshkrimi"
        hint="Rreth 140–160 shkronja."
        multiline
        value={value.description}
        onChange={(description) => onChange({ ...value, description })}
      />
    </FieldGroup>
  );
}

/** Recommended upload sizes, shown under every image field. */
export const imageSizes = {
  hero: { width: 1920, height: 1080, note: "horizontale (16:9), JPG ose WebP" },
  portrait: { width: 800, height: 1000, note: "vertikale (4:5), JPG ose WebP" },
  logo: { width: 600, height: 200, note: "PNG ose SVG me sfond transparent" },
} as const;

type ImageSize = { width: number; height: number; note: string };

/** Reads an image file's pixel size before upload. */
function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Upload to Cloudinary with preview, replace and remove. Shows the
 * recommended size, and warns (without blocking) when the chosen image is
 * clearly smaller, because it would look blurry on large screens.
 */
export function ImageInput({
  label,
  hint,
  value,
  onChange,
  size,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  size: ImageSize;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const ratio = `${size.width} / ${size.height}`;

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    setWarning("");
    try {
      const dims = file.type === "image/svg+xml" ? null : await readImageSize(file);
      if (dims && (dims.width < size.width * 0.75 || dims.height < size.height * 0.75)) {
        setWarning(
          `Imazhi është ${dims.width} × ${dims.height} px, më i vogël se ${size.width} × ${size.height} px. Mund të duket i turbullt në ekrane të mëdha.`,
        );
      }
      onChange(await uploadImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ngarkimi dështoi.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <p className="mb-3 inline-flex flex-wrap items-center gap-x-2 rounded-lg border border-amber/60 bg-amber-soft px-3 py-1.5 text-[0.82rem] text-navy">
        <strong>Madhësia e kërkuar: {size.width} × {size.height} px</strong>
        <span className="text-navy/70">· {size.note} · deri në 10 MB</span>
      </p>
      <div className="flex flex-wrap items-start gap-4">
        <div
          className="relative w-56 max-w-full overflow-hidden rounded-xl border-2 border-dashed border-[#c6d0dd] bg-[#f5f7fa]"
          style={{ aspectRatio: ratio }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={optimizedImageUrl(value, 500)} alt="" className="size-full object-cover" />
          ) : (
            <span className="grid size-full place-items-center p-2 text-center text-xs text-steel">
              Pa imazh
              <br />
              {size.width} × {size.height}
            </span>
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-white/75">
              <span className="size-7 animate-spin rounded-full border-3 border-navy/20 border-t-navy" />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Duke ngarkuar…" : value ? "Zëvendëso imazhin" : "Ngarko imazh"}
          </button>
          {value && (
            <button type="button" disabled={busy} onClick={() => onChange("")} className="rounded-full border-2 border-[#c6d0dd] px-5 py-2 text-sm font-medium text-steel hover:border-navy hover:text-navy">
              Hiq imazhin
            </button>
          )}
        </div>
      </div>
      {warning && <p role="status" className="mt-3 rounded-lg bg-amber-soft px-3 py-2 text-sm text-navy">⚠ {warning}</p>}
      {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
    </div>
  );
}
