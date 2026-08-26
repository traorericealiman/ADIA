import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { KeyRound, Smartphone, ShieldCheck, X } from 'lucide-react';

interface ResetPinModalProps {
  isOpen: boolean;
  type: 'SIM' | 'ORANGE_MONEY';
  onClose: () => void;
}

export const ResetPinModal: React.FC<ResetPinModalProps> = ({
  isOpen,
  type,
  onClose
}) => {
  const { selectedCustomer, resetPinSim, resetOMPin, advisor } = useCrm();

  const [newSimPin, setNewSimPin] = useState('0000');
  const [verificationMethod, setVerificationMethod] = useState('Présentation CNI Physique Originale au guichet');

  if (!isOpen || !selectedCustomer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'SIM') {
      resetPinSim(selectedCustomer.id, newSimPin);
    } else {
      resetOMPin(selectedCustomer.id, verificationMethod);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full border-2 border-black shadow-2xl">
        
        {/* Header */}
        <div className="bg-black text-white p-5 border-b-2 border-[#ff7900] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff7900] text-black flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-tight text-white">
                {type === 'SIM' ? 'Réinitialiser Code PIN SIM' : 'Réinitialiser Code Secret OM'}
              </h3>
              <p className="text-xs text-gray-400">
                Numéro : {selectedCustomer.telecom.msisdn}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold">✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="bg-gray-50 p-3 border border-gray-200 text-xs">
            <div className="text-gray-500">Titulaire authentifié :</div>
            <div className="font-bold text-black text-sm">
              {selectedCustomer.firstName} {selectedCustomer.lastName}
            </div>
            <div className="text-gray-500 mt-0.5">
              {selectedCustomer.kycDocument.type} : {selectedCustomer.kycDocument.number}
            </div>
          </div>

          {type === 'SIM' ? (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nouveau Code PIN SIM (4 chiffres) *
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={newSimPin}
                onChange={e => setNewSimPin(e.target.value)}
                className="w-full border-2 border-gray-300 focus:border-[#ff7900] p-2.5 text-center text-lg font-mono font-bold tracking-widest outline-none"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Par défaut Orange : 0000. Le client sera invité à le modifier dans son terminal.
              </span>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Méthode de Vérification & Contrôle d'Identité *
              </label>
              <select
                value={verificationMethod}
                onChange={e => setVerificationMethod(e.target.value)}
                className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none bg-white"
              >
                <option value="Présentation CNI Physique Originale au guichet">Présentation CNI Physique Originale au guichet</option>
                <option value="Contrôle Biométrique & Photo Titulaire">Contrôle Biométrique & Photo Titulaire</option>
                <option value="Code OTP de Sécurité Validé par SMS">Code OTP de Sécurité Validé par SMS</option>
              </select>
              <p className="text-[11px] text-gray-500 mt-2">
                Un code PIN Orange Money provisoire à 4 chiffres sera immédiatement transmis par SMS crypté sur le mobile du titulaire.
              </p>
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
              className="px-5 py-2 text-xs font-black text-black bg-[#ff7900] hover:bg-[#f16e00] uppercase tracking-wider shadow-md"
            >
              Valider la Réinitialisation
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
