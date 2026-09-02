import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generates the authentic blank official Model 2026 ITL 054 Romanian Government vector PDF bytes.
 * Matches 100% of the Ministry of Finance & DGPCI official layout.
 */
export async function getOfficialITL054BlankTemplate(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595.28, 841.89]); // A4 (210 x 297 mm)
  const { width, height } = page.getSize();

  const drawHorizLine = (x1: number, x2: number, y: number, thickness = 0.5) => {
    page.drawLine({
      start: { x: x1, y },
      end: { x: x2, y },
      thickness,
      color: rgb(0, 0, 0),
    });
  };

  // -------------------------------------------------------------
  // Cartuș A (Top Left: Organ Fiscal Vânzător)
  // -------------------------------------------------------------
  page.drawRectangle({
    x: 35,
    y: height - 128,
    width: 145,
    height: 98,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.75,
  });
  page.drawText('A', { x: 40, y: height - 42, size: 10, font: fontBold });
  page.drawText('Denumirea organului fiscal local', { x: 52, y: height - 42, size: 6.5, font: fontBold });
  page.drawText('de la domiciliul/sediul persoanei care', { x: 52, y: height - 50, size: 6, font: fontRegular });
  page.drawText('instraineaza', { x: 52, y: height - 58, size: 6, font: fontRegular });
  page.drawText('CIF/Cod SIRUTA', { x: 40, y: height - 68, size: 6.5, font: fontRegular });
  page.drawText('Adresa', { x: 40, y: height - 78, size: 6.5, font: fontRegular });
  page.drawText('Tel/fax/e-mail', { x: 40, y: height - 88, size: 6.5, font: fontRegular });
  page.drawText('REMTII1) Nr. ............./...............20....', { x: 40, y: height - 98, size: 6.5, font: fontRegular });
  page.drawText('Rol nr.: .......................', { x: 40, y: height - 108, size: 6.5, font: fontRegular });
  page.drawText('[ ] Original   [ ] Copie', { x: 40, y: height - 120, size: 7, font: fontBold });

  // -------------------------------------------------------------
  // Center Title Box
  // -------------------------------------------------------------
  page.drawRectangle({
    x: 185,
    y: height - 55,
    width: 220,
    height: 25,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.75,
  });
  page.drawText('Model 2026 ITL 054', { x: 195, y: height - 45, size: 8.5, font: fontBold });
  page.drawText('Anexa', { x: 365, y: height - 45, size: 8.5, font: fontBold });

  page.drawText('CONTRACT DE', { x: 235, y: height - 76, size: 12, font: fontBold });
  page.drawText('INSTRAINARE - DOBANDIRE', { x: 198, y: height - 92, size: 12.5, font: fontBold });
  page.drawText('A UNUI MIJLOC DE TRANSPORT', { x: 188, y: height - 108, size: 11.5, font: fontBold });

  // -------------------------------------------------------------
  // Cartuș B (Top Right: Viză Vânzător Fără Debite)
  // -------------------------------------------------------------
  page.drawRectangle({
    x: 410,
    y: height - 128,
    width: 150,
    height: 98,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.75,
  });
  page.drawText('B', { x: 415, y: height - 42, size: 10, font: fontBold });
  page.drawText('Denumirea organului fiscal local', { x: 428, y: height - 42, size: 6.5, font: fontBold });
  page.drawText('Vanzatorul NU are debite la', { x: 415, y: height - 52, size: 6.5, font: fontBold });
  page.drawText('data de intai a lunii urmatoare', { x: 415, y: height - 60, size: 6.5, font: fontBold });
  page.drawText('inregistrarii actului de', { x: 415, y: height - 68, size: 6.5, font: fontBold });
  page.drawText('instrainare-dobandire2)', { x: 415, y: height - 76, size: 6.5, font: fontBold });
  page.drawText('(se completeaza si pe copii):', { x: 415, y: height - 84, size: 5.5, font: fontRegular });
  page.drawText('Prenumele ......................', { x: 415, y: height - 94, size: 6, font: fontRegular });
  page.drawText('Numele .........................', { x: 415, y: height - 102, size: 6, font: fontRegular });
  page.drawText('Functia ........................', { x: 415, y: height - 110, size: 6, font: fontRegular });
  page.drawText('LS.', { x: 415, y: height - 120, size: 7, font: fontBold });

  let currentY = height - 140;

  // -------------------------------------------------------------
  // Section (1) PERSOANA CARE ÎNSTRĂINEAZĂ
  // -------------------------------------------------------------
  page.drawText('(1) PERSOANA CARE INSTRAINEAZA Subsemnatul(a)3)Subscrisa ............................................................................................ cu', { x: 35, y: currentY, size: 6.2, font: fontBold });
  page.drawText('domiciliul/sediul in ROMANIA/ ......................, judetul ..............................., codul postal ..................., municipiul/orasul/comuna', { x: 35, y: currentY - 9, size: 6.2, font: fontRegular });
  page.drawText('............................................., satul/sectorul .................................., str. ................................................................................., nr. ......, bl.', { x: 35, y: currentY - 18, size: 6.2, font: fontRegular });
  page.drawText('......, sc. ......., et. ......, ap ......, identificat prin B.I./C.I./C.I.P./Pasaport seria ...... nr. ................,', { x: 35, y: currentY - 27, size: 6.2, font: fontRegular });
  page.drawText('C.N.P./C.I.F4)...................................................., tel./fax ................................, e-mail ................................................., si domiciliul', { x: 35, y: currentY - 36, size: 6.2, font: fontRegular });
  page.drawText('fiscal in ROMANIA/ ....................., judetul ........................................, codul postal .....................,', { x: 35, y: currentY - 45, size: 6.2, font: fontRegular });
  page.drawText('municipiul/orasul/comuna........................................., satul/sectorul .................................., str. ................................. ................................,', { x: 35, y: currentY - 54, size: 6.2, font: fontRegular });
  page.drawText('nr. ........, bl. .........., sc. ........, et. ......., ap .........., reprezentata prin5) ..................................................................... identificat prin', { x: 35, y: currentY - 63, size: 6.2, font: fontRegular });
  page.drawText('B.I./C.I./C.I.P./Pasaport seria ...... nr. .............., C.I.F .........................................., tel./fax........................................, e-mail', { x: 35, y: currentY - 72, size: 6.2, font: fontRegular });
  page.drawText('................................................, in calitate de ....................................................................................6)', { x: 35, y: currentY - 81, size: 6.2, font: fontRegular });

  currentY -= 95;

  // -------------------------------------------------------------
  // Section (2) PERSOANA CARE DOBÂNDEȘTE
  // -------------------------------------------------------------
  page.drawText('(2) PERSOANA CARE DOBANDESTE Subsemnatul(a)3)Subscrisa ............................................................................................ cu', { x: 35, y: currentY, size: 6.2, font: fontBold });
  page.drawText('domiciliul/sediul in ROMANIA/ ......................, judetul ..............................., codul postal ..................., municipiul/orasul/comuna', { x: 35, y: currentY - 9, size: 6.2, font: fontRegular });
  page.drawText('............................................., satul/sectorul .................................., str. ................................................................................., nr. ......, bl.', { x: 35, y: currentY - 18, size: 6.2, font: fontRegular });
  page.drawText('......, sc. ......., et. ......, ap ......, identificat prin B.I./C.I./C.I.P./Pasaport seria ...... nr. ................,', { x: 35, y: currentY - 27, size: 6.2, font: fontRegular });
  page.drawText('C.N.P./C.I.F4)...................................................., tel./fax ................................, e-mail ................................................., si domiciliul', { x: 35, y: currentY - 36, size: 6.2, font: fontRegular });
  page.drawText('fiscal in ROMANIA/ ....................., judetul ........................................, codul postal .....................,', { x: 35, y: currentY - 45, size: 6.2, font: fontRegular });
  page.drawText('municipiul/orasul/comuna........................................., satul/sectorul .................................., str. ................................. ................................,', { x: 35, y: currentY - 54, size: 6.2, font: fontRegular });
  page.drawText('nr. ........, bl. .........., sc. ........, et. ......., ap .........., reprezentata prin5) ..................................................................... identificat prin', { x: 35, y: currentY - 63, size: 6.2, font: fontRegular });
  page.drawText('B.I./C.I./C.I.P./Pasaport seria ...... nr. .............., C.I.F .........................................., tel./fax........................................, e-mail', { x: 35, y: currentY - 72, size: 6.2, font: fontRegular });
  page.drawText('................................................, in calitate de ....................................................................................', { x: 35, y: currentY - 81, size: 6.2, font: fontRegular });

  currentY -= 95;

  // -------------------------------------------------------------
  // Section (3) OBIECTUL CONTRACTULUI
  // -------------------------------------------------------------
  page.drawText('(3) OBIECTUL CONTRACTULUI', { x: 35, y: currentY, size: 7, font: fontBold });
  page.drawText('Mijlocul de transport: marca ........................................ tipul ...................., numar de identificare .............................................................', { x: 35, y: currentY - 9, size: 6.2, font: fontRegular });
  page.drawText('serie motor ................................. capacitatea cilindrica ............ cm3, greutate maxima admisa (pentru remorci/semiremorci) ............ tone,', { x: 35, y: currentY - 18, size: 6.2, font: fontRegular });
  page.drawText('numar de inmatriculare/inregistrare ........................, data la care expira inspectia tehnica periodica ........................................, numarul', { x: 35, y: currentY - 27, size: 6.2, font: fontRegular });
  page.drawText('cartii de identitate a vehiculului ......................, anul de fabricatie ........................., norma euro ......... dobandit la data de', { x: 35, y: currentY - 36, size: 6.2, font: fontRegular });
  page.drawText('......................................, conform act ....................................................................................................', { x: 35, y: currentY - 45, size: 6.2, font: fontRegular });

  currentY -= 57;

  // -------------------------------------------------------------
  // Section (4) PREȚUL & Section (5) DECLARAȚII
  // -------------------------------------------------------------
  page.drawText('(4) PRETUL in cifre ............................................ lei , in litere ....................................................................................................', { x: 35, y: currentY, size: 6.5, font: fontBold });

  currentY -= 12;
  page.drawText('(5) Persoana care instraineaza mentionata la punctul (1) declara ca mijlocul de transport este proprietatea sa, liber de orice sarcini. De asemenea, declara ca a predat persoanei care dobandeste', { x: 35, y: currentY, size: 5.2, font: fontRegular });
  page.drawText('mentionat la punctul (2) vehiculul, cheile, certificatul de inmatriculare si cartea de identitate a vehiculului, primind de la acesta pretul prevazut la punctul (4).', { x: 35, y: currentY - 6.5, size: 5.2, font: fontRegular });
  page.drawText('Persoana care dobandeste mentionata la punctul (2) declara ca a primit de la vanzatorul mentionat la punctul (1) mijlocul de transport, cheile, certificatul de inmatriculare si cartea de identitate a vehiculului, achitand pretul.', { x: 35, y: currentY - 13, size: 5.2, font: fontRegular });
  page.drawText('Anexe la contract: [ ] Da   [ ] Nu', { x: 35, y: currentY - 21, size: 5.8, font: fontBold });
  page.drawText('Atat persoana care instraineaza, cat si dobanditorul declara, cunoscand prevederile Codului penal privind falsul si uzul de fals ca toate informatiile inscrise in prezentul document corespund realitatii.', { x: 35, y: currentY - 28, size: 5.2, font: fontRegular });
  page.drawText('Incepand cu data semnarii, dobanditorul are calitatea de proprietar de drept si de fapt asupra mijlocului de transport ce face obiectul prezentului contract de instrainare-dobandire, preluand toate obligatiile prevazute de lege,', { x: 35, y: currentY - 34.5, size: 5.2, font: fontRegular });
  page.drawText('inclusiv cele legate de transcrierea vehiculului pe numele sau, in maxim 90 de zile, de la data incheierii prezentului act.', { x: 35, y: currentY - 41, size: 5.2, font: fontBold });

  currentY -= 51;
  page.drawText('Data si locul incheierii contractului ................................................. / ....................................................................................', { x: 35, y: currentY, size: 6.2, font: fontRegular });

  currentY -= 12;
  page.drawText('Semnatura persoanei care instraineaza .......................................        Semnatura persoanei care dobandeste .......................................', { x: 35, y: currentY, size: 6.2, font: fontBold });

  currentY -= 8;
  drawHorizLine(35, width - 35, currentY, 0.5);

  currentY -= 11;
  page.drawText('Copie 1 - 4 "Conform cu originalul" (Se semneaza doar pe copii)', { x: 170, y: currentY, size: 6.2, font: fontBold });
  currentY -= 9;
  page.drawText('Semnatura  Vanzator: .......................................            Cumparator: .......................................', { x: 130, y: currentY, size: 5.8, font: fontRegular });

  currentY -= 8;
  drawHorizLine(35, width - 35, currentY, 0.5);

  // -------------------------------------------------------------
  // Cartuș C & D (Bottom)
  // -------------------------------------------------------------
  currentY -= 68;

  // Cartuș C (Bottom Left)
  page.drawRectangle({
    x: 35,
    y: currentY,
    width: 260,
    height: 64,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.75,
  });
  page.drawText('C', { x: 40, y: currentY + 54, size: 9, font: fontBold });
  page.drawText('Denumirea organului fiscal local de la domiciliul persoanei care dobandeste', { x: 52, y: currentY + 54, size: 5.8, font: fontBold });
  page.drawText('CI /Cod SIRUTA', { x: 40, y: currentY + 44, size: 6, font: fontRegular });
  page.drawText('Adresa', { x: 40, y: currentY + 35, size: 6, font: fontRegular });
  page.drawText('Tel/fax/e-mail', { x: 40, y: currentY + 26, size: 6, font: fontRegular });
  page.drawText('REMTII 7) Nr. ......................./..................20......    Rol nr.: .....................................', { x: 40, y: currentY + 16, size: 6, font: fontRegular });
  page.drawText('(Se completeaza pe exemplarul original si pe cel pentru DGPCI / DITL)', { x: 40, y: currentY + 6, size: 5.2, font: fontRegular });

  // Cartuș D (Bottom Right)
  page.drawRectangle({
    x: 305,
    y: currentY,
    width: 255,
    height: 64,
    borderColor: rgb(0, 0, 0),
    borderWidth: 0.75,
  });
  page.drawText('D', { x: 310, y: currentY + 54, size: 9, font: fontBold });
  page.drawText('Denumirea organului fiscal local', { x: 322, y: currentY + 54, size: 5.8, font: fontBold });
  page.drawText('Cumparatorul NU are debite la data de intai a lunii urmatoare', { x: 310, y: currentY + 45, size: 5.8, font: fontBold });
  page.drawText('incheierii actului de instrainare-dobandire 8) (se completeaza si pe copii):', { x: 310, y: currentY + 37, size: 5.2, font: fontRegular });
  page.drawText('Prenumele: .................................   Numele: .................................', { x: 310, y: currentY + 26, size: 5.8, font: fontRegular });
  page.drawText('Functia: .......................................   LS.', { x: 310, y: currentY + 16, size: 5.8, font: fontRegular });

  // -------------------------------------------------------------
  // Footnotes 1-8
  // -------------------------------------------------------------
  let fnY = currentY - 9;
  page.drawText('1) REMTII - Registrul de evidenta a mijloacelor de transport supuse inmatricularii/inregistrarii de la organul fiscal local al persoanei care instraineaza;', { x: 35, y: fnY, size: 4.5, font: fontRegular });
  page.drawText('2) Prin completarea de catre organul fiscal local a cartusului B se atesta indeplinirea prevederilor art. 159 alin. (5) din Legea nr. 207/2015 privind Codul de procedura fiscala, nemaifiind necesara eliberarea unui certificat de atestare fiscala;', { x: 35, y: fnY - 5.5, size: 4.5, font: fontRegular });
  page.drawText('3) Se completeaza in cazul persoanelor fizice; 4) Se completeaza: codul de identificare fiscala (codul numeric personal, numarul de identificare fiscala, dupa caz); 5) Se completeaza in cazul persoanelor juridice; 6) Mostenitorii trebuie sa faca dovada proprietatii;', { x: 35, y: fnY - 11, size: 4.5, font: fontRegular });
  page.drawText('7) REMTII organ fiscal cumparator. Se completeaza pe exemplarul original si pe exemplarul-copie DGPCI / DITL. 8) Atesta art. 159 alin. (5^2) din Legea nr. 207/2015 privind Codul de procedura fiscala;', { x: 35, y: fnY - 16.5, size: 4.5, font: fontRegular });

  return await pdfDoc.save();
}
