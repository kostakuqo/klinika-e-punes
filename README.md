# Klinika e Punës — website

New site for **klinikaepunes.al**, replacing the old WordPress/Elementor site.

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS 4
- **3 languages**: Albanian on `/` (same slugs as the old site), English on `/en/`, Italian on `/it/`
- **Firebase** Firestore for all content, Firebase Auth for the admin panel
- **Cloudinary** for images
- **Framer Motion** + **Lenis** for animation and smooth scrolling
- Hosted on **Vercel**, deployed from GitHub

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the values (site runs without them, using default content)
npm run dev                  # http://localhost:3000
```

## Pages and URLs

| Page          | Albanian (root)   | English          | Italian            |
|---------------|-------------------|------------------|--------------------|
| Home          | `/`               | `/en/`           | `/it/`             |
| About         | `/rreth-nesh/`    | `/en/about/`     | `/it/chi-siamo/`   |
| Services      | `/detyrat/`       | `/en/services/`  | `/it/servizi/`     |
| Doctors       | `/mjeket/`        | `/en/doctors/`   | `/it/medici/`      |
| Clients       | `/klientet-tane/` | `/en/clients/`   | `/it/clienti/`     |
| Contact       | `/kontakto/`      | `/en/contact/`   | `/it/contatti/`    |
| Book          | `/rezervo/`       | `/en/book/`      | `/it/prenota/`     |

Slugs are defined once in `src/i18n/routing.ts`.

## Content (Firestore)

```
settings/general        phone, email, address, hours, socials, logo
pages/home              hero, sections, process steps, CTA, SEO
pages/{about|services|doctors|clients|contact|book}
services/{id}           ordered by "order"
doctors/{id}            ordered by "order"
industries/{id}         ordered by "order"
bookings/{id}           booking requests (admin only)
admins/{uid}            who may use the admin panel
```

Every text field is `{ sq, en, it }`. Defaults live in
`src/lib/content/default-site-content.ts`; if Firestore is empty or not
configured the site renders those, so it never breaks.

**First-time setup**

1. Create a Firebase project, enable Firestore and Authentication (Email/Password).
2. Service account key → fill `FIREBASE_*` in `.env.local`.
3. `npm run seed` writes the default content into Firestore.
4. Deploy `firestore.rules` (Firebase console → Firestore → Rules).
5. Create your admin user in Authentication, then add a document
   `admins/{that user's uid}` by hand.

## SEO and migration

- `/sitemap.xml` and `/robots.txt` are generated (`src/app/sitemap.ts`, `src/app/robots.ts`)
- hreflang alternates + canonical on every page, `MedicalClinic` structured data
- Albanian keeps the old WordPress URLs, so existing Google results keep working
- WordPress leftovers (`/wp-admin`, `/wp-sitemap.xml`, `/feed/`, `/wp-content/uploads/…`,
  `?page_id=`) redirect permanently — see `next.config.ts` and `src/proxy.ts`

## Deploy (Vercel)

1. Push to GitHub, import the repo in Vercel.
2. Add every variable from `.env.example` in Vercel → Settings → Environment Variables.
3. Test on the `*.vercel.app` URL.
4. Switch the domain: add `klinikaepunes.al` and `www.klinikaepunes.al` in Vercel → Domains
   and point DNS there. Then submit `https://klinikaepunes.al/sitemap.xml` in Google Search Console.

## Next phase

- Admin panel at `/admin/` (edit everything, Cloudinary upload, SQ/EN/IT tabs)
- Booking form → Firestore `bookings` + email notification
- Redirects editable from the admin
