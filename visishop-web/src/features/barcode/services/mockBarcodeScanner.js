function hashFromText(value) {
  return value.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function generateProductBarcode(productName) {
  const hash = hashFromText(productName.toLowerCase().trim());
  const normalized = String(100000 + (hash % 899999));
  return normalized.padStart(6, "0");
}

export function simulateBarcodeScan(expectedBarcode) {
  const isMatch = Math.random() > 0.35;
  const randomCode = String(100000 + Math.floor(Math.random() * 899999));
  const scannedCode = isMatch ? expectedBarcode : randomCode;

  return {
    expectedBarcode,
    scannedCode,
    isMatch,
  };
}
