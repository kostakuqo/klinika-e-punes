import type { InnerPageId } from "@/lib/content/content-types";

/** Pages editable under Admin → Faqet. "kreu" is the home page. */
export const adminPages: { id: "kreu" | InnerPageId; title: string; text: string }[] = [
  { id: "kreu", title: "Kreu", text: "Faqja kryesore: hyrja, detyrat, hapat, thënia, ftesa për rezervim." },
  { id: "about", title: "Rreth nesh", text: "Teksti dhe imazhi i faqes Rreth nesh." },
  { id: "services", title: "Detyrat", text: "Titulli dhe hyrja e faqes Detyrat." },
  { id: "doctors", title: "Mjekët", text: "Titulli dhe hyrja e faqes Mjekët." },
  { id: "clients", title: "Klientët tanë", text: "Titulli dhe hyrja e faqes Klientët tanë." },
  { id: "contact", title: "Kontakto", text: "Titulli dhe hyrja e faqes Kontakto." },
  { id: "book", title: "Rezervo", text: "Titulli dhe hyrja e faqes Rezervo një takim." },
];
