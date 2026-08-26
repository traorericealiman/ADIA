import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';

interface SimSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimSwapModal: React.FC<SimSwapModalProps> = ({ isOpen, onClose }) => {
  const { selectedCustomer, performSimSwap } = useCrm();

  const [newIccid, setNewIccid] = useState(`89225 0100 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} 0`);
  const [reason, setReason] = useState('Carte SIM défectueuse / Perte de signal');

  if (!isOpen || !selectedCustomer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSimSwap(selectedCustomer.id, newIccid, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full border-2 border-black shadow-2xl">
        
        {/* Header */}
        <div className="bg-black text-white p-5 border-b-2 border-[#ff7900] flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-tight text-white">
              Remplacement de Carte SIM (SIM Swap)
            </h3>
            <p className="text-xs text-gray-400">
              Ligne : {selectedCustomer.telecom.msisdn}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold">✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="bg-gray-50 p-3 border border-gray-200 text-xs">
            <div className="text-gray-500">Titulaire :</div>
            <div className="font-bold text-black text-sm">
              {selectedCustomer.firstName} {selectedCustomer.lastName} ({selectedCustomer.kycDocument.type} : {selectedCustomer.kycDocument.number})
            </div>
            <div className="text-gray-500 mt-1">Ancien N° SIM (ICCID) : <span className="font-mono text-black">{selectedCustomer.telecom.simIccid}</span></div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Numéro de Série de la NOUVELLE Carte SIM (ICCID) *
            </label>
            <input
              type="text"
              required
              value={newIccid}
              onChange={e => setNewIccid(e.target.value)}
              className="w-full border-2 border-gray-300 focus:border-[#ff7900] p-2.5 text-xs font-mono font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Motif du Remplacement *
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full border border-gray-300 focus:border-[#ff7900] p-2.5 text-xs outline-none bg-white"
            >
              <option value="Carte SIM défectueuse / Perte de signal">Carte SIM défectueuse / Perte de signal</option>
              <option value="Perte ou vol du smartphone">Perte ou vol du smartphone</option>
              <option value="Changement de format (Micro/Nano SIM / eSIM)">Changement de format (Micro/Nano SIM / eSIM)</option>
            </select>
          </div>

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
              className="px-5 py-2 text-xs font-black text-black bg-[#ff7900] hover:bg-[#f16e00] uppercase tracking-wider shadow-sm"
            >
              Valider le SIM Swap
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
