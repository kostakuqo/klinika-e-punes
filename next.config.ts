import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Old WordPress site (klinikaepunes.al) used trailing slashes on every URL,
 * e.g. /rreth-nesh/. We keep the same style so Google keeps the indexed URLs.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,
  // allow opening the dev server from other devices on the local network (e.g. http://192.168.1.20:3000)
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async redirects() {
    // Fixed redirects for WordPress leftovers. Page-level redirects that the
    // client adds later are managed from the admin panel (Firestore "redirects").
    return [
      { source: "/wp-admin/:path*", destination: "/admin/", permanent: true },
      { source: "/wp-login.php", destination: "/admin/", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/feed/:path*", destination: "/", permanent: true },
      { source: "/comments/feed/:path*", destination: "/", permanent: true },
      { source: "/home/", destination: "/", permanent: true },
      { source: "/kreu/", destination: "/", permanent: true },
      { source: "/category/:path*", destination: "/", permanent: true },
      { source: "/author/:path*", destination: "/", permanent: true },
      { source: "/wp-content/uploads/:path*", destination: "/", permanent: true },
      { source: "/imunify-bot-check/", destination: "/", permanent: true },
      // ?page_id=… / ?p=… WordPress links are stripped in src/proxy.ts
      // (a config redirect would keep the query string and loop).
    ];
  },
};

export default withNextIntl(nextConfig);
