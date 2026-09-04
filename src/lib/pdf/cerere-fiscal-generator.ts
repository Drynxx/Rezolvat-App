import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FiscalFormData } from '../../types/ghiseu';

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
    .replace(/[^\x00-\x7F]/g, '');
}

export async function generateCerereFiscalPdf(data: FiscalFormData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const margin = 44;
  const contentWidth = width - margin * 2;
  let cursorY = height - margin;

  const black = rgb(0.1, 0.1, 0.1);
  const grayText = rgb(0.35, 0.35, 0.35);
  const strokeColor = rgb(0.7, 0.75, 0.8);
  const headerBg = rgb(0.93, 0.95, 0.98);

  // Official Header
  page.drawText('ROMANIA', { x: margin, y: cursorY, size: 9, font: fontBold, color: black });
  cursorY -= 12;
  page.drawText('ADMINISTRATIA PUBLICA LOCALA / DIRECTIA DE IMPOZITE SI TAXE LOCALE', {
    x: margin,
    y: cursorY,
    size: 8.5,
    font: fontBold,
    color: black,
  });
  cursorY -= 11;
  page.drawText(`Judetul/Sectorul: ${sanitizeForPdf(data.domiciliuJudet).toUpperCase()} - Localitatea: ${sanitizeForPdf(data.domiciliuLocalitate).toUpperCase()}`, {
    x: margin,
    y: cursorY,
    size: 8,
    font: fontRegular,
    color: grayText,
  });

  // Top registration stamp box
  const regBoxWidth = 160;
  const regBoxHeight = 50;
  page.drawRectangle({
    x: width - margin - regBoxWidth,
    y: height - margin - regBoxHeight + 8,
    width: regBoxWidth,
    height: regBoxHeight,
    borderWidth: 1,
    borderColor: strokeColor,
    color: rgb(0.98, 0.98, 0.99),
  });
  page.drawText('Nr. Inregistrare: .......................', {
    x: width - margin - regBoxWidth + 8,
    y: height - margin - regBoxHeight + 36,
    size: 7.5,
    font: fontRegular,
    color: grayText,
  });
  page.drawText('Data: ..... / ..... / 202...', {
    x: width - margin - regBoxWidth + 8,
    y: height - margin - regBoxHeight + 20,
    size: 7.5,
    font: fontRegular,
    color: grayText,
  });

  cursorY -= 26;

  // Title
  const title = 'CERERE';
  const titleWidth = fontBold.widthOfTextAtSize(title, 14);
  page.drawText(title, { x: (width - titleWidth) / 2, y: cursorY, size: 14, font: fontBold, color: black });
  cursorY -= 14;

  const subtitle1 = 'PENTRU ELIBERAREA UNUI CERTIFICAT DE ATESTARE FISCALA';
  const subtitle1Width = fontBold.widthOfTextAtSize(subtitle1, 10);
  page.drawText(subtitle1, { x: (width - subtitle1Width) / 2, y: cursorY, size: 10, font: fontBold, color: black });
  cursorY -= 12;

  const subtitle2 = 'privind impozitele si taxele locale si alte venituri datorate bugetului local pentru persoane fizice';
  const subtitle2Width = fontRegular.widthOfTextAtSize(subtitle2, 8);
  page.drawText(subtitle2, { x: (width - subtitle2Width) / 2, y: cursorY, size: 8, font: fontRegular, color: grayText });
  cursorY -= 10;

  const subtitle3 = '(Model ITL - 012 / conform Legii nr. 207/2015 privind Codul de procedura fiscala)';
  const subtitle3Width = fontRegular.widthOfTextAtSize(subtitle3, 7.5);
  page.drawText(subtitle3, { x: (width - subtitle3Width) / 2, y: cursorY, size: 7.5, font: fontRegular, color: grayText });
  cursorY -= 22;

  // Body content box
  page.drawRectangle({
    x: margin,
    y: cursorY - 360,
    width: contentWidth,
    height: 360,
    borderWidth: 0.8,
    borderColor: strokeColor,
    color: rgb(1, 1, 1),
  });

  page.drawRectangle({
    x: margin,
    y: cursorY - 20,
    width: contentWidth,
    height: 20,
    borderWidth: 0.8,
    borderColor: strokeColor,
    color: headerBg,
  });
  page.drawText('DATELE DE IDENTIFICARE ALE CONTRIBUABILULUI SOLICITANT', {
    x: margin + 10,
    y: cursorY - 14,
    size: 8.5,
    font: fontBold,
    color: rgb(0, 0.25, 0.6),
  });

  let fieldY = cursorY - 40;
  page.drawText('Subsemnatul(a):', { x: margin + 12, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.fullName.toUpperCase()), { x: margin + 95, y: fieldY, size: 9.5, font: fontBold, color: black });

  fieldY -= 22;
  page.drawText('Cod Numeric Personal (CNP):', { x: margin + 12, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.cnp), { x: margin + 155, y: fieldY, size: 9.5, font: fontBold, color: black });

  fieldY -= 22;
  page.drawText('Cu domiciliul in Judetul/Sectorul:', { x: margin + 12, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.domiciliuJudet), { x: margin + 160, y: fieldY, size: 9, font: fontBold, color: black });

  page.drawText('Localitatea:', { x: margin + 280, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.domiciliuLocalitate), { x: margin + 340, y: fieldY, size: 9, font: fontBold, color: black });

  fieldY -= 22;
  page.drawText('Strada:', { x: margin + 12, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.domiciliuStrada), { x: margin + 55, y: fieldY, size: 9, font: fontBold, color: black });

  page.drawText('Nr:', { x: margin + 340, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.domiciliuNumar), { x: margin + 365, y: fieldY, size: 9, font: fontBold, color: black });

  fieldY -= 22;
  page.drawText('Telefon de contact:', { x: margin + 12, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.telefon || '-'), { x: margin + 105, y: fieldY, size: 9, font: fontRegular, color: black });

  page.drawText('E-mail:', { x: margin + 260, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.email || '-'), { x: margin + 300, y: fieldY, size: 9, font: fontRegular, color: black });

  fieldY -= 30;
  page.drawLine({
    start: { x: margin, y: fieldY + 10 },
    end: { x: margin + contentWidth, y: fieldY + 10 },
    thickness: 0.5,
    color: strokeColor,
  });

  // Purpose section
  const scopLabels: Record<string, string> = {
    vanzare_imobil: 'In vederea instrăinării / vânzării imobilului (teren / constructie)',
    vanzare_auto: 'In vederea instrainarii / vânzarii mijlocului de transport (auto)',
    credit_bancar: 'In vederea obtinerii unui credit bancar / ipotecar',
    succesiune: 'Pentru dezbaterea succesiunii / dosar notarial',
    infiintare_firma: 'Pentru inregistrarea sediului social la O.N.R.C. / infiintare societate',
    altul: 'Pentru alte necesitati administrative prevazute de lege'
  };

  page.drawText('SOLICIT ELIBERAREA CERTIFICATULUI DE ATESTARE FISCALA:', {
    x: margin + 12,
    y: fieldY - 4,
    size: 9,
    font: fontBold,
    color: rgb(0, 0.25, 0.6),
  });

  fieldY -= 24;
  page.drawText('Scopul utilizarii:', { x: margin + 12, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(scopLabels[data.scopCertificat] || scopLabels.altul), {
    x: margin + 95,
    y: fieldY,
    size: 8.5,
    font: fontBold,
    color: black,
  });

  if (data.detaliiBun) {
    fieldY -= 20;
    page.drawText('Identificare bun / detalii:', { x: margin + 12, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
    page.drawText(sanitizeForPdf(data.detaliiBun), { x: margin + 130, y: fieldY, size: 8.5, font: fontRegular, color: black });
  }

  fieldY -= 24;
  page.drawText('Numar exemplare solicitate:', { x: margin + 12, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText(`${data.numarExemplare || 1} exemplar(e)`, { x: margin + 145, y: fieldY, size: 8.5, font: fontBold, color: black });

  fieldY -= 24;
  page.drawText('Modalitate comunicare:', { x: margin + 12, y: fieldY, size: 8.5, font: fontRegular, color: grayText });
  page.drawText('[X] In format electronic semnat digital la adresa de e-mail mentionata', {
    x: margin + 125,
    y: fieldY,
    size: 8,
    font: fontRegular,
    color: black,
  });

  fieldY -= 32;
  page.drawText('Declar ca nu detin alte debite sau bunuri nedeclarate pe raza altor subunitati administrativ-teritoriale.', {
    x: margin + 12,
    y: fieldY,
    size: 7.5,
    font: fontRegular,
    color: grayText,
  });

  cursorY -= 380;

  // Signatures section
  page.drawText('Data completarii: ..... / ..... / 202...', { x: margin + 12, y: cursorY, size: 8.5, font: fontRegular, color: black });
  page.drawText('Semnatura solicitantului:', { x: margin + 300, y: cursorY, size: 8.5, font: fontBold, color: black });
  page.drawText('......................................................', { x: margin + 280, y: cursorY - 16, size: 8.5, font: fontRegular, color: grayText });

  cursorY -= 50;

  // Official Legal Note Box
  page.drawRectangle({
    x: margin,
    y: cursorY - 70,
    width: contentWidth,
    height: 70,
    borderWidth: 0.8,
    borderColor: strokeColor,
    color: rgb(0.97, 0.98, 0.99),
  });
  page.drawText('IMPORTANT - REGLEMENTARE LEGALA (ART. 158 - 159 COD PROCEDURA FISCALA):', {
    x: margin + 10,
    y: cursorY - 14,
    size: 7.5,
    font: fontBold,
    color: rgb(0.7, 0.2, 0),
  });
  page.drawText('Certificatul de atestare fiscala se elibereaza in termen de cel mult 2 zile lucratoare de la data depunerii cererii.', {
    x: margin + 10,
    y: cursorY - 28,
    size: 7,
    font: fontRegular,
    color: grayText,
  });
  page.drawText('In caz de debite restante (inclusiv amenzi contraventionale neachitate), certificatul va mentiona obligatiile fiscale datorate.', {
    x: margin + 10,
    y: cursorY - 40,
    size: 7,
    font: fontRegular,
    color: grayText,
  });
  page.drawText('Valabilitatea certificatului este de 30 de zile de la data emiterii pentru persoanele fizice.', {
    x: margin + 10,
    y: cursorY - 52,
    size: 7,
    font: fontRegular,
    color: grayText,
  });

  // Watermark footer
  page.drawText('Generat digital prin ZIRO • Modul GhiseuNavigator conform Legii nr. 207/2015', {
    x: margin,
    y: margin / 2,
    size: 7,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}
