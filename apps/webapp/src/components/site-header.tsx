import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { buttonVariants } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/metadata";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  locale: string;
};

export async function SiteHeader({ locale }: SiteHeaderProps) {
  const t = await getTranslations("nav");

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link href={`/${locale}`} className="mr-2 font-semibold tracking-tight">
            {SITE_NAME}
          </Link>
          <Link
            href={`/${locale}/pokemon`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {t("pokemon")}
          </Link>
          <Link
            href={`/${locale}/types`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {t("types")}
          </Link>
          <Link
            href={`/${locale}/generations`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            {t("generations")}
          </Link>
        </div>
        <LocaleSwitcher locale={locale} label={t("locales")} />
      </div>
    </header>
  );
}
