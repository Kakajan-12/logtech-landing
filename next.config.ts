import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old misspelled URL → keep existing links and search results working
      {
        source: "/:lang(en|ru|tk)/privasypolicy",
        destination: "/:lang/privacy-policy",
        permanent: true,
      },
      // The showcase became the home page
      {
        source: "/:lang(en|ru|tk)/showcase",
        destination: "/:lang",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
