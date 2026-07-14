import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { organizationJsonLd } from "@/lib/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s · ${SITE_NAME}`,
    },
    description: "Explore Pokémon entries, types, and generations in one place.",
    openGraph: {
      siteName: SITE_NAME,
      type: "website",
      url: `/${locale}`,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={geist.variable}>
      <body className="bg-background text-foreground min-h-svh font-sans antialiased">
        <JsonLd data={organizationJsonLd()} />
        <NextIntlClientProvider messages={messages}>
          <SiteHeader locale={locale} />
          <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
