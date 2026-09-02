import { generateComplete5CopyPDF, ITL054Data } from '../src/lib/pdf/itl054-generator';
import * as fs from 'fs';
import * as path from 'path';

async function testGeneration() {
  console.log('🧪 Testing Model 2026 ITL 054 AcroForm Generation...');

  const sampleData: ITL054Data = {
    seller: {
      fullName: 'POPESCU MIHAI ALEXANDRU',
      country: 'ROMÂNIA',
      county: 'București',
      postalCode: '010214',
      city: 'Sector 1',
      sectorOrVillage: 'Sector 1',
      street: 'Str. Dorobanți',
      number: '34',
      building: 'A2',
      staircase: '1',
      floor: '3',
      apartment: '14',
      idSeries: 'DP',
      idNumber: '491028',
      cnp: '1850412410029',
      phone: '0722123456',
      email: 'mihai.popescu@gmail.com',
    },
    buyer: {
      fullName: 'IONESCU ELENA ANDREEA',
      country: 'ROMÂNIA',
      county: 'Cluj',
      postalCode: '400120',
      city: 'Cluj-Napoca',
      sectorOrVillage: '-',
      street: 'Calea Florești',
      number: '78',
      building: 'B4',
      staircase: '2',
      floor: '4',
      apartment: '22',
      idSeries: 'KX',
      idNumber: '912048',
      cnp: '2920815125890',
      phone: '0744987654',
      email: 'elena.ionescu@yahoo.com',
    },
    vehicle: {
      brand: 'VOLKSWAGEN',
      model: 'GOLF 7',
      vin: 'WVWZZZAUZHP104928',
      engineSeries: 'CRBC129481',
      cylindricalCapacity: 1968,
      maxWeight: 1.85,
      licensePlate: 'B 104 BZX',
      itpExpiryDate: '2027-04-15',
      civNumber: 'K910284',
      yearOfMake: 2020,
      euroNorm: 'Euro 6',
      acquiredDate: '2020-03-10',
      acquisitionDoc: 'Factura nr. 4410/2020',
    },
    contract: {
      priceDigits: 65000,
      priceWords: 'șaizeci și cinci de mii lei',
      date: '2026-09-02',
      location: 'București',
    },
  };

  const pdfBytes = await generateComplete5CopyPDF(sampleData);
  const outputPath = path.resolve(process.cwd(), 'output_test_5_copy_model2026.pdf');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));

  console.log(`✅ Success! Generated 5-copy PDF dossier (${(pdfBytes.length / 1024).toFixed(1)} KB): ${outputPath}`);
}

testGeneration().catch(console.error);
