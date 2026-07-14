import { routing } from "@/i18n/routing";

/** Swap the locale prefix while keeping the rest of the path. */
export function switchLocalePath(pathname: string, nextLocale: string): string {
  const segments = pathname.split("/");
  const current = segments[1];

  if (current && (routing.locales as readonly string[]).includes(current)) {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }

  const suffix = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${nextLocale}${suffix === "/" ? "" : suffix}`;
}

export const localeLabels: Record<(typeof routing.locales)[number], string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
};
