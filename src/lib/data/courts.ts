import { CourtJudecatorie } from '../../types';

export const ROMANIAN_COURTS: CourtJudecatorie[] = [
  {
    id: 'jud-s1',
    name: 'Judecătoria Sectorului 1 București',
    county: 'București',
    locality: 'Sector 1',
    address: 'Gheorghe Danielopol nr. 2-4, Sector 4, București',
    email: 'jud-sector1@just.ro',
    timbruTaxIban: 'RO49TREZ70020A100101XXXX'
  },
  {
    id: 'jud-s2',
    name: 'Judecătoria Sectorului 2 București',
    county: 'București',
    locality: 'Sector 2',
    address: 'Str. Maria Rosetti nr. 10-12, Sector 2, București',
    email: 'jud-sector2@just.ro',
    timbruTaxIban: 'RO49TREZ70020A100102XXXX'
  },
  {
    id: 'jud-s3',
    name: 'Judecătoria Sectorului 3 București',
    county: 'București',
    locality: 'Sector 3',
    address: 'Str. Ilfov nr. 6, Sector 5, București',
    email: 'jud-sector3@just.ro',
    timbruTaxIban: 'RO49TREZ70020A100103XXXX'
  },
  {
    id: 'jud-s4',
    name: 'Judecătoria Sectorului 4 București',
    county: 'București',
    locality: 'Sector 4',
    address: 'Gheorghe Danielopol nr. 2-4, Sector 4, București',
    email: 'jud-sector4@just.ro',
    timbruTaxIban: 'RO49TREZ70020A100104XXXX'
  },
  {
    id: 'jud-s5',
    name: 'Judecătoria Sectorului 5 București',
    county: 'București',
    locality: 'Sector 5',
    address: 'Str. Ilfov nr. 6, Sector 5, București',
    email: 'jud-sector5@just.ro',
    timbruTaxIban: 'RO49TREZ70020A100105XXXX'
  },
  {
    id: 'jud-s6',
    name: 'Judecătoria Sectorului 6 București',
    county: 'București',
    locality: 'Sector 6',
    address: 'Str. Maria Rosetti nr. 10-12, Sector 2, București',
    email: 'jud-sector6@just.ro',
    timbruTaxIban: 'RO49TREZ70020A100106XXXX'
  },
  {
    id: 'jud-cluj',
    name: 'Judecătoria Cluj-Napoca',
    county: 'Cluj',
    locality: 'Cluj-Napoca',
    address: 'Calea Dorobanților nr. 2-4, Cluj-Napoca, jud. Cluj',
    email: 'jud-cluj@just.ro',
    timbruTaxIban: 'RO12TREZ21620A100100XXXX'
  },
  {
    id: 'jud-timisoara',
    name: 'Judecătoria Timișoara',
    county: 'Timiș',
    locality: 'Timișoara',
    address: 'Piața Țepeș Vodă nr. 2, Timișoara, jud. Timiș',
    email: 'jud-timisoara@just.ro',
    timbruTaxIban: 'RO34TREZ62120A100100XXXX'
  },
  {
    id: 'jud-iasi',
    name: 'Judecătoria Iași',
    county: 'Iași',
    locality: 'Iași',
    address: 'Str. Elena Doamna nr. 1A, Iași, jud. Iași',
    email: 'jud-iasi@just.ro',
    timbruTaxIban: 'RO56TREZ40120A100100XXXX'
  },
  {
    id: 'jud-constanta',
    name: 'Judecătoria Constanța',
    county: 'Constanța',
    locality: 'Constanța',
    address: 'Str. Traian nr. 35C, Constanța, jud. Constanța',
    email: 'jud-constanta@just.ro',
    timbruTaxIban: 'RO78TREZ24120A100100XXXX'
  },
  {
    id: 'jud-brasov',
    name: 'Judecătoria Brașov',
    county: 'Brașov',
    locality: 'Brașov',
    address: 'B-dul 15 Noiembrie nr. 45, Brașov, jud. Brașov',
    email: 'jud-brasov@just.ro',
    timbruTaxIban: 'RO90TREZ13120A100100XXXX'
  },
  {
    id: 'jud-sibiu',
    name: 'Judecătoria Sibiu',
    county: 'Sibiu',
    locality: 'Sibiu',
    address: 'Calea Dumbrăvii nr. 30, Sibiu, jud. Sibiu',
    email: 'jud-sibiu@just.ro',
    timbruTaxIban: 'RO23TREZ57120A100100XXXX'
  },
  {
    id: 'jud-ilfov-buftea',
    name: 'Judecătoria Buftea',
    county: 'Ilfov',
    locality: 'Buftea',
    address: 'Str. Știrbei Vodă nr. 24, Buftea, jud. Ilfov',
    email: 'jud-buftea@just.ro',
    timbruTaxIban: 'RO45TREZ39120A100100XXXX'
  },
  {
    id: 'jud-ploiesti',
    name: 'Judecătoria Ploiești',
    county: 'Prahova',
    locality: 'Ploiești',
    address: 'Str. Gheorghe Doja nr. 42, Ploiești, jud. Prahova',
    email: 'jud-ploiesti@just.ro',
    timbruTaxIban: 'RO67TREZ52120A100100XXXX'
  }
];

export function findCompetentCourt(locality?: string, county?: string): CourtJudecatorie {
  const normLocality = (locality || '').toLowerCase().trim();
  const normCounty = (county || '').toLowerCase().trim();

  // Sector 1-6 matching
  if (normLocality.includes('sector 1') || normLocality.includes('sectorul 1')) return ROMANIAN_COURTS[0];
  if (normLocality.includes('sector 2') || normLocality.includes('sectorul 2')) return ROMANIAN_COURTS[1];
  if (normLocality.includes('sector 3') || normLocality.includes('sectorul 3')) return ROMANIAN_COURTS[2];
  if (normLocality.includes('sector 4') || normLocality.includes('sectorul 4')) return ROMANIAN_COURTS[3];
  if (normLocality.includes('sector 5') || normLocality.includes('sectorul 5')) return ROMANIAN_COURTS[4];
  if (normLocality.includes('sector 6') || normLocality.includes('sectorul 6')) return ROMANIAN_COURTS[5];

  // Specific city matching
  const directMatch = ROMANIAN_COURTS.find(c => 
    normLocality.includes(c.locality.toLowerCase()) || 
    normCounty.includes(c.county.toLowerCase())
  );

  if (directMatch) return directMatch;

  // Fallback to Sector 1 București if unspecified
  return ROMANIAN_COURTS[0];
}
