import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { BuletinFormData } from '../../types/ghiseu';

/**
 * Normalizes Romanian diacritics for standard WinAnsi Helvetica encoding.
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
    .replace(/[^\x00-\x7F]/g, '');
}

export async function generateCerereBuletinPdf(data: BuletinFormData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const margin = 40;
  const contentWidth = width - margin * 2;
  let cursorY = height - margin;

  // Colors
  const black = rgb(0.1, 0.1, 0.1);
  const grayText = rgb(0.35, 0.35, 0.35);
  const strokeColor = rgb(0.7, 0.75, 0.8);
  const headerBg = rgb(0.93, 0.95, 0.98);

  // 1. Header Official Text
  page.drawText('ROMANIA', { x: margin, y: cursorY, size: 9, font: fontBold, color: black });
  cursorY -= 12;
  page.drawText('MINISTERUL AFACERILOR INTERNE', { x: margin, y: cursorY, size: 8, font: fontRegular, color: black });
  cursorY -= 11;
  page.drawText('DIRECTIA GENERALA PENTRU EVIDENTA PERSOANELOR', { x: margin, y: cursorY, size: 8, font: fontRegular, color: black });
  cursorY -= 11;
  page.drawText('SERVICIUL PUBLIC COMUNITAR LOCAL DE EVIDENTA A PERSOANELOR', { x: margin, y: cursorY, size: 8, font: fontBold, color: black });

  // Official Box on the right (Clerk filing box)
  const clerkBoxWidth = 160;
  const clerkBoxHeight = 55;
  const clerkBoxX = width - margin - clerkBoxWidth;
  const clerkBoxY = height - margin - clerkBoxHeight + 10;
  page.drawRectangle({
    x: clerkBoxX,
    y: clerkBoxY,
    width: clerkBoxWidth,
    height: clerkBoxHeight,
    borderWidth: 1,
    borderColor: strokeColor,
    color: rgb(0.98, 0.98, 0.99),
  });
  page.drawText('Nr. Inregistrare: .......................', { x: clerkBoxX + 8, y: clerkBoxY + 38, size: 7.5, font: fontRegular, color: grayText });
  page.drawText('Data: ..... / ..... / 202...', { x: clerkBoxX + 8, y: clerkBoxY + 24, size: 7.5, font: fontRegular, color: grayText });
  page.drawText('Lucrator: ...............................', { x: clerkBoxX + 8, y: clerkBoxY + 10, size: 7.5, font: fontRegular, color: grayText });

  cursorY -= 22;

  // Title
  const title = 'CERERE PENTRU ELIBERAREA ACTULUI DE IDENTITATE';
  const titleWidth = fontBold.widthOfTextAtSize(title, 12);
  page.drawText(title, { x: (width - titleWidth) / 2, y: cursorY, size: 12, font: fontBold, color: black });
  cursorY -= 13;

  const subtitle = '(conform H.G. nr. 295/2021 pentru aprobarea Normelor metodologice de aplicare a O.U.G. nr. 97/2005)';
  const subtitleWidth = fontRegular.widthOfTextAtSize(subtitle, 8);
  page.drawText(subtitle, { x: (width - subtitleWidth) / 2, y: cursorY, size: 8, font: fontRegular, color: grayText });
  cursorY -= 20;

  // Helper for section box
  const drawSection = (sectionTitle: string, h: number) => {
    page.drawRectangle({
      x: margin,
      y: cursorY - h,
      width: contentWidth,
      height: h,
      borderWidth: 0.8,
      borderColor: strokeColor,
      color: rgb(1, 1, 1),
    });
    // Header strip
    page.drawRectangle({
      x: margin,
      y: cursorY - 18,
      width: contentWidth,
      height: 18,
      borderWidth: 0.8,
      borderColor: strokeColor,
      color: headerBg,
    });
    page.drawText(sectionTitle, { x: margin + 8, y: cursorY - 13, size: 8.5, font: fontBold, color: rgb(0, 0.25, 0.6) });
  };

  // --- SECTIUNEA 1: DATELE DE IDENTIFICARE ALE SOLICITANTULUI ---
  const s1Height = 110;
  drawSection('1. DATELE DE IDENTIFICARE ALE SOLICITANTULUI', s1Height);

  let fieldY = cursorY - 32;
  page.drawText('Nume de familie:', { x: margin + 10, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.nume.toUpperCase()), { x: margin + 85, y: fieldY, size: 9, font: fontBold, color: black });

  page.drawText('Prenume:', { x: margin + 260, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.prenume.toUpperCase()), { x: margin + 310, y: fieldY, size: 9, font: fontBold, color: black });

  fieldY -= 18;
  page.drawText('Cod Numeric Personal (CNP):', { x: margin + 10, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.cnp), { x: margin + 140, y: fieldY, size: 9.5, font: fontBold, color: black });

  fieldY -= 18;
  page.drawText('Locul nasterii: Judetul:', { x: margin + 10, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.loculNasteriiJudet || '-'), { x: margin + 105, y: fieldY, size: 8.5, font: fontBold, color: black });

  page.drawText('Localitatea:', { x: margin + 240, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.loculNasteriiLocalitate || '-'), { x: margin + 295, y: fieldY, size: 8.5, font: fontBold, color: black });

  fieldY -= 18;
  page.drawText('Prenumele parintilor: Tatal:', { x: margin + 10, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.numeTata || '-'), { x: margin + 125, y: fieldY, size: 8.5, font: fontBold, color: black });

  page.drawText('Mama:', { x: margin + 280, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.numeMama || '-'), { x: margin + 315, y: fieldY, size: 8.5, font: fontBold, color: black });

  fieldY -= 18;
  page.drawText('Telefon contact:', { x: margin + 10, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.telefon || '-'), { x: margin + 85, y: fieldY, size: 8.5, font: fontBold, color: black });

  page.drawText('E-mail:', { x: margin + 240, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.email || '-'), { x: margin + 275, y: fieldY, size: 8.5, font: fontBold, color: black });

  cursorY -= (s1Height + 12);

  // --- SECTIUNEA 2: DOMICILIUL SOLICITAT ---
  const s2Height = 85;
  drawSection('2. DOMICILIUL / RESEDINTA SOLICITATA', s2Height);

  fieldY = cursorY - 32;
  page.drawText('Judet / Sector:', { x: margin + 10, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.adresaNouaJudet || '-'), { x: margin + 80, y: fieldY, size: 8.5, font: fontBold, color: black });

  page.drawText('Localitate:', { x: margin + 220, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.adresaNouaLocalitate || '-'), { x: margin + 270, y: fieldY, size: 8.5, font: fontBold, color: black });

  fieldY -= 18;
  page.drawText('Strada:', { x: margin + 10, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.adresaNouaStrada || '-'), { x: margin + 50, y: fieldY, size: 8.5, font: fontBold, color: black });

  page.drawText('Nr:', { x: margin + 320, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.adresaNouaNumar || '-'), { x: margin + 340, y: fieldY, size: 8.5, font: fontBold, color: black });

  fieldY -= 18;
  const addressParts = `Bl. ${data.adresaNouaBloc || '-'}   Sc. ${data.adresaNouaScara || '-'}   Et. ${data.adresaNouaEtaj || '-'}   Ap. ${data.adresaNouaAp || '-'}`;
  page.drawText('Detaliere imobil:', { x: margin + 10, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(addressParts), { x: margin + 90, y: fieldY, size: 8.5, font: fontBold, color: black });

  cursorY -= (s2Height + 12);

  // --- SECTIUNEA 3: MOTIVUL ELIBERARII ---
  const s3Height = 60;
  drawSection('3. MOTIVUL SOLICITARII ELIBERARII ACTULUI DE IDENTITATE', s3Height);

  fieldY = cursorY - 32;
  page.drawText('Motivul legal bifat:', { x: margin + 10, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText(sanitizeForPdf(data.motivSolicitare || 'Expirare termen valabilitate / Schimbare domiciliu'), {
    x: margin + 105,
    y: fieldY,
    size: 8.5,
    font: fontBold,
    color: black,
  });

  fieldY -= 15;
  page.drawText('Taxa eliberare C.I.:', { x: margin + 10, y: fieldY, size: 8, font: fontRegular, color: grayText });
  page.drawText('7 RON (achitata electronic prin Ghiseul.ro / casierie)', {
    x: margin + 105,
    y: fieldY,
    size: 8,
    font: fontRegular,
    color: rgb(0, 0.5, 0.2),
  });

  cursorY -= (s3Height + 12);

  // --- SECTIUNEA 4: DECLARATIE PE PROPRIA RASPUNDERE & SEMNATURA ---
  const s4Height = 110;
  drawSection('4. DECLARATIE PE PROPRIA RASPUNDERE SI SEMNATURA SOLICITANTULUI', s4Height);

  fieldY = cursorY - 30;
  const declText1 = 'Subsemnatul(a), declar pe propria raspundere ca datele mentionate in prezenta cerere sunt reale si corecte,';
  const declText2 = 'luand la cunostinta prevederile art. 326 din Codul Penal privind falsul in declaratii.';
  page.drawText(declText1, { x: margin + 10, y: fieldY, size: 7.5, font: fontRegular, color: grayText });
  fieldY -= 11;
  page.drawText(declText2, { x: margin + 10, y: fieldY, size: 7.5, font: fontRegular, color: grayText });

  fieldY -= 35;
  page.drawText('Data completarii: ..... / ..... / 202...', { x: margin + 15, y: fieldY, size: 8.5, font: fontRegular, color: black });

  page.drawText('Semnatura solicitantului:', { x: margin + 300, y: fieldY + 12, size: 8.5, font: fontBold, color: black });
  page.drawText('......................................................', { x: margin + 280, y: fieldY - 5, size: 8.5, font: fontRegular, color: grayText });
  page.drawText('(se semneaza in fata lucratorului SPCLEP)', { x: margin + 285, y: fieldY - 17, size: 7, font: fontRegular, color: grayText });

  cursorY -= (s4Height + 12);

  // --- SECTIUNEA 5: REZERVAT FUNCTIONARULUI PUBLIC (CARTUS OFICIAL) ---
  const s5Height = 110;
  page.drawRectangle({
    x: margin,
    y: cursorY - s5Height,
    width: contentWidth,
    height: s5Height,
    borderWidth: 0.8,
    borderColor: strokeColor,
    color: rgb(0.97, 0.98, 0.99),
  });
  page.drawRectangle({
    x: margin,
    y: cursorY - 18,
    width: contentWidth,
    height: 18,
    borderWidth: 0.8,
    borderColor: strokeColor,
    color: rgb(0.9, 0.92, 0.95),
  });
  page.drawText('REZERVAT SERVICIULUI PUBLIC COMUNITAR DE EVIDENTA A PERSOANELOR', {
    x: margin + 8,
    y: cursorY - 13,
    size: 8,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2),
  });

  fieldY = cursorY - 32;
  page.drawText('Actul de identitate eliberat: Seria: ........  Nr: ......................  Valabilitate: ..... / ..... / .........', {
    x: margin + 10,
    y: fieldY,
    size: 8,
    font: fontRegular,
    color: grayText,
  });
  fieldY -= 18;
  page.drawText('Dovada spatiului locativ verificata: [  ] Original prezentat   [  ] Copie retinuta   [  ] Viza ANAF', {
    x: margin + 10,
    y: fieldY,
    size: 8,
    font: fontRegular,
    color: grayText,
  });
  fieldY -= 18;
  page.drawText('Luat in spatiu de: .................................................................  Semnatura gazduitor: ........................', {
    x: margin + 10,
    y: fieldY,
    size: 8,
    font: fontRegular,
    color: grayText,
  });
  fieldY -= 18;
  page.drawText('Semnatura de primire a actului nou de catre titular: ................................................................', {
    x: margin + 10,
    y: fieldY,
    size: 8,
    font: fontRegular,
    color: grayText,
  });

  // Footer note
  page.drawText('Generat digital prin ZIRO • Modul GhiseuNavigator conform HG 295/2021', {
    x: margin,
    y: margin / 2,
    size: 7,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  return await pdfDoc.save();
}
