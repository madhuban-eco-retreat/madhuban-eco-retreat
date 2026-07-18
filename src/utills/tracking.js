// Attribution capture for landing-page leads.
//
// Google frequently sends `wbraid`/`gbraid` instead of `gclid` on iOS — most of
// our traffic — so a first touch that lands with one of those and later submits
// from a URL without it would otherwise be lost. We stash whatever attribution
// params the visitor arrives with in sessionStorage and merge them back in at
// submit time.
//
// Every storage access is wrapped in try/catch: Safari private mode throws on
// sessionStorage.

const STORAGE_KEY = "mer_attribution";

// URL param name -> payload field name (matches what the API route / Sheet read).
const PARAM_MAP = {
  gclid: "gclid",
  wbraid: "wbraid",
  gbraid: "gbraid",
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
};

const FIELDS = Object.values(PARAM_MAP);

// Only the params actually present in the URL, keyed by payload field name.
function readFromUrl() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out = {};
  for (const [param, field] of Object.entries(PARAM_MAP)) {
    const value = params.get(param);
    if (value) out[field] = value;
  }
  return out;
}

function readFromStorage() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Persist the attribution the visitor arrived with. If the URL carries none of
// our params, do nothing — don't clobber an earlier visit in the same session.
export function captureAttribution() {
  const fromUrl = readFromUrl();
  if (Object.keys(fromUrl).length === 0) return;

  const merged = { ...readFromStorage(), ...fromUrl };
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Safari private mode throws on setItem — the URL params still flow through
    // readAttribution() for this submit, so nothing is lost right now.
  }
}

// Current URL params merged over whatever's in sessionStorage — URL wins.
// Always returns every field (empty string when absent) so the lead payload has
// a stable shape.
export function readAttribution() {
  const merged = { ...readFromStorage(), ...readFromUrl() };
  const result = {};
  for (const field of FIELDS) {
    result[field] = merged[field] || "";
  }
  return result;
}
