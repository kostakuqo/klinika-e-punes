import localFont from "next/font/local";

// Self-hosted (no request to Google). Latin subset covers ë, ç and Italian accents.
export const familjen = localFont({
  src: "../fonts/familjen-grotesk-latin-wght-normal.woff2",
  variable: "--font-familjen",
  weight: "400 700",
  display: "swap",
});

export const atkinson = localFont({
  src: "../fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2",
  variable: "--font-atkinson",
  weight: "200 800",
  display: "swap",
});
