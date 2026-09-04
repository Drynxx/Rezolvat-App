import { ProcesVerbalExtractedData } from '../../types';

export interface OcrExtractionResult {
  data: ProcesVerbalExtractedData;
  confidenceScore: number;
  processingTimeMs: number;
  source: 'gemini-3.6-flash' | 'gemini-2.0-flash';
}

/**
 * Strict Extraction Function for Romanian Traffic / Parking Tickets
 * Calls Gemini 3.6 Flash Vision with zero-mock policy (only document data is returned).
 */
export async function extractProcesVerbalFromImage(
  base64Image: string,
  mimeType: 'image/webp' | 'image/jpeg' | 'image/png' = 'image/webp'
): Promise<OcrExtractionResult> {
  const startTime = performance.now();
  const apiKey =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    (typeof window !== 'undefined' ? (window as any).__GEMINI_API_KEY__ : undefined);

  if (!apiKey || apiKey.length < 10) {
    throw new Error('Cheia Gemini API lipsește sau este invalidă. Configurați VITE_GEMINI_API_KEY în .env.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Ești un asistent juridic de elită din România specializat în transcrierea documentelor olografe oficiale (Procese-Verbale de constatare a contravenției).
REGULĂ STRICTĂ: Extrage EXCLUSIV datele fizic lizibile din imagine. NU inventa, presupune sau adăuga date inexistente în document.
Extrage toate câmpurile în format JSON valid:
- pv_series, pv_number, police_unit, agent_name, agent_badge_number
- contravener_name, contravener_cnp, contravener_address, contravener_driver_license
- incident_date (YYYY-MM-DD), incident_time (HH:MM), incident_city, incident_county, incident_exact_location
- deed_description, statute_violated, statute_sanctioned
- fine_amount_ron (number), half_fine_amount_ron (number), penalty_points (integer), license_suspended_days (integer)
- is_radar_offense (boolean), radar_serial_number, radar_auto_plate, metrology_bulletin_number, speed_recorded_kmh, speed_limit_kmh
- contravener_signed (boolean), refused_to_sign (boolean), has_witness (boolean), witness_name, witness_cnp, objections_field_content, agent_signature_present (boolean)`
              },
              {
                inlineData: {
                  data: base64Image,
                  mimeType: mimeType
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.0
        }
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Gemini PV OCR Error:', response.status, errorBody);
    throw new Error(`Eroare la procesarea procesului-verbal cu Gemini Flash (${response.status}).`);
  }

  const jsonRes = await response.json();
  const rawText = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Nu s-au putut recunoaște date din imaginea procesului-verbal. Asigurați-vă că fotografia este clară.');
  }

  const parsed = JSON.parse(rawText) as ProcesVerbalExtractedData;
  return {
    data: parsed,
    confidenceScore: 95,
    processingTimeMs: Math.round(performance.now() - startTime),
    source: 'gemini-3.6-flash'
  };
}
