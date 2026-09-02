import { SampleTicket } from '../../types';

export const SAMPLE_TICKETS: SampleTicket[] = [
  {
    id: 'radar-no-serial',
    title: 'Amendă Viteză Radar (Fără Serie Aparat)',
    subtitle: '78 km/h în zonă de 50 km/h pe DN1, Cluj-Napoca. Agentul a omis seria cinemometrului.',
    badgeText: 'Șanse: 85% (Viciu Metrologic)',
    data: {
      pv_series: 'PRX',
      pv_number: '0842911',
      police_unit: 'IPJ Cluj - Biroul Rutier Drumuri Naționale',
      agent_name: 'Agent Șef Adj. Popescu Marius',
      agent_badge_number: 'CJ-49102',
      contravener_name: 'Ionescu Radu-Mihai',
      contravener_cnp: '1920415125890',
      contravener_address: 'Mun. Cluj-Napoca, Str. Observatorului nr. 34, jud. Cluj',
      incident_date: '2026-08-14',
      incident_time: '14:25',
      incident_city: 'Cluj-Napoca',
      incident_county: 'Cluj',
      incident_exact_location: 'DN1 km 476+100',
      deed_description: 'A condus autoturismul cu viteza de 78 km/h depășind limita legală.',
      statute_violated: 'Art. 108 alin. (1) lit. b din O.U.G. 195/2002',
      statute_sanctioned: 'Art. 100 alin. (2) din O.U.G. 195/2002',
      fine_amount_ron: 660,
      half_fine_amount_ron: 330,
      penalty_points: 3,
      is_radar_offense: true,
      radar_serial_number: '', // MISSING - Legal defect!
      radar_auto_plate: 'MAI 41902',
      speed_recorded_kmh: 78,
      speed_limit_kmh: 50,
      contravener_signed: true,
      agent_signature_present: true
    }
  },
  {
    id: 'parking-no-witness',
    title: 'Parcare Neregulamentară (Refuz Semnare Fără Martor)',
    subtitle: 'Sector 1 București. Șoferul nu a fost de față, iar agentul nu a consemnat martor asistent conform Art. 19.',
    badgeText: 'Șanse: 90% (Viciu Procedură)',
    data: {
      pv_series: 'DGPL',
      pv_number: '994012',
      police_unit: 'Direcția Generală de Poliție Locală Sector 1 București',
      agent_name: 'Polițist Local Radu Alexandru',
      agent_badge_number: 'PL-S1-084',
      contravener_name: 'Dumitrescu Elena-Cristina',
      contravener_cnp: '2891104400129',
      contravener_address: 'București, Sector 1, Str. Calea Victoriei nr. 120',
      incident_date: '2026-08-20',
      incident_time: '11:10',
      incident_city: 'Sector 1',
      incident_county: 'București',
      incident_exact_location: 'Str. Mendeleev nr. 15',
      deed_description: 'Oprire neregulamentară în zona de acțiune a indicatorului Oprirea Interzisă.',
      statute_violated: 'Art. 142 lit. a din HG 1391/2006',
      statute_sanctioned: 'Art. 99 alin. 2 din OUG 195/2002',
      fine_amount_ron: 495,
      half_fine_amount_ron: 247.5,
      penalty_points: 2,
      is_radar_offense: false,
      contravener_signed: false,
      refused_to_sign: true,
      has_witness: false, // MISSING - Violates Art. 19 O.G. 2/2001!
      witness_name: '',
      objections_field_content: '-',
      agent_signature_present: true
    }
  },
  {
    id: 'missing-agent-signature',
    title: 'Nulitate Absolută (Lipsă Semnătură & Dată Agent)',
    subtitle: 'Poliția Rutieră Ilfov. Proces-verbal fără semnătura olografă a polițistului (Decizia ÎCCJ 22/2007).',
    badgeText: 'Șanse: 98% (Nulitate Absolută)',
    data: {
      pv_series: 'PIF',
      pv_number: '0029314',
      police_unit: 'IPJ Ilfov - Serviciul Rutier',
      agent_name: '', // MISSING
      contravener_name: 'Stanciu Cristian',
      contravener_cnp: '1850720410052',
      contravener_address: 'Oraș Otopeni, Str. 23 August nr. 10, jud. Ilfov',
      incident_date: '', // MISSING
      incident_time: '18:40',
      incident_city: 'Buftea',
      incident_county: 'Ilfov',
      incident_exact_location: 'Șos. București-Ploiești km 18',
      deed_description: 'Neacordare prioritate de trecere vehiculelor care circulau pe drum prioritar.',
      statute_violated: 'Art. 100 alin. 3 lit. b din OUG 195/2002',
      fine_amount_ron: 990,
      half_fine_amount_ron: 495,
      penalty_points: 4,
      license_suspended_days: 30,
      is_radar_offense: false,
      agent_signature_present: false // FATAL DEFECT!
    }
  }
];
