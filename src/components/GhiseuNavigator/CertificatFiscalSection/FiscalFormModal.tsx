import React, { useState } from 'react';
import { X, Download, FileText, Building, Sparkles, User, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FiscalFormData } from '../../../types/ghiseu';
import { generateCerereFiscalPdf } from '../../../lib/pdf/cerere-fiscal-generator';
import { toast } from 'sonner';
import { useTheme } from '../../../context/ThemeContext';

interface FiscalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCity?: string;
  defaultRegion?: string;
}

export const FiscalFormModal: React.FC<FiscalFormModalProps> = ({
  isOpen,
  onClose,
  defaultCity = 'Sector 1',
  defaultRegion = 'București',
}) => {
  const { isDark } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState<FiscalFormData>({
    fullName: 'IONESCU RADU',
    cnp: '1880415410098',
    domiciliuJudet: defaultRegion,
    domiciliuLocalitate: defaultCity,
    domiciliuStrada: 'Strada Victoriei',
    domiciliuNumar: '12',
    telefon: '0733123456',
    email: 'radu.ionescu@email.com',
    scopCertificat: 'vanzare_imobil',
    detaliiBun: 'Apartament 3 camere, CF nr. 23412',
    numarExemplare: 2,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numarExemplare' ? Number(value) : value,
    }));
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const pdfBytes = await generateCerereFiscalPdf(formData);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cerere_Certificat_Fiscal_${formData.fullName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Cererea pentru certificat fiscal a fost descărcată cu succes!');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Eroare generare PDF certificat fiscal:', err);
      toast.error('A apărut o problemă la generarea cererii PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[24px] border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#121622] border-white/[0.1] text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-inherit">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0058FF]/15 text-[#0058FF] flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Cerere Tip Certificat Fiscal (Model ITL 012)</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Conform Codului de Procedură Fiscală • Gata de trimis pe e-mail sau depus la ghișeu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 flex flex-col gap-6 text-sm">
          
          <div className={`p-3.5 rounded-[14px] border flex items-center gap-3 text-xs ${
            isDark ? 'bg-[#0058FF]/10 border-[#38BDF8]/20 text-[#38BDF8]' : 'bg-[#0058FF]/5 border-[#0058FF]/20 text-[#0058FF]'
          }`}>
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>
              Certificatul fiscal atestă că nu ai datorii (impozite sau amenzi) la bugetul local al primăriei/sectorului respectiv. Are valabilitate 30 de zile pentru persoane fizice.
            </span>
          </div>

          {/* Section 1: Date Contribuabil */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              1. Date Contribuabil Solicitant
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Nume și Prenume</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">CNP</label>
                <input
                  type="text"
                  name="cnp"
                  value={formData.cnp}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Telefon de contact</label>
                <input
                  type="text"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">E-mail (pentru primire PDF)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Adresă Domiciliu / Organ Fiscal */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              2. Organ Fiscal Local & Domiciliu
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Județ / Sector</label>
                <input
                  type="text"
                  name="domiciliuJudet"
                  value={formData.domiciliuJudet}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Oraș / Comună</label>
                <input
                  type="text"
                  name="domiciliuLocalitate"
                  value={formData.domiciliuLocalitate}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="col-span-3">
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Strada</label>
                <input
                  type="text"
                  name="domiciliuStrada"
                  value={formData.domiciliuStrada}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Nr.</label>
                <input
                  type="text"
                  name="domiciliuNumar"
                  value={formData.domiciliuNumar}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Scop & Detalii */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              3. Scopul Solicitării Certificatului
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Scop utilizare</label>
                <select
                  name="scopCertificat"
                  value={formData.scopCertificat}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <option value="vanzare_imobil">Vânzare / Înstrăinare Imobil (apartament/teren)</option>
                  <option value="vanzare_auto">Vânzare Mijloc de Transport (Autoturism)</option>
                  <option value="credit_bancar">Dosar Credit Bancar / Ipotecar</option>
                  <option value="succesiune">Dezbatere Succesiune Notarială</option>
                  <option value="infiintare_firma">Sediu Social / Înființare Firmă (ONRC)</option>
                  <option value="altul">Alte Necesități Administrative</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Număr exemplare</label>
                <input
                  type="number"
                  name="numarExemplare"
                  min={1}
                  max={5}
                  value={formData.numarExemplare}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              <div className="col-span-full">
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Detalii bun (opțional: nr. cadastral, serie șasiu auto)</label>
                <input
                  type="text"
                  name="detaliiBun"
                  value={formData.detaliiBun || ''}
                  placeholder="ex: Apartament 3 camere, CF nr. 12345 sau VIN: WAUZZZ..."
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${
                    isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-5 border-t border-inherit flex items-center justify-between gap-3 bg-inherit">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            Anulează
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-full text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-98'
            } bg-[#0058FF] hover:bg-[#0047D4]`}
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Se generează...' : 'Descarcă Cererea PDF (ITL 012)'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
