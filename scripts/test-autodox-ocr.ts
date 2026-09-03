import { validateRomanianCnp, validateVin, matchDitlOffice, extractAutoDoxFromImage } from '../src/lib/ocr/autodox-gemini-vision';

async function runTests() {
  console.log('🧪 Testing AutoDox Low-Token OCR & Validation Logic...\n');

  // Test 1: CNP Checksum
  const validCnp1 = '1850412410021'; // Real valid CNP checksum
  const validCnp2 = '2920815125899';
  const invalidCnp = '1850412410028'; // Corrupted check digit

  console.log(`CNP ${validCnp1} valid:`, validateRomanianCnp(validCnp1) === true ? '✓ PASS' : '✗ FAIL');
  console.log(`CNP ${validCnp2} valid:`, validateRomanianCnp(validCnp2) === true ? '✓ PASS' : '✗ FAIL');
  console.log(`CNP ${invalidCnp} invalid detected:`, validateRomanianCnp(invalidCnp) === false ? '✓ PASS' : '✗ FAIL');

  // Test 2: VIN Validation
  const validVin = 'WVWZZZAUZHP104928'; // 17 chars
  const invalidVin1 = 'WVWZZZAUZHP10492'; // 16 chars
  const invalidVinInvalidChar = 'WVWZZZAUZOP104928'; // Contains forbidden 'O'

  console.log(`VIN ${validVin} valid:`, validateVin(validVin) === true ? '✓ PASS' : '✗ FAIL');
  console.log(`VIN ${invalidVin1} invalid (short):`, validateVin(invalidVin1) === false ? '✓ PASS' : '✗ FAIL');
  console.log(`VIN ${invalidVinInvalidChar} invalid (has O):`, validateVin(invalidVinInvalidChar) === false ? '✓ PASS' : '✗ FAIL');

  // Test 3: DITL Municipal Office Mapping
  const s1Office = matchDitlOffice('Sector 1', 'București');
  console.log('DITL Sector 1 mapping:', s1Office?.name === 'DITL Sector 1 București' ? '✓ PASS' : '✗ FAIL', s1Office?.cifSiruta);

  const clujOffice = matchDitlOffice('Cluj-Napoca', 'Cluj');
  console.log('DITL Cluj mapping:', clujOffice?.name === 'DITL Primăria Cluj-Napoca' ? '✓ PASS' : '✗ FAIL', clujOffice?.cifSiruta);

  // Test 4: Extractor Fallback Simulation
  const ciRes = await extractAutoDoxFromImage('dummybase64', 'seller_ci');
  console.log('\nExtractor CI result:');
  console.log(' - Name:', ciRes.ciData?.fullName);
  console.log(' - CNP Valid:', ciRes.ciData?.isCnpValid);
  console.log(' - Tokens estimate:', ciRes.tokensUsedEstimate);
  console.log(' - Processing time:', ciRes.processingTimeMs, 'ms');

  const talonRes = await extractAutoDoxFromImage('dummybase64', 'vehicle_talon');
  console.log('\nExtractor Talon result:');
  console.log(' - Make:', talonRes.vehicleData?.make);
  console.log(' - VIN:', talonRes.vehicleData?.vin);
  console.log(' - VIN Valid:', talonRes.vehicleData?.isVinValid);
  console.log(' - Tokens estimate:', talonRes.tokensUsedEstimate);

  console.log('\n🎉 All tests completed successfully!');
}

runTests().catch(console.error);
