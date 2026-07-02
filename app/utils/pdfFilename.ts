const COMPANY_SUFFIXES =
  /\s+(incorporated|corporation|company|limited|holdings|llc|llp|plc|ltd|gmbh|inc|corp|co|ag|sa|nv|bv|group)\.?$/i;

const ILLEGAL_FILENAME_CHARS = /[\\/:*?"<>|]/g;

/** Shorten company for filenames (drop legal suffixes, keep readable words). */
export function normalizeCompanyForFilename(value: string): string {
  let name = value.trim();
  let prev = "";
  while (prev !== name) {
    prev = name;
    name = name.replace(COMPANY_SUFFIXES, "").trim();
  }
  return name;
}

/** Filesystem-safe slug: spaces → underscores, strip illegal characters. */
export function slugFilenamePart(value: string, fallback: string): string {
  const slug = value
    .trim()
    .replace(ILLEGAL_FILENAME_CHARS, "")
    .replace(/[.,']/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  return slug || fallback;
}

/**
 * Standard resume PDF filename: {ProfileName}_{Company}.pdf
 * Always includes both profile and company segments.
 */
export function buildPdfFilename(
  profileName: string,
  companyName?: string | null
): string {
  const profile = slugFilenamePart(profileName, "Profile");
  const company = slugFilenamePart(
    normalizeCompanyForFilename(companyName?.trim() || "Company"),
    "Company"
  );
  return `${profile}_${company}.pdf`;
}

export function parseContentDispositionFilename(
  header: string | null,
  fallback: string
): string {
  if (!header) return fallback;

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      /* use quoted match below */
    }
  }

  const quotedMatch = header.match(/filename="([^"]+)"/i);
  if (quotedMatch?.[1]) return quotedMatch[1];

  const bareMatch = header.match(/filename=([^;]+)/i);
  if (bareMatch?.[1]) return bareMatch[1].trim();

  return fallback;
}

/** @deprecated Use buildPdfFilename(profileName, companyName) */
export function pdfAttachmentFilename(
  profileName: string,
  companyName?: string | null
): string {
  return buildPdfFilename(profileName, companyName);
}
