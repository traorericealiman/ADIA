import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Lock, Unlock, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface FreezeOMModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreezeOMModal: React.FC<FreezeOMModalProps> = ({ isOpen, onClose }) => {
  const { selectedCustomer, toggleOMFreeze, advisor } = useCrm();

  const isCurrentlyFrozen = selectedCustomer?.orangeMoney.status === 'GELE_FRAUDE' || selectedCustomer?.orangeMoney.status === 'BLOQUE_TEMPORAIRE';
  const [reason, setReason] = useState('Suspicion de tentative de phishing / tentative de retrait frauduleux signalée');
  const [supervisorPass, setSupervisorPass] = useState('SUPERV-OK-2026');

  if (!isOpen || !selectedCustomer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toggleOMFreeze(selectedCustomer.id, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className={`bg-white max-w-md w-full border-2 shadow-2xl ${isCurrentlyFrozen ? 'border-emerald-600' : 'border-red-600'}`}>
        
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between ${isCurrentlyFrozen ? 'bg-emerald-700' : 'bg-red-700'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 flex items-center justify-center font-bold">
              {isCurrentlyFrozen ? <Unlock className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-tight text-white">
                {isCurrentlyFrozen ? 'Dégel / Réactivation Compte OM' : 'Gel Conservatoire du Compte OM'}
              </h3>
              <p className="text-xs text-white/80">
                Compte : {selectedCustomer.orangeMoney.accountNumber} ({selectedCustomer.firstName} {selectedCustomer.lastName})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white font-bold">✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className={`p-3.5 text-xs flex items-start gap-2 border ${
            isCurrentlyFrozen ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'
          }`}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              {isCurrentlyFrozen
                ? 'La levée du gel rétablit immédiatement la possibilité d\'effectuer des transferts et retraits d\'espèces.'
                : 'Le gel interdit immédiatement tout débit ou retrait sur les avoirs Orange Money du client (protection anti-fraude).'}
            </span>
          </div>

          {!isCurrentlyFrozen ? (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Motif Obligatoire du Gel Sécuritaire *
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full border border-gray-300 focus:border-red-600 p-2.5 text-xs outline-none bg-white"
              >
                <option value="Suspicion de phishing / tentative de retrait frauduleux">Suspicion de phishing / tentative de retrait frauduleux</option>
                <option value="Vol déclaré du téléphone et de la SIM">Vol déclaré du téléphone et de la SIM</option>
                <option value="Réquisition judiciaire / Demande des autorités">Réquisition judiciaire / Demande des autorités</option>
                <option value="Demande expresse et écrite du titulaire">Demande expresse et écrite du titulaire</option>
                <option value="Incohérence des documents d'identité KYC">Incohérence des documents d'identité KYC</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Code de Validation Superviseur / Guichet *
              </label>
              <input
                type="text"
                required
                value={supervisorPass}
                onChange={e => setSupervisorPass(e.target.value)}
                className="w-full border border-gray-300 focus:border-emerald-600 p-2.5 text-xs font-mono outline-none"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Présentation de la pièce d'identité physique certifiée conforme par le conseiller {advisor?.name}.
              </span>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-black text-white uppercase tracking-wider shadow-md ${
                isCurrentlyFrozen ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isCurrentlyFrozen ? 'Confirmer le Dégel' : 'Confirmer le Gel Immédiat'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
