import { 
  BuletinDecisionState, 
  ChecklistDocItem, 
  DitlPortalInfo, 
  PasaportFeeCalculation, 
  PasaportAgeGroup 
} from '../../types/ghiseu';

/**
 * Returns dynamic document checklist based on citizen's specific housing, motive, and marital situation.
 */
export function getBuletinChecklist(state: BuletinDecisionState): ChecklistDocItem[] {
  const items: ChecklistDocItem[] = [];

  // 1. Cerere tip
  items.push({
    id: 'cerere_tip',
    title: 'Cererea pentru eliberarea actului de identitate (Anexa 1)',
    type: 'original',
    description: 'Completată și semnată de solicitant (sau generată instant în PDF prin BirocrațieZero).',
    criticalNotice: 'Se semnează în fața funcționarului de la ghișeu.',
  });

  // 2. Actul de identitate anterior (sau dovada)
  if (state.motive === 'pierdut_furt_deteriorat') {
    items.push({
      id: 'dovada_furt_sau_declaratie',
      title: 'Dovada eliberată de Poliție (furt) sau Declarație pe proprie răspundere (pierdere)',
      type: 'original',
      description: 'Dacă a fost furat, adu dovada reclamației de la Secția de Poliție. Dacă a fost pierdut, se dă declarație la ghișeu.',
      criticalNotice: 'Dacă C.I. este doar deteriorată, trebuie predată obligatoriu la ghișeu bucata rămasă!',
    });
  } else if (state.motive !== 'varsta_14') {
    items.push({
      id: 'buletin_vechi',
      title: 'Actul de identitate vechi (C.I. / B.I.)',
      type: 'original',
      description: 'Documentul fizic actual pe care îl deții. Acesta va fi reținut / perforat la eliberarea noului act.',
      criticalNotice: 'Trebuie prezentat în ORIGINAL. Nu se acceptă poze sau copii în locul actului vechi!',
    });
  }

  // 3. Certificat de naștere
  items.push({
    id: 'certificat_nastere',
    title: 'Certificatul de naștere',
    type: 'original_si_copie',
    description: 'Certificatul tău de naștere în format original și 1 copie xerox lizibilă.',
    criticalNotice: 'Trebuie să fie modelul nou (tipizat național), fără plastifiere deteriorată.',
  });

  // 4. Acte de stare civilă în funcție de situație
  if (state.maritalStatus === 'casatorit') {
    items.push({
      id: 'certificat_casatorie',
      title: 'Certificatul de căsătorie',
      type: 'original_si_copie',
      description: 'În original și copie xerox. Necesar pentru atestarea numelui și stării civile actuale.',
    });
  } else if (state.maritalStatus === 'divortat') {
    items.push({
      id: 'certificat_divort',
      title: 'Hotărârea judecătorească de divorț sau Certificatul de divorț notarial',
      type: 'original_si_copie',
      description: 'Documentul care atestă desfacerea căsătoriei și numele purtat după divorț.',
      criticalNotice: 'ATENȚIE: Hotărârea judecătorească TREBUIE să fie investită cu formula „DEFINITIVĂ” (ștampilă grefă)!',
    });
  } else if (state.maritalStatus === 'vaduv') {
    items.push({
      id: 'certificat_deces_sot',
      title: 'Certificatul de deces al soțului / soției',
      type: 'original_si_copie',
      description: 'În original și copie xerox, împreună cu certificatul de căsătorie.',
    });
  }

  // 5. Copii minori sub 14 ani
  if (state.hasMinorChildren) {
    items.push({
      id: 'certificate_minori',
      title: 'Certificatele de naștere ale copiilor cu vârsta sub 14 ani',
      type: 'original_si_copie',
      description: 'Pentru înscrierea adresei de domiciliu a copiilor aflați în îngrijire.',
    });
  }

  // 6. Dovada adresei de domiciliu (Spațiu locativ) - Cel mai critic pas!
  if (state.housing === 'proprietar') {
    items.push({
      id: 'act_proprietate',
      title: 'Documentul cu care se face dovada adresei de domiciliu (Act Proprietate)',
      type: 'original_si_copie',
      description: 'Contract vânzare-cumpărare, donație, certificat de moștenitor, titlu de proprietate sau extras de Carte Funciară recent.',
      criticalNotice: 'Dacă există mai mulți coproprietari, doar tu trebuie să prezinți actul original dacă ești înscris pe el.',
    });
  } else if (state.housing === 'chirias_anaf') {
    items.push({
      id: 'contract_chirie_anaf',
      title: 'Contract de închiriere înregistrat la organele fiscale (A.N.A.F.)',
      type: 'original_si_copie',
      description: 'Contractul de locațiune însoțit de dovada înregistrării la ANAF în format original și copie.',
      criticalNotice: 'Dacă contractul este vizat ANAF, NU este necesară prezența proprietarului la ghișeu!',
    });
  } else if (state.housing === 'gazda_parinti') {
    items.push({
      id: 'prezenta_proprietar',
      title: 'Prezența FIZICĂ a proprietarului locuinței la ghișeu + Actul său de identitate',
      type: 'prezenta',
      description: 'Proprietarul (părinte, rudă, prieten) trebuie să te însoțească la ghișeu pentru a semna Declarația de primire în spațiu.',
      criticalNotice: 'CAPCANĂ FRECVENTĂ: Dacă proprietarul nu poate veni fizic, este OBLIGATORIE o declarație notarială de luare în spațiu!',
    });
    items.push({
      id: 'act_proprietate_gazda',
      title: 'Actul de proprietate al locuinței găzduitorului',
      type: 'original_si_copie',
      description: 'Contractul casei în care te muți, adus în original și copie xerox de către proprietar.',
    });
  } else if (state.housing === 'fara_acte') {
    items.push({
      id: 'dovada_locuire_fapt',
      title: 'Verificare Poliție Locală (pentru Carte de Identitate Provizorie)',
      type: 'original',
      description: 'Dacă nu deții niciun act de proprietate, se eliberează C.I. Provizorie în urma verificării în teren a polițistului.',
      criticalNotice: 'Valabilitatea C.I. provizorii este de maxim 1 an conform legii.',
    });
  }

  // 7. Taxa de 7 RON pe Ghișeul.ro
  items.push({
    id: 'taxa_7_ron',
    title: 'Chitanța doveditoare a plății taxei de eliberare C.I. (7 RON)',
    type: 'chitanta',
    description: 'Achitată electronic pe Ghișeul.ro sau la casieria D.I.T.L. / oficiu poștal.',
    criticalNotice: 'Printează chitanța PDF de pe Ghișeul.ro sau arat-o pe ecranul telefonului la ghișeu.',
  });

  return items;
}

/**
 * Passport fee matrix under Romanian statutory consular laws.
 */
export const PASAPORT_FEES: Record<PasaportAgeGroup, PasaportFeeCalculation> = {
  sub_12: {
    ageGroup: 'sub_12',
    title: 'Pașaport Simplu Electronic (Copil sub 12 ani)',
    feeRon: 234,
    validityYears: 3,
    description: 'Valabilitate 3 ani. Nu se preiau amprente digitale pentru copiii sub 12 ani.',
    canBookOnline: true,
    legalNotice: 'Prezența minorului și a ambilor părinți este obligatorie la depunerea actelor.',
  },
  '12_18': {
    ageGroup: '12_18',
    title: 'Pașaport Simplu Electronic (Minor 12 - 18 ani)',
    feeRon: 258,
    validityYears: 5,
    description: 'Valabilitate 5 ani. Se preiau amprentele digitale și fotografia facială la ghișeu.',
    canBookOnline: true,
    legalNotice: 'Minorul trebuie însoțit de ambii părinți sau de părintele împuternicit prin procură specială notarială.',
  },
  peste_18: {
    ageGroup: 'peste_18',
    title: 'Pașaport Simplu Electronic (Adult peste 18 ani)',
    feeRon: 258,
    validityYears: 10,
    description: 'Valabilitate 10 ani. Format biometric cu cip de înaltă securitate, recunoscut global.',
    canBookOnline: true,
    legalNotice: 'Poți depune actele la ORICE serviciu public comunitar de pașapoarte din țară, fără condiționare de domiciliu.',
  },
  temporar: {
    ageGroup: 'temporar',
    title: 'Pașaport Simplu Temporar (Cazuri Urgente)',
    feeRon: 96,
    validityYears: 1,
    description: 'Valabilitate 1 an. Eliberat în termen de 3 zile doar în cazuri temeinic justificate.',
    canBookOnline: false,
    legalNotice: 'Necesită documente justificative doveditoare: urgență medicală în străinătate, deces în familie, motive profesionale.',
  }
};

/**
 * Directory of online tax portals (DITL) for Bucharest and major Romanian municipalities.
 */
export const DITL_PORTALS: DitlPortalInfo[] = [
  {
    id: 'sector1',
    name: 'Sector 1 București (D.G.I.T.L.)',
    region: 'București',
    portalUrl: 'https://impozitelocale1.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '24–48 ore',
    requiredDocuments: ['Cerere tip online', 'Copie act identitate', 'Împuternicire (dacă e cazul)'],
    notes: 'Eliberare certificat fiscal gratuit, descărcabil din portalul propriu sau Ghișeul.ro.'
  },
  {
    id: 'sector2',
    name: 'Sector 2 București (D.V.B.L.)',
    region: 'București',
    portalUrl: 'https://www.ditl2.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '24–48 ore',
    requiredDocuments: ['Cerere tip online', 'Copie CI'],
    notes: 'Portalul Direcției Venituri Buget Local Sector 2 oferă autentificare instantanee.'
  },
  {
    id: 'sector3',
    name: 'Sector 3 București (D.G.I.T.L.)',
    region: 'București',
    portalUrl: 'https://www.ditl3.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: 'Instant – 24 ore',
    requiredDocuments: ['Cont pe portal DITL 3 sau Ghișeul.ro'],
    notes: 'Cel mai rapid sistem automatizat din capitală dacă nu există datorii restante.'
  },
  {
    id: 'sector4',
    name: 'Sector 4 București (D.G.I.T.L.)',
    region: 'București',
    portalUrl: 'https://www.ditl4.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '24–48 ore',
    requiredDocuments: ['Cerere tipizată', 'Act identitate'],
    notes: 'Integrare completă cu platforma primăriei Sector 4.'
  },
  {
    id: 'sector5',
    name: 'Sector 5 București (D.I.T.L.)',
    region: 'București',
    portalUrl: 'https://ditl5.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '24–48 ore',
    requiredDocuments: ['Cerere online', 'Copie buletin'],
    notes: 'Necesită cont de utilizator activat cu CNP-ul titularului.'
  },
  {
    id: 'sector6',
    name: 'Sector 6 București (D.G.I.T.L.)',
    region: 'București',
    portalUrl: 'https://taxelocale6.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: 'Instant – 24 ore',
    requiredDocuments: ['Cerere fiscală online', 'Copie CI'],
    notes: 'Descărcare directă din contul e-Sector6 cu semnătură digitală a instituției.'
  },
  {
    id: 'cluj',
    name: 'Municipiul Cluj-Napoca',
    region: 'Transilvania',
    portalUrl: 'https://e-primariaclujnapoca.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '24–48 ore',
    requiredDocuments: ['Cont funcționar virtual Antonia', 'Copie CI'],
    notes: 'Portalul e-primariaclujnapoca.ro eliberează certificatul fiscal 100% digital.'
  },
  {
    id: 'timisoara',
    name: 'Municipiul Timișoara (D.F.M.T.)',
    region: 'Banat',
    portalUrl: 'https://dfmt.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '24–48 ore',
    requiredDocuments: ['Cerere electronică', 'Act de identitate'],
    notes: 'Direcția Fiscală a Municipiului Timișoara are modul dedicat pentru persoane fizice.'
  },
  {
    id: 'iasi',
    name: 'Municipiul Iași (D.G.E.F.L.)',
    region: 'Moldova',
    portalUrl: 'https://www.dgitl-iasi.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '48 ore',
    requiredDocuments: ['Cerere tip', 'Copie act proprietate / buletin'],
    notes: 'Direcția Generală Economică și Finanțe Locale Iași.'
  },
  {
    id: 'brasov',
    name: 'Municipiul Brașov (Direcția Fiscală)',
    region: 'Transilvania',
    portalUrl: 'https://brasovcity.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '24–48 ore',
    requiredDocuments: ['Cerere electronică', 'CI titular'],
    notes: 'Accesibil prin portalul cetățeanului Primăria Brașov.'
  },
  {
    id: 'constanta',
    name: 'Municipiul Constanța (S.P.I.T.)',
    region: 'Dobrogea',
    portalUrl: 'https://spit-ct.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '24 ore',
    requiredDocuments: ['Cerere online', 'Copie CI'],
    notes: 'Serviciul Public de Impozite și Taxe Constanța.'
  },
  {
    id: 'craiova',
    name: 'Municipiul Craiova (Taxe și Impozite)',
    region: 'Oltenia',
    portalUrl: 'https://primariacraiova.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '48 ore',
    requiredDocuments: ['Cerere online', 'Copie act identitate'],
    notes: 'Direct pe portalul primăriei sau prin Ghișeul.ro.'
  },
  {
    id: 'oradea',
    name: 'Municipiul Oradea (D.E.F.L.)',
    region: 'Crișana',
    portalUrl: 'https://oradea.ro/',
    ghiseulRoSupported: true,
    onlineProcessingHours: '24 ore',
    requiredDocuments: ['Cont Oradea e-guvernare', 'Act identitate'],
    notes: 'Sistem digital complet integrat cu emitere rapidă fără cozi.'
  }
];
