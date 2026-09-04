export type GhiseuServiceId = 'buletin' | 'cazier' | 'pasaport' | 'fiscal';

export type BuletinMotive = 
  | 'expirare' 
  | 'schimbare_domiciliu' 
  | 'pierdut_furt_deteriorat' 
  | 'schimbare_nume' 
  | 'varsta_14';

export type HousingSituation = 
  | 'proprietar' 
  | 'chirias_anaf' 
  | 'gazda_parinti' 
  | 'fara_acte';

export type MaritalStatus = 
  | 'necasatorit' 
  | 'casatorit' 
  | 'divortat' 
  | 'vaduv';

export interface BuletinDecisionState {
  motive: BuletinMotive;
  housing: HousingSituation;
  maritalStatus: MaritalStatus;
  hasMinorChildren: boolean;
}

export interface ChecklistDocItem {
  id: string;
  title: string;
  type: 'original' | 'copie' | 'original_si_copie' | 'chitanta' | 'prezenta';
  description: string;
  criticalNotice?: string;
  checked?: boolean;
}

export interface BuletinFormData {
  nume: string;
  prenume: string;
  cnp: string;
  loculNasteriiJudet: string;
  loculNasteriiLocalitate: string;
  numeTata: string;
  numeMama: string;
  telefon: string;
  email: string;
  adresaNouaJudet: string;
  adresaNouaLocalitate: string;
  adresaNouaStrada: string;
  adresaNouaNumar: string;
  adresaNouaBloc?: string;
  adresaNouaScara?: string;
  adresaNouaEtaj?: string;
  adresaNouaAp?: string;
  motivSolicitare: string;
}

export type PasaportAgeGroup = 'sub_12' | '12_18' | 'peste_18' | 'temporar';

export interface PasaportFeeCalculation {
  ageGroup: PasaportAgeGroup;
  title: string;
  feeRon: number;
  validityYears: number;
  description: string;
  canBookOnline: boolean;
  legalNotice: string;
}

export interface DitlPortalInfo {
  id: string;
  name: string;
  region: string;
  portalUrl: string;
  ghiseulRoSupported: boolean;
  onlineProcessingHours: string;
  requiredDocuments: string[];
  notes: string;
}

export interface FiscalFormData {
  fullName: string;
  cnp: string;
  domiciliuJudet: string;
  domiciliuLocalitate: string;
  domiciliuStrada: string;
  domiciliuNumar: string;
  telefon: string;
  email: string;
  scopCertificat: 'vanzare_imobil' | 'vanzare_auto' | 'credit_bancar' | 'succesiune' | 'infiintare_firma' | 'altul';
  detaliiBun?: string;
  numarExemplare: number;
}
