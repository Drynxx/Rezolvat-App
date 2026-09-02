import { PDFDocument } from 'pdf-lib';
import { ITL054Data, numberToRomanianWords } from './itl054-generator';
import { getOfficialAcroFormTemplateBytes } from './template-bytes';

/**
 * Sanitizes Romanian diacritics to clean ASCII/WinAnsi characters to prevent PDF font encoding errors
 */
function sanitizeForAcroForm(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/ă/g, 'a').replace(/Ă/g, 'A')
    .replace(/â/g, 'a').replace(/Â/g, 'A')
    .replace(/î/g, 'i').replace(/Î/g, 'I')
    .replace(/ș/g, 's').replace(/Ș/g, 'S')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ț/g, 't').replace(/Ț/g, 'T')
    .replace(/ţ/g, 't').replace(/Ţ/g, 'T');
}

/**
 * Fills the authentic Model 2026 ITL 054 PDF AcroForm fields with exact 1-to-1 mapping for contract_model.pdf.
 * Does NOT modify the underlying PDF structure.
 */
export async function fillExactAcroFormITL054(
  pdfBytes: Uint8Array,
  data: ITL054Data,
  copyLabel?: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  const setSafeText = (fieldName: string, value: string | number | undefined | null) => {
    if (value === undefined || value === null) return;
    const cleanValue = sanitizeForAcroForm(value);
    try {
      const field = form.getTextField(fieldName);
      if (field) {
        field.setText(cleanValue);
      }
    } catch (e) {
      // field not found or not a text field, ignored
    }
  };

  // -------------------------------------------------------------
  // (1) PERSOANA CARE ÎNSTRĂINEAZĂ (VÂNZĂTOR) - Prefixe v_
  // -------------------------------------------------------------
  setSafeText('v_nume', data.seller.fullName);
  setSafeText('v_tara', data.seller.country || 'ROMANIA');
  setSafeText('v_judet', data.seller.county);
  setSafeText('v_cod_postal', data.seller.postalCode || '');
  setSafeText('v_localitate', data.seller.city);
  setSafeText('v_sat_sector', data.seller.sectorOrVillage || '-');
  setSafeText('v_strada', data.seller.street);
  setSafeText('v_nr', data.seller.number);
  setSafeText('v_bl', data.seller.building || '-');
  setSafeText('v_sc', data.seller.staircase || '-');
  setSafeText('v_et', data.seller.floor || '-');
  setSafeText('v_ap', data.seller.apartment || '-');
  setSafeText('v_act_serie', data.seller.idSeries.toUpperCase());
  setSafeText('v_act_nr', data.seller.idNumber);
  setSafeText('v_cnp', data.seller.cnp);
  setSafeText('v_telefon', data.seller.phone || '-');
  setSafeText('v_email', data.seller.email || '-');

  // Domiciliu fiscal vânzător
  setSafeText('v_df_tara', data.seller.country || 'ROMANIA');
  setSafeText('v_df_judet', data.seller.county);
  setSafeText('v_df_cod_postal', data.seller.postalCode || '');
  setSafeText('v_df_localitate', data.seller.city);
  setSafeText('v_df_sat_sector', data.seller.sectorOrVillage || '-');
  setSafeText('v_df_strada', data.seller.street);
  setSafeText('v_df_nr', data.seller.number);
  setSafeText('v_df_bl', data.seller.building || '-');
  setSafeText('v_df_sc', data.seller.staircase || '-');
  setSafeText('v_df_et', data.seller.floor || '-');
  setSafeText('v_df_ap', data.seller.apartment || '-');

  // Fallback for previous naming variations (if any)
  setSafeText('sellerName', data.seller.fullName);
  setSafeText('sellerCountry', data.seller.country || 'ROMANIA');
  setSafeText('sellerCounty', data.seller.county);
  setSafeText('sellerCity', data.seller.city);

  // -------------------------------------------------------------
  // (2) PERSOANA CARE DOBÂNDEȘTE (CUMPĂRĂTOR) - Prefixe c_
  // -------------------------------------------------------------
  setSafeText('c_nume', data.buyer.fullName);
  setSafeText('c_tara', data.buyer.country || 'ROMANIA');
  setSafeText('c_judet', data.buyer.county);
  setSafeText('c_cod_postal', data.buyer.postalCode || '');
  setSafeText('c_localitate', data.buyer.city);
  setSafeText('c_sat_sector', data.buyer.sectorOrVillage || '-');
  setSafeText('c_strada', data.buyer.street);
  setSafeText('c_nr', data.buyer.number);
  setSafeText('c_bl', data.buyer.building || '-');
  setSafeText('c_sc', data.buyer.staircase || '-');
  setSafeText('c_et', data.buyer.floor || '-');
  setSafeText('c_ap', data.buyer.apartment || '-');
  setSafeText('c_act_serie', data.buyer.idSeries.toUpperCase());
  setSafeText('c_act_nr', data.buyer.idNumber);
  setSafeText('c_cnp', data.buyer.cnp);
  setSafeText('c_telefon', data.buyer.phone || '-');
  setSafeText('c_email', data.buyer.email || '-');

  // Domiciliu fiscal cumpărător
  setSafeText('c_df_tara', data.buyer.country || 'ROMANIA');
  setSafeText('c_df_judet', data.buyer.county);
  setSafeText('c_df_cod_postal', data.buyer.postalCode || '');
  setSafeText('c_df_localitate', data.buyer.city);
  setSafeText('c_df_sat_sector', data.buyer.sectorOrVillage || '-');
  setSafeText('c_df_strada', data.buyer.street);
  setSafeText('c_df_nr', data.buyer.number);
  setSafeText('c_df_bl', data.buyer.building || '-');
  setSafeText('c_df_sc', data.buyer.staircase || '-');
  setSafeText('c_df_et', data.buyer.floor || '-');
  setSafeText('c_df_ap', data.buyer.apartment || '-');

  // Fallback for previous naming variations (if any)
  setSafeText('buyerName', data.buyer.fullName);
  setSafeText('buyerForeignCountry', data.buyer.country || 'ROMANIA');
  setSafeText('buyer_judet', data.buyer.county);
  setSafeText('buyer_city', data.buyer.city);

  // -------------------------------------------------------------
  // (3) OBIECTUL CONTRACTULUI (MIJLOC DE TRANSPORT) - Prefixe m_
  // -------------------------------------------------------------
  setSafeText('m_marca', data.vehicle.brand.toUpperCase());
  setSafeText('m_tip', data.vehicle.model.toUpperCase());
  setSafeText('m_vin', data.vehicle.vin.toUpperCase());
  setSafeText('m_serie_motor', data.vehicle.engineSeries || 'FARA SERIE');
  setSafeText('m_cilindree_kw', String(data.vehicle.cylindricalCapacity || '-'));
  setSafeText('m_gma', String(data.vehicle.maxWeight || '-'));
  setSafeText('m_nr_inmatriculare', (data.vehicle.licensePlate || '-').toUpperCase());
  setSafeText('m_itp', data.vehicle.itpExpiryDate || '-');
  setSafeText('m_civ', data.vehicle.civNumber.toUpperCase());
  setSafeText('m_an_fabricatie', String(data.vehicle.yearOfMake || '-'));
  setSafeText('m_norma_euro', data.vehicle.euroNorm || 'Euro 6');
  setSafeText('m_dobandit_data', data.vehicle.acquiredDate || '-');
  setSafeText('m_act', data.vehicle.acquisitionDoc || 'CONTRACT VANZARE-CUMPARARE');

  // Fallback for previous naming variations (if any)
  setSafeText('make', data.vehicle.brand.toUpperCase());
  setSafeText('type', data.vehicle.model.toUpperCase());
  setSafeText('chassisSeries', data.vehicle.vin.toUpperCase());

  // -------------------------------------------------------------
  // (4) PREȚUL & (5) DATA / LOC
  // -------------------------------------------------------------
  const priceDigitsStr = String(data.contract.priceDigits);
  const priceNum = Number(priceDigitsStr.replace(/[^0-9]/g, ''));
  const priceWordsStr = data.contract.priceWords || numberToRomanianWords(priceNum);

  setSafeText('pret_cifre', `${priceDigitsStr} LEI`);
  setSafeText('pret_litere', priceWordsStr);
  setSafeText('contract_data', data.contract.date);
  setSafeText('contract_loc', data.contract.location);
  setSafeText('contractPlace', data.contract.location);

  return await pdfDoc.save();
}

/**
 * Generates the complete 5-Page Official Bundle using contract_model.pdf
 */
export async function generate5CopyAcroFormDossier(
  data: ITL054Data,
  customTemplateBytes?: Uint8Array
): Promise<Uint8Array> {
  const baseBytes = customTemplateBytes || (await getOfficialAcroFormTemplateBytes());
  const finalPdf = await PDFDocument.create();

  const copies = [
    'Exemplar 1: Pentru Cumparator (Original)',
    'Exemplar 2: Pentru Vanzator',
    'Exemplar 3: Pentru DITL (Vanzator)',
    'Exemplar 4: Pentru DITL (Cumparator)',
    'Exemplar 5: Pentru DGPCI (Inmatriculari)'
  ];

  for (let i = 0; i < copies.length; i++) {
    // Fill the authentic AcroForm template
    const filledPageBytes = await fillExactAcroFormITL054(baseBytes, data, copies[i]);
    const filledDoc = await PDFDocument.load(filledPageBytes);
    const [copiedPage] = await finalPdf.copyPages(filledDoc, [0]);
    finalPdf.addPage(copiedPage);
  }

  return await finalPdf.save();
}
