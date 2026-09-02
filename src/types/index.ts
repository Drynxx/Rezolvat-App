export type AppTab = 'amendaguard' | 'autodox' | 'anpc' | 'ghiseu' | 'pricing';

export type ThemeMode = 'light' | 'dark';

export interface ProcesVerbalExtractedData {
  pv_series: string;
  pv_number: string;
  police_unit: string;
  agent_name?: string;
  agent_badge_number?: string;
  contravener_name?: string;
  contravener_cnp?: string;
  contravener_address?: string;
  contravener_driver_license?: string;
  incident_date?: string;
  incident_time?: string;
  incident_city?: string;
  incident_county?: string;
  incident_exact_location?: string;
  deed_description: string;
  statute_violated?: string;
  statute_sanctioned?: string;
  fine_amount_ron: number;
  half_fine_amount_ron?: number;
  penalty_points?: number;
  license_suspended_days?: number;
  is_radar_offense?: boolean;
  radar_serial_number?: string;
  radar_auto_plate?: string;
  metrology_bulletin_number?: string;
  speed_recorded_kmh?: number;
  speed_limit_kmh?: number;
  contravener_signed?: boolean;
  refused_to_sign?: boolean;
  has_witness?: boolean;
  witness_name?: string;
  witness_cnp?: string;
  objections_field_content?: string;
  agent_signature_present?: boolean;
}

export type NullityCategory = 'NULITATE_ABSOLUTA' | 'NULITATE_RELATIVA' | 'FOND_SI_PROBATORIU';

export interface LegalGround {
  article: string;
  law: string;
  category: NullityCategory;
  summary: string;
  legalArgument: string;
  weightScore: number;
}

export interface CourtJudecatorie {
  id: string;
  name: string;
  county: string;
  locality: string;
  address: string;
  email: string;
  timbruTaxIban?: string;
}

export interface LegalAnalysisResult {
  successScore: number; // 0 to 100
  verdictTitle: string;
  isHighlyContestable: boolean;
  absoluteNullities: LegalGround[];
  relativeNullities: LegalGround[];
  meritDefenses: LegalGround[];
  competentCourt: CourtJudecatorie;
  recommendedActions: string[];
}

export interface SampleTicket {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  data: ProcesVerbalExtractedData;
}
