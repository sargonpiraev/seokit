/**
 * Page metadata contract ≈ Next.js `Metadata` subset + `lang`
 * (`<html lang>` is not in Next Metadata).
 */
export type PageMetadata = {
  lang?: string | null;
  title?: string | null;
  description?: string | null;
  alternates?: {
    canonical?: string | null;
    languages?: Record<string, string>;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
  } | null;
};

export type MetadataExpected = {
  lang?: string | RegExp;
  title?: string | RegExp;
  description?: string | RegExp;
  alternates?: {
    canonical?: string | RegExp;
    languages?: Record<string, string | RegExp>;
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
};
