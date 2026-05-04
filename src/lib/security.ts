const HTTP_PROTOCOLS = new Set(["http:", "https:"]);
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getSafeHttpUrl(value?: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (!HTTP_PROTOCOLS.has(url.protocol)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function isUuid(value: string) {
  return UUID_REGEX.test(value);
}

export function isUuidPdfPath(value: string) {
  return /^[0-9a-f-]+\.pdf$/i.test(value) && isUuid(value.replace(/\.pdf$/i, ""));
}

export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getCurriculoDownloadUrl(path: string) {
  return `/api/curriculo/${path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

export function sanitizePostgrestTextSearch(value?: string | null) {
  if (!value) return "";

  return value.replace(/[%,"'()]/g, " ").trim();
}
