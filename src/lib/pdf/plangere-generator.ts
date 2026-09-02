import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ProcesVerbalExtractedData, LegalAnalysisResult } from '../../types';

/**
 * Normalizes Romanian diacritics for standard PDF WinAnsi Helvetica encoding.
 */
function sanitizeForPdf(str: string = ''): string {
  if (!str) return '';
  return str
    .replace(/ă/g, 'a')
    .replace(/Ă/g, 'A')
    .replace(/â/g, 'a')
    .replace(/Â/g, 'A')
    .replace(/î/g, 'i')
    .replace(/Î/g, 'I')
    .replace(/ș/g, 's')
    .replace(/Ș/g, 'S')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ț/g, 't')
    .replace(/Ț/g, 'T')
    .replace(/ţ/g, 't')
    .replace(/Ţ/g, 'T')
    .replace(/[^\x00-\x7F]/g, ''); // strip any non-ASCII characters that WinAnsi rejects
}

export async function generatePlangerePdf(
  pv: ProcesVerbalExtractedData,
  analysis: LegalAnalysisResult
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595.28, 841.89]); // A4 in points (210 x 297 mm)
  const { width, height } = page.getSize();
  const margin = 54; // ~1.9 cm margin
  const contentWidth = width - margin * 2;
  let cursorY = height - margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY - neededHeight < margin) {
      page = pdfDoc.addPage([595.28, 841.89]);
      cursorY = height - margin;
    }
  };

  const drawParagraph = (text: string, font = fontRegular, size = 10, lineSpacing = 14) => {
    const cleanText = sanitizeForPdf(text);
    const words = cleanText.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
      const textWidth = font.widthOfTextAtSize(testLine, size);

      if (textWidth > contentWidth) {
        checkPageBreak(lineSpacing);
        page.drawText(currentLine, { x: margin, y: cursorY, size, font, color: rgb(0.1, 0.1, 0.1) });
        cursorY -= lineSpacing;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine.length > 0) {
      checkPageBreak(lineSpacing);
      page.drawText(currentLine, { x: margin, y: cursorY, size, font, color: rgb(0.1, 0.1, 0.1) });
      cursorY -= lineSpacing;
    }
  };

  // Header: Court Competence
  page.drawText(`CATRE,`, { x: margin, y: cursorY, size: 11, font: fontBold });
  cursorY -= 16;
  page.drawText(sanitizeForPdf(analysis.competentCourt.name.toUpperCase()), { x: margin, y: cursorY, size: 12, font: fontBold });
  cursorY -= 24;

  // Petent details
  drawParagraph(
    `DOMNULE PRESEDINTE,\n\nSubsemnatul(a), ${pv.contravener_name || '[NUME PETENT]'}, domiciliat(a) in ${pv.contravener_address || '[ADRESA DOMICILIU]'}, CNP ${pv.contravener_cnp || '[CNP]'}, formulez in termen legal, in temeiul art. 31 alin. (1) din O.G. nr. 2/2001 si art. 118 din O.U.G. nr. 195/2002, prezenta:`,
    fontRegular,
    10.5
  );

  cursorY -= 8;
  // Main Title
  const title = `PLANGERE CONTRAVENTIONALA`;
  const titleWidth = fontBold.widthOfTextAtSize(title, 13);
  page.drawText(title, { x: (width - titleWidth) / 2, y: cursorY, size: 13, font: fontBold });
  cursorY -= 18;

  drawParagraph(
    `Impotriva Procesului-Verbal de Constatare a Contraventiei seria ${pv.pv_series} nr. ${pv.pv_number} incheiat la data de ${pv.incident_date || 'data indicata pe PV'} de catre intimata ${pv.police_unit.toUpperCase()}, solicitandu-va respectuos ca prin hotararea ce o veti pronunta sa dispuneti:`,
    fontRegular,
    10.5
  );

  cursorY -= 6;
  drawParagraph(
    `1. In principal: ANULAREA Procesului-Verbal de Constatare a Contraventiei seria ${pv.pv_series} nr. ${pv.pv_number} ca fiind nelegal si netemeinic, cu exonerarea subsemnatului de la plata amenzii in cuantum de ${pv.fine_amount_ron} RON si inlaturarea punctelor de penalizare;\n2. In subsidiar: INLOCUIREA sanctiunii amenzii contraventionale cu sanctiunea AVERTISMENTULUI, conform art. 7 din O.G. nr. 2/2001;\n3. Obligarea intimatei la plata cheltuielilor de judecata.`,
    fontBold,
    10,
    13
  );

  cursorY -= 12;
  page.drawText(`MOTIVE:`, { x: margin, y: cursorY, size: 11, font: fontBold });
  cursorY -= 14;

  page.drawText(`I. IN FAPT:`, { x: margin, y: cursorY, size: 10.5, font: fontBold });
  cursorY -= 12;
  drawParagraph(
    `La data de ${pv.incident_date || '[DATA]'}, agentul constatator a intocmit procesul-verbal atacat, retinand urmatoarea descriere a faptei: "${pv.deed_description}". Apreciez ca actul sanctionator este afectat de vicii esentiale de legalitate si temeinicie ce atrag nulitatea acestuia.`,
    fontRegular,
    10
  );

  cursorY -= 10;
  page.drawText(`II. IN DREPT - MOTIVE DE NELEGALITATE SI NETEMEINICIE:`, { x: margin, y: cursorY, size: 10.5, font: fontBold });
  cursorY -= 14;

  let groundIndex = 1;
  const allGrounds = [...analysis.absoluteNullities, ...analysis.relativeNullities, ...analysis.meritDefenses];

  for (const ground of allGrounds) {
    drawParagraph(`${groundIndex}. ${ground.summary} (${ground.article} din ${ground.law})`, fontBold, 10);
    cursorY -= 3;
    drawParagraph(ground.legalArgument, fontRegular, 9.5);
    cursorY -= 6;
    groundIndex++;
  }

  // Clause for "Judecarea in lipsa" (Art. 411 alin. 2 C.pr.civ.)
  cursorY -= 8;
  page.drawText(`III. DISPOZITII PROCEDURALE SI PROBE:`, { x: margin, y: cursorY, size: 10.5, font: fontBold });
  cursorY -= 12;
  drawParagraph(
    `In dovedirea plangerii, solicit incuviintarea probei cu inscrisuri si obligarea intimatei la depunerea dosarului complet care a stat la baza intocmirii procesului-verbal (raportul agentului, verificarea metrologica si suportul optic original).\n\nIn temeiul art. 411 alin. (2) din Codul de Procedura Civila, SOLICIT JUDECAREA CAUZEI SI IN LIPSA SUBSEMNATULUI.`,
    fontRegular,
    10
  );

  cursorY -= 20;
  checkPageBreak(40);
  page.drawText(`Data: ${new Date().toLocaleDateString('ro-RO')}`, { x: margin, y: cursorY, size: 10, font: fontRegular });
  page.drawText(`Semnatura, ___________________`, { x: width - margin - 200, y: cursorY, size: 10, font: fontBold });

  return await pdfDoc.save();
}
