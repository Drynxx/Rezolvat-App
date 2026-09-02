import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

export async function inspectPdfFields(targetPath?: string) {
  const defaultPath = path.resolve(process.cwd(), 'contract-instrainare-dobandire-auto-model-2026-ITL-054.pdf');
  const filePath = targetPath || defaultPath;

  console.log(`\n🔍 Inspecting PDF: ${filePath}\n`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found at: ${filePath}`);
    console.log(`💡 Place "contract-instrainare-dobandire-auto-model-2026-ITL-054.pdf" in the root directory to inspect.`);
    return;
  }

  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log('--- 📋 PDF Form Fields Found ---');
  if (fields.length === 0) {
    console.log('⚠️  No interactive AcroForm fields found in this PDF file.');
    console.log('💡 You can open the PDF in Adobe Acrobat (Prepare Form) or PDFescape to add named form fields.');
    return;
  }

  fields.forEach((field, index) => {
    const type = field.constructor.name;
    const name = field.getName();
    console.log(`[${String(index + 1).padStart(2, '0')}] Type: ${type.padEnd(16)} | Name: "${name}"`);
  });

  console.log(`\n✅ Total fields found: ${fields.length}\n`);
}

// Execute inspection when run directly
const args = process.argv.slice(2);
inspectPdfFields(args[0]);
