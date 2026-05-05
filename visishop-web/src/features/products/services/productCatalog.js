import catalog from "../../../data/productCatalog.json";

function normalizeText(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function toTokenSet(value) {
  return new Set(normalizeText(value).split(" ").filter(Boolean));
}

export function findBestCatalogMatch(name) {
  const normalized = normalizeText(name);
  if (!normalized) return null;

  const inputTokens = toTokenSet(normalized);
  if (!inputTokens.size) return null;

  let best = null;
  let bestScore = 0;
  let tie = false;
  let bestIsDefault = false;

  for (const item of catalog) {
    const productNormalized = normalizeText(item.name);
    if (!productNormalized) continue;

    let score = 0;
    if (productNormalized === normalized) {
      score = 10000;
    } else {
      const productTokens = toTokenSet(productNormalized);
      const overlap = [...inputTokens].filter((t) => productTokens.has(t)).length;
      if (overlap === 0) {
        score = 0;
      } else {
        const extrasProduct = [...productTokens].filter((t) => !inputTokens.has(t)).length;
        const extrasInput = [...inputTokens].filter((t) => !productTokens.has(t)).length;

        // Orden libre: prioriza alto overlap y penaliza extras.
        score = overlap * 100 - extrasProduct * 10 - extrasInput * 5;

        // Bonus si el input es muy corto pero altamente representativo (ej: "off family aerosol").
        const coverage = overlap / Math.max(productTokens.size, 1);
        if (coverage >= 0.6) score += 40;

        // Bonus si hay contención (caso exacto por substring).
        if (normalized.includes(productNormalized) || productNormalized.includes(normalized)) {
          score += 50;
        }
      }
    }

    if (score <= 0) continue;

    const isDefault = Boolean(item.default);

    if (score > bestScore) {
      best = item;
      bestScore = score;
      tie = false;
      bestIsDefault = isDefault;
    } else if (score === bestScore) {
      // Si hay empate, preferimos el producto marcado como default (p.ej. el real que tenés).
      if (isDefault && !bestIsDefault) {
        best = item;
        bestIsDefault = true;
        tie = false;
      } else if (!isDefault && bestIsDefault) {
        tie = false;
      } else {
        tie = true;
      }
    }
  }

  return !best || tie ? null : best;
}

export function getCatalogCount() {
  return catalog.length;
}
