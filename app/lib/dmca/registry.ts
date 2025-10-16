// app/lib/dmca/registry.ts
export type Contact = { kind: "email" | "form"; value: string; note?: string };

const REGISTRY: Array<{ match: RegExp; contact: Contact }> = [
  { match: /(^|\.)youtube\.com$/i,    contact: { kind: "form",  value: "https://support.google.com/youtube/troubleshooter/2807622", note: "Formulario DMCA YouTube" } },
  { match: /(^|\.)facebook\.com$/i,   contact: { kind: "form",  value: "https://www.facebook.com/help/contact/634636770043106",     note: "Formulario Meta" } },
  { match: /(^|\.)instagram\.com$/i,  contact: { kind: "form",  value: "https://help.instagram.com/contact/552695131608132",         note: "Formulario Instagram" } },
  { match: /(^|\.)tiktok\.com$/i,     contact: { kind: "form",  value: "https://www.tiktok.com/legal/report/feedback",               note: "Formulario TikTok" } },
  { match: /(^|\.)pinterest\.com$/i,  contact: { kind: "form",  value: "https://help.pinterest.com/en/business/article/file-a-notice-of-claimed-infringement", note: "Formulario Pinterest" } },
  { match: /(^|\.)scribd\.com$/i,     contact: { kind: "form",  value: "https://www.scribd.com/DMCA",                                 note: "Formulario Scribd" } },
  { match: /(^|\.)etsy\.com$/i,       contact: { kind: "form",  value: "https://www.etsy.com/legal/ip/report",                        note: "Formulario Etsy" } },
  { match: /(^|\.)github\.com$/i,     contact: { kind: "email", value: "dmca@github.com",                                             note: "Correo DMCA GitHub" } },
  { match: /(^|\.)dropbox\.com$/i,    contact: { kind: "form",  value: "https://www.dropbox.com/DMCA",                                note: "Formulario Dropbox" } },
  { match: /(^|\.)cloudflare\.com$/i, contact: { kind: "form",  value: "https://abuse.cloudflare.com",                                note: "Abuse Cloudflare" } },
];

export function findContactForDomain(domain: string): Contact | null {
  const clean = (domain || "").toLowerCase().trim();
  const rule = REGISTRY.find(r => r.match.test(clean));
  return rule ? rule.contact : null;
}

export function guessEmailsForDomain(domain: string): string[] {
  const base = (domain || "").toLowerCase().trim();
  if (!base) return [];
  return [`dmca@${base}`, `copyright@${base}`, `abuse@${base}`, `legal@${base}`];
}

export function extractDomain(raw: string): string | null {
  if (!raw) return null;
  let url = raw.trim();

  // Permitir entradas sin esquema: "etsy.com/..." o "www.pinterest.com/..."
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url.replace(/^\/+/, "");
  }

  try {
    const u = new URL(url);
    const host = (u.hostname || "").toLowerCase().replace(/^www\./, "");
    return host || null;
  } catch {
    return null;
  }
}
