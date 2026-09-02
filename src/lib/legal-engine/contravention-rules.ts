import { ProcesVerbalExtractedData, LegalAnalysisResult, LegalGround } from '../../types';
import { findCompetentCourt } from '../data/courts';

export class RomanianContraventionRuleEngine {
  public static analyze(pv: ProcesVerbalExtractedData): LegalAnalysisResult {
    const absoluteNullities: LegalGround[] = [];
    const relativeNullities: LegalGround[] = [];
    const meritDefenses: LegalGround[] = [];
    let baseScore = 20; // Default baseline percentage

    // =========================================================================
    // 1. STATUTORY ABSOLUTE NULLITY (Art. 17 O.G. nr. 2/2001)
    // =========================================================================

    // Ground 1.1: Missing Agent Signature
    if (pv.agent_signature_present === false) {
      absoluteNullities.push({
        article: 'Art. 17',
        law: 'O.G. nr. 2/2001',
        category: 'NULITATE_ABSOLUTA',
        summary: 'Lipsa semnăturii olografe a agentului constatator',
        legalArgument: `Conform art. 17 din O.G. nr. 2/2001 raportat la Decizia ÎCCJ nr. 22/2007 (RIL), lipsa semnăturii olografe a agentului constatator atrage sancțiunea nulității absolute a procesului-verbal, viciu ce poate fi invocat oricând și constatat din oficiu de către instanță fără a fi necesară dovedirea unei vătămări procesuale.`,
        weightScore: 45,
      });
      baseScore += 45;
    }

    // Ground 1.2: Missing Agent Name
    if (!pv.agent_name || pv.agent_name.trim().length < 4) {
      absoluteNullities.push({
        article: 'Art. 17',
        law: 'O.G. nr. 2/2001',
        category: 'NULITATE_ABSOLUTA',
        summary: 'Lipsa numelui și prenumelui agentului constatator',
        legalArgument: `Procesul-verbal este lovit de nulitate absolută conform art. 17 din O.G. nr. 2/2001 din cauza imposibilității identificării agentului constatator și verificării calității și competenței sale funcționale și teritoriale.`,
        weightScore: 40,
      });
      baseScore += 40;
    }

    // Ground 1.3: Missing Incident Date
    if (!pv.incident_date) {
      absoluteNullities.push({
        article: 'Art. 17',
        law: 'O.G. nr. 2/2001',
        category: 'NULITATE_ABSOLUTA',
        summary: 'Lipsa datei exacte a comiterii faptei',
        legalArgument: `Data săvârșirii faptei este element esențial prevăzut sub sancțiunea nulității absolute de art. 17 din O.G. nr. 2/2001, lipsa acesteia împiedicând instanța să verifice termenul de prescripție a aplicării sancțiunii reglementat de art. 13.`,
        weightScore: 40,
      });
      baseScore += 40;
    }

    // Ground 1.4: Missing Deed Description
    if (!pv.deed_description || pv.deed_description.trim().length < 10) {
      absoluteNullities.push({
        article: 'Art. 17',
        law: 'O.G. nr. 2/2001',
        category: 'NULITATE_ABSOLUTA',
        summary: 'Lipsa descrierii faptei săvârșite',
        legalArgument: `Omisiunea descrierii faptei contravenționale atrage nulitatea absolută a procesului-verbal conform art. 17 din O.G. nr. 2/2001, încălcând dreptul la apărare și prezumția de nevinovăție garantate de art. 6 din Convenția Europeană a Drepturilor Omului.`,
        weightScore: 45,
      });
      baseScore += 45;
    }

    // =========================================================================
    // 2. STATUTORY RELATIVE NULLITY (Art. 16 & 19 O.G. nr. 2/2001)
    // =========================================================================

    // Ground 2.1: Generic Deed Description
    const wordsCount = pv.deed_description ? pv.deed_description.trim().split(/\s+/).length : 0;
    const isGenericDescription = 
      wordsCount <= 7 ||
      (pv.deed_description && (
        pv.deed_description.toLowerCase().includes('a circulat cu viteza') ||
        pv.deed_description.toLowerCase().includes('nu a respectat regulile') ||
        pv.deed_description.toLowerCase().includes('oprire neregulamentara')
      ));

    if (isGenericDescription && !absoluteNullities.some(g => g.summary.includes('Lipsa descrierii'))) {
      relativeNullities.push({
        article: 'Art. 16 alin. (1)',
        law: 'O.G. nr. 2/2001',
        category: 'NULITATE_RELATIVA',
        summary: 'Descrierea generică a faptei fără indicarea împrejurărilor concrete',
        legalArgument: `Agentul constatator s-a limitat la o descriere sumară, stereotipă a faptei, fără a consemna împrejurările concrete în care a fost săvârșită (repere stradale, starea carosabilului, poziția vehiculului). Conform jurisprudenței constante a instanțelor naționale, descrierea lacunară împiedică exercitarea unui control judiciar efectiv.`,
        weightScore: 25,
      });
      baseScore += 25;
    }

    // Ground 2.2: Refusal to Sign without Valid Independent Witness (Art. 19)
    if (pv.refused_to_sign && (!pv.has_witness || !pv.witness_name || pv.witness_name.trim().length < 3)) {
      relativeNullities.push({
        article: 'Art. 19 alin. (1)',
        law: 'O.G. nr. 2/2001',
        category: 'NULITATE_RELATIVA',
        summary: 'Lipsa martorului asistent la consemnarea refuzului de semnare',
        legalArgument: `În ipoteza în care contravenientul nu este de față, refuză sau nu poate să semneze, art. 19 alin. (1) din O.G. nr. 2/2001 impune ca aceste împrejurări să fie confirmate de cel puțin un martor asistent cu date complete de identitate. Lipsa martorului asistent atrage nelegalitatea procedurii de întocmire.`,
        weightScore: 30,
      });
      baseScore += 30;
    }

    // Ground 2.3: Barred / Objections Ignored (Art. 16 alin. 7)
    const objectionsBarred = 
      pv.objections_field_content && 
      (pv.objections_field_content.toLowerCase().includes('nu are') ||
       pv.objections_field_content.toLowerCase().includes('barat') ||
       pv.objections_field_content.trim() === '-' ||
       pv.objections_field_content.trim() === '/');

    if (!pv.contravener_signed && objectionsBarred) {
      relativeNullities.push({
        article: 'Art. 16 alin. (7)',
        law: 'O.G. nr. 2/2001',
        category: 'NULITATE_RELATIVA',
        summary: 'Încălcarea dreptului de a formula obiecțiuni',
        legalArgument: `Agentul constatator este obligat sub sancțiunea nulității relative să aducă la cunoștință contravenientului dreptul de a face obiecțiuni și să le consemneze distinct. Bararea din oficiu a rubricii 'Obiecțiuni' constituie o încălcare a dreptului la apărare consfințit de art. 24 din Constituție.`,
        weightScore: 20,
      });
      baseScore += 20;
    }

    // =========================================================================
    // 3. RADAR & TECHNICAL DEFENSES (Norma de Metrologie NML 021-05)
    // =========================================================================
    if (pv.is_radar_offense) {
      // Cinemometer serial check
      if (!pv.radar_serial_number || pv.radar_serial_number.trim().length < 2) {
        meritDefenses.push({
          article: 'Pct. 3.5.1 din NML 021-05',
          law: 'Norma de Metrologie Legală / O.U.G. 195/2002',
          category: 'FOND_SI_PROBATORIU',
          summary: 'Lipsa menționării seriei aparatului radar cinemometru',
          legalArgument: `Procesul-verbal nu conține elementele de identificare ale cinemometrului cu care s-a efectuat măsurarea vitezei. În conformitate cu Norma de Metrologie Legală NML 021-05, înregistrarea vitezei poate constitui probă legală exclusiv dacă aparatul este identificat în mod cert și verificat metrologic în termen.`,
          weightScore: 30,
        });
        baseScore += 30;
      }

      // Measurement tolerance (±4 km/h margin)
      if (pv.speed_recorded_kmh && pv.speed_limit_kmh) {
        const excessSpeed = pv.speed_recorded_kmh - pv.speed_limit_kmh;
        if (excessSpeed > 0 && excessSpeed <= 4) {
          meritDefenses.push({
            article: 'Toleranță Metrologică',
            law: 'NML 021-05 pct. 3.1.1',
            category: 'FOND_SI_PROBATORIU',
            summary: 'Depășirea limitei de viteză se încadrează în marja legală de eroare (±4 km/h)',
            legalArgument: `Viteza reținută în sarcina petentului depășește limita legală cu o valoare ce se situează în marja de eroare maximă admisă a aparatului radar (±3 km/h până la 100 km/h, respectiv ±4 km/h în regim de deplasare). În virtutea principiului 'in dubio pro reo', orice dubiu profită contravenientului.`,
            weightScore: 25,
          });
          baseScore += 25;
        }
      }
    }

    // Proportionality / Warning Replacement Defense (Art. 7 O.G. 2/2001)
    if (pv.fine_amount_ron > 0 && meritDefenses.length === 0 && relativeNullities.length === 0 && absoluteNullities.length === 0) {
      meritDefenses.push({
        article: 'Art. 7 și Art. 21 alin. (3)',
        law: 'O.G. nr. 2/2001',
        category: 'FOND_SI_PROBATORIU',
        summary: 'Disproporționalitatea sancțiunii amenzii raportat la pericolul social redus',
        legalArgument: `Sancțiunea aplicată este disproporționată raportat la lipsa urmărilor vătămătoare concrete, conduita anterioară ireproșabilă a conducătorului auto și circumstanțele faptei. Se impune reindividualizarea sancțiunii și înlocuirea amenzii cu AVERTISMENT conform art. 7 din O.G. nr. 2/2001.`,
        weightScore: 25,
      });
      baseScore += 25;
    }

    // Final score capped at 98%
    const finalScore = Math.min(98, Math.max(25, baseScore));

    let verdictTitle = 'Șanse Medii de Anulare sau Înlocuire cu Avertisment';
    if (absoluteNullities.length > 0) {
      verdictTitle = 'Șanse Maxime de Anulare (Nulitate Absolută Directă)';
    } else if (relativeNullities.length >= 2 || (relativeNullities.length >= 1 && meritDefenses.length >= 1)) {
      verdictTitle = 'Șanse Foarte Mari de Anulare (Vicii de Procedură Cumulate)';
    } else if (finalScore >= 65) {
      verdictTitle = 'Șanse Ridicate de Anulare Judiciară';
    }

    const competentCourt = findCompetentCourt(pv.incident_city || pv.contravener_address, pv.incident_county);

    return {
      successScore: finalScore,
      verdictTitle,
      isHighlyContestable: finalScore >= 60,
      absoluteNullities,
      relativeNullities,
      meritDefenses,
      competentCourt,
      recommendedActions: [
        'Nu achitați amenda dacă doriți suspendarea executării, sau achitați în 15 zile jumătate din minim (suma se restituie integral la admiterea plângerii).',
        'Achitați Taxa Judiciară de Timbru de 20 RON pe Ghișeul.ro la secțiunea Judecătorie.',
        'Depuneți dosarul în termen legal de 15 zile de la data înmânării sau comunicării procesului-verbal.',
        'Solicitați judecarea în lipsă în baza art. 411 alin. (2) C.pr.civ. pentru a nu vă deplasa fizic la termene.'
      ]
    };
  }
}
