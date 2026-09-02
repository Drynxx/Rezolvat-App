import { PDFDocument } from 'pdf-lib';
import { generate5CopyAcroFormDossier, fillExactAcroFormITL054 } from './acroform-filler';
import { getOfficialAcroFormTemplateBytes } from './template-bytes';

export interface ITL054Data {
  // Secțiunea (1) Vânzător (Persoana care înstrăinează)
  seller: {
    fullName: string;
    country?: string;
    county: string; // Județ
    postalCode?: string;
    city: string; // Municipiul/Orașul/Comuna
    sectorOrVillage?: string; // Sector / Sat
    street: string;
    number: string; // Nr.
    building?: string; // Bl.
    staircase?: string; // Sc.
    floor?: string; // Et.
    apartment?: string; // Ap.
    idSeries: string; // Seria CI
    idNumber: string; // Număr CI
    cnp: string;
    phone?: string;
    email?: string;
  };

  // Secțiunea (2) Cumpărător (Persoana care dobândește)
  buyer: {
    fullName: string;
    country?: string;
    county: string;
    postalCode?: string;
    city: string;
    sectorOrVillage?: string;
    street: string;
    number: string;
    building?: string;
    staircase?: string;
    floor?: string;
    apartment?: string;
    idSeries: string;
    idNumber: string;
    cnp: string;
    phone?: string;
    email?: string;
  };

  // Secțiunea (3) Obiectul Contractului (Vehicul)
  vehicle: {
    brand: string; // Marca (ex: VOLKSWAGEN)
    model: string; // Tipul (ex: GOLF 7)
    vin: string; // Număr de identificare (Serie Șasiu)
    engineSeries?: string; // Serie motor
    cylindricalCapacity?: string | number; // cm³
    maxWeight?: string | number; // Greutate maximă admisă (tone)
    licensePlate?: string; // Nr. de înmatriculare actual
    itpExpiryDate?: string; // Data expirare ITP
    civNumber: string; // Numărul cărții de identitate a vehiculului (CIV)
    yearOfMake?: string | number; // Anul de fabricație
    euroNorm?: string; // Norma Euro (ex: EURO 6)
    acquiredDate?: string; // Dobândit la data de
    acquisitionDoc?: string; // Conform act
  };

  // Secțiunea (4) Prețul & Data
  contract: {
    priceDigits: string | number; // ex: "25.000"
    priceWords?: string; // ex: "douăzeci și cinci mii lei"
    date: string; // ex: "28.08.2026"
    location: string; // ex: "București, Sector 1"
  };
}

export type ITL054DataPayload = {
  sellerFiscalOrg?: {
    name?: string;
    cifSiruta?: string;
    address?: string;
    contact?: string;
    remtiiNumber?: string;
    remtiiDate?: string;
    rolNumber?: string;
  };
  seller: {
    fullName: string;
    country?: string;
    county: string;
    postalCode?: string;
    city: string;
    sector?: string;
    street: string;
    number: string;
    block?: string;
    staircase?: string;
    floor?: string;
    apartment?: string;
    ciSeries: string;
    ciNumber: string;
    cnp: string;
    phone?: string;
    email?: string;
  };
  buyer: {
    fullName: string;
    country?: string;
    county: string;
    postalCode?: string;
    city: string;
    sector?: string;
    street: string;
    number: string;
    block?: string;
    staircase?: string;
    floor?: string;
    apartment?: string;
    ciSeries: string;
    ciNumber: string;
    cnp: string;
    phone?: string;
    email?: string;
  };
  buyerFiscalOrg?: {
    name?: string;
    cifSiruta?: string;
    address?: string;
    contact?: string;
    remtiiNumber?: string;
    remtiiDate?: string;
    rolNumber?: string;
  };
  vehicle: {
    make: string;
    type: string;
    vin: string;
    engineSerial?: string;
    displacementCm3?: number;
    maxMassTons?: number;
    plateNumber?: string;
    itpExpiryDate?: string;
    civSeries: string;
    firstRegYear?: number;
    euroNorm?: string;
    acquiredDate?: string;
    acquisitionAct?: string;
  };
  commercial: {
    priceRon: number;
    priceRonWords: string;
    hasAnnexes?: boolean;
    contractDate: string;
    contractPlace: string;
  };
};

/**
 * Converts numbers to Romanian words for the price in words field
 */
export function numberToRomanianWords(num: number): string {
  if (!num || isNaN(num)) return '';
  const units = ['', 'unu', 'doi', 'trei', 'patru', 'cinci', 'șase', 'șapte', 'opt', 'nouă'];
  const teens = ['zece', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece', 'cincisprezece', 'șaisprezece', 'șaptesprezece', 'optsprezece', 'nouăsprezece'];
  const tens = ['', 'zece', 'douăzeci', 'treizeci', 'patruzeci', 'cincizeci', 'șaizeci', 'șaptezeci', 'optzeci', 'nouăzeci'];

  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const unit = num % 10;
    return `${tens[Math.floor(num / 10)]}${unit ? ` și ${units[unit]}` : ''}`;
  }
  if (num < 1000) {
    const h = Math.floor(num / 100);
    const rest = num % 100;
    const hStr = h === 1 ? 'o sută' : h === 2 ? 'două sute' : `${units[h]} sute`;
    return `${hStr}${rest ? ` ${numberToRomanianWords(rest)}` : ''}`;
  }
  if (num < 1000000) {
    const k = Math.floor(num / 1000);
    const rest = num % 1000;
    const kStr = k === 1 ? 'o mie' : k === 2 ? 'două mii' : `${numberToRomanianWords(k)} mii`;
    return `${kStr}${rest ? ` ${numberToRomanianWords(rest)}` : ''}`;
  }
  return `${num} lei`;
}

/**
 * Generates the complete 5-Page Official Dossier using the authentic AcroForm 104-field template
 */
export async function generateComplete5CopyPDF(
  data: ITL054Data,
  customTemplateBytes?: Uint8Array
): Promise<Uint8Array> {
  return await generate5CopyAcroFormDossier(data, customTemplateBytes);
}

/**
 * Compatibility alias for AutoDoxEditorModal and legacy callers
 */
export const generateItl054BundlePdf = async (data: any): Promise<Uint8Array> => {
  const normalizedData: ITL054Data = {
    seller: {
      fullName: data.seller?.fullName || '',
      country: data.seller?.country || 'ROMÂNIA',
      county: data.seller?.county || '',
      postalCode: data.seller?.postalCode || '',
      city: data.seller?.city || '',
      sectorOrVillage: data.seller?.sector || data.seller?.sectorOrVillage || '',
      street: data.seller?.street || '',
      number: data.seller?.number || '',
      building: data.seller?.block || data.seller?.building || '',
      staircase: data.seller?.staircase || '',
      floor: data.seller?.floor || '',
      apartment: data.seller?.apartment || '',
      idSeries: data.seller?.ciSeries || data.seller?.idSeries || '',
      idNumber: data.seller?.ciNumber || data.seller?.idNumber || '',
      cnp: data.seller?.cnp || '',
      phone: data.seller?.phone || '',
      email: data.seller?.email || '',
    },
    buyer: {
      fullName: data.buyer?.fullName || '',
      country: data.buyer?.country || 'ROMÂNIA',
      county: data.buyer?.county || '',
      postalCode: data.buyer?.postalCode || '',
      city: data.buyer?.city || '',
      sectorOrVillage: data.buyer?.sector || data.buyer?.sectorOrVillage || '',
      street: data.buyer?.street || '',
      number: data.buyer?.number || '',
      building: data.buyer?.block || data.buyer?.building || '',
      staircase: data.buyer?.staircase || '',
      floor: data.buyer?.floor || '',
      apartment: data.buyer?.apartment || '',
      idSeries: data.buyer?.ciSeries || data.buyer?.idSeries || '',
      idNumber: data.buyer?.ciNumber || data.buyer?.idNumber || '',
      cnp: data.buyer?.cnp || '',
      phone: data.buyer?.phone || '',
      email: data.buyer?.email || '',
    },
    vehicle: {
      brand: data.vehicle?.make || data.vehicle?.brand || '',
      model: data.vehicle?.type || data.vehicle?.model || '',
      vin: data.vehicle?.vin || '',
      engineSeries: data.vehicle?.engineSerial || data.vehicle?.engineSeries || '',
      cylindricalCapacity: data.vehicle?.displacementCm3 || data.vehicle?.cylindricalCapacity || '',
      maxWeight: data.vehicle?.maxMassTons || data.vehicle?.maxWeight || '',
      licensePlate: data.vehicle?.plateNumber || data.vehicle?.licensePlate || '',
      itpExpiryDate: data.vehicle?.itpExpiryDate || '',
      civNumber: data.vehicle?.civSeries || data.vehicle?.civNumber || '',
      yearOfMake: data.vehicle?.firstRegYear || data.vehicle?.yearOfMake || '',
      euroNorm: data.vehicle?.euroNorm || '',
      acquiredDate: data.vehicle?.acquiredDate || '',
      acquisitionDoc: data.vehicle?.acquisitionAct || data.vehicle?.acquisitionDoc || '',
    },
    contract: {
      priceDigits: data.commercial?.priceRon || data.contract?.priceDigits || '',
      priceWords: data.commercial?.priceRonWords || data.contract?.priceWords || '',
      date: data.commercial?.contractDate || data.contract?.date || new Date().toISOString().split('T')[0],
      location: data.commercial?.contractPlace || data.contract?.location || 'București',
    },
  };

  return await generate5CopyAcroFormDossier(normalizedData);
};
