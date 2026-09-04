import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, User, MapPin, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BuletinFormData, BuletinDecisionState } from '../../../types/ghiseu';
import { generateCerereBuletinPdf } from '../../../lib/pdf/cerere-buletin-generator';
import { useTheme } from '../../../context/ThemeContext';

interface BuletinFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionState: BuletinDecisionState;
}

export const BuletinFormModal: React.FC<BuletinFormModalProps> = ({
  isOpen,
  onClose,
  decisionState,
}) => {
  const { isDark } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);

  const getInitialMotive = () => {
    switch (decisionState.motive) {
      case 'expirare': return 'Expirare termen de valabilitate act de identitate';
      case 'schimbare_domiciliu': return 'Schimbare de domiciliu (adresa noua)';
      case 'pierdut_furt_deteriorat': return 'Pierderea / furtul / deteriorarea actului anterior';
      case 'schimbare_nume': return 'Schimbare nume de familie (casatorie / divort)';
      case 'varsta_14': return 'Implinirea varstei de 14 ani (prima eliberare)';
      default: return 'Eliberare act de identitate conform OUG 97/2005';
    }
  };

  const [formData, setFormData] = useState<BuletinFormData>({
    nume: 'POPESCU',
    prenume: 'ALEXANDRU',
    cnp: '1940512410034',
    loculNasteriiJudet: 'Bucuresti',
    loculNasteriiLocalitate: 'Sector 3',
    numeTata: 'GHEORGHE',
    numeMama: 'ELENA',
    telefon: '0722123456',
    email: 'alexandru.popescu@email.com',
    adresaNouaJudet: 'Bucuresti',
    adresaNouaLocalitate: 'Sector 2',
    adresaNouaStrada: 'Bulevardul Dacia',
    adresaNouaNumar: '45',
    adresaNouaBloc: 'B2',
    adresaNouaScara: '1',
    adresaNouaEtaj: '3',
    adresaNouaAp: '12',
    motivSolicitare: getInitialMotive(),
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGenerating(true);
      const pdfBytes = await generateCerereBuletinPdf(formData);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cerere_Eliberare_CI_${formData.nume}_${formData.prenume}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Eroare generare PDF buletin:', err);
      alert('A apărut o problemă la generarea formularului PDF. Vă rugăm reîncercați.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[24px] border shadow-2xl overflow-hidden ${isDark ? 'bg-[#121622] border-white/[0.1] text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-inherit">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0058FF]/15 text-[#0058FF] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Generare Cerere Oficială C.I. (Anexa 1)</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Conform H.G. nr. 295/2021 • Gata de printat și semnat la ghișeu
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

        {/* Modal Form Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 flex flex-col gap-6 text-sm">

          {/* Quick Notice */}
          <div className={`p-3.5 rounded-[14px] border flex items-center gap-3 text-xs ${isDark ? 'bg-[#0058FF]/10 border-[#38BDF8]/20 text-[#38BDF8]' : 'bg-[#0058FF]/5 border-[#0058FF]/20 text-[#0058FF]'
            }`}>
            <span>
              Datele tale sunt prelucrate 100% local în browser și nu sunt salvate pe niciun server. Formularul generat respectă dimensiunile și rubricațiile oficiale impuse de Direcția Generală pentru Evidența Persoanelor.
            </span>
          </div>

          {/* Section 1: Date Personale */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              1. Date Solicitant
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Nume de familie</label>
                <input
                  type="text"
                  name="nume"
                  value={formData.nume}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Prenume</label>
                <input
                  type="text"
                  name="prenume"
                  value={formData.prenume}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
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
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
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
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Prenume Tată</label>
                <input
                  type="text"
                  name="numeTata"
                  value={formData.numeTata}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Prenume Mamă</label>
                <input
                  type="text"
                  name="numeMama"
                  value={formData.numeMama}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Adresă Nouă Domiciliu */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              2. Domiciliu Solicitat (Noua Adresă)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Județ / Sector</label>
                <input
                  type="text"
                  name="adresaNouaJudet"
                  value={formData.adresaNouaJudet}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Localitate</label>
                <input
                  type="text"
                  name="adresaNouaLocalitate"
                  value={formData.adresaNouaLocalitate}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>

              <div className="col-span-3">
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Strada</label>
                <input
                  type="text"
                  name="adresaNouaStrada"
                  value={formData.adresaNouaStrada}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Nr.</label>
                <input
                  type="text"
                  name="adresaNouaNumar"
                  value={formData.adresaNouaNumar}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Bloc</label>
                <input
                  type="text"
                  name="adresaNouaBloc"
                  value={formData.adresaNouaBloc}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Scară</label>
                <input
                  type="text"
                  name="adresaNouaScara"
                  value={formData.adresaNouaScara}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Etaj</label>
                <input
                  type="text"
                  name="adresaNouaEtaj"
                  value={formData.adresaNouaEtaj}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Ap.</label>
                <input
                  type="text"
                  name="adresaNouaAp"
                  value={formData.adresaNouaAp}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                    }`}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Motiv */}
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] block mb-1">Motivul solicitării</label>
            <input
              type="text"
              name="motivSolicitare"
              value={formData.motivSolicitare}
              onChange={handleChange}
              className={`w-full px-3.5 py-2 rounded-[12px] border text-sm font-medium ${isDark ? 'bg-[#1A1F2E] border-white/[0.1]' : 'bg-gray-50 border-gray-200'
                }`}
            />
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
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-full text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-md ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-98'
              } bg-[#0058FF] hover:bg-[#0047D4]`}
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Se generează PDF...' : 'Descarcă Cererea PDF Oficială'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
