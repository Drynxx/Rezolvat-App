import { OFFICIAL_ITL054_BASE64 } from './official-binary';

let cachedTemplateBytes: Uint8Array | null = null;

function base64ToUint8Array(base64: string): Uint8Array {
  // If in browser
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // If in Node.js
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }

  // Fallback pure JS decoder
  const binStr = atob(base64);
  const bytes = new Uint8Array(binStr.length);
  for (let i = 0; i < binStr.length; i++) {
    bytes[i] = binStr.charCodeAt(i);
  }
  return bytes;
}

/**
 * Loads the authentic official PDF template bytes (with all 104 AcroForm fields embedded).
 * Instantaneous, 100% offline, zero network dependencies.
 */
export async function getOfficialAcroFormTemplateBytes(): Promise<Uint8Array> {
  if (cachedTemplateBytes) {
    return cachedTemplateBytes;
  }

  cachedTemplateBytes = base64ToUint8Array(OFFICIAL_ITL054_BASE64);
  return cachedTemplateBytes;
}
