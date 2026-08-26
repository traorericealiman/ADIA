import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose }) => {
  const { selectedCustomer, rechargeLine } = useCrm();

  const [topUpType, setTopUpType] = useState<'credit' | 'data'>('credit');
  const [selectedAmount, setSelectedAmount] = useState<number>(5000);

  if (!isOpen || !selectedCustomer) return null;

  const amountsCredit = [1000, 2000, 5000, 10000, 25000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rechargeLine(selectedCustomer.id, selectedAmount, topUpType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full border-2 border-black shadow-2xl">
        
        {/* Header */}
        <div className="bg-black text-white p-5 border-b-2 border-[#ff7900] flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-tight text-white">
              Rechargement Ligne au Guichet
            </h3>
            <p className="text-xs text-gray-400">
              Numéro : {selectedCustomer.telecom.msisdn}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold">✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setTopUpType('credit');
                setSelectedAmount(5000);
              }}
              className={`p-3 text-xs font-bold border-2 transition-all ${
                topUpType === 'credit' 
                  ? 'border-[#ff7900] bg-orange-50 text-black font-black' 
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              Crédit Voix
            </button>

            <button
              type="button"
              onClick={() => {
                setTopUpType('data');
                setSelectedAmount(10000);
              }}
              className={`p-3 text-xs font-bold border-2 transition-all ${
                topUpType === 'data' 
                  ? 'border-[#ff7900] bg-orange-50 text-black font-black' 
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              Pass Internet (+10 Go)
            </button>
          </div>

          {topUpType === 'credit' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Montant en FCFA :
              </label>
              <div className="grid grid-cols-3 gap-2">
                {amountsCredit.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-2 px-3 text-xs font-mono font-bold border ${
                      selectedAmount === amt 
                        ? 'bg-black text-white border-black' 
                        : 'bg-gray-50 text-gray-800 border-gray-300 hover:border-black'
                    }`}
                  >
                    {amt.toLocaleString()} FCFA
                  </button>
                ))}
              </div>
            </div>
          )}

          {topUpType === 'data' && (
            <div className="p-3.5 bg-gray-50 border border-gray-200 text-xs">
              <div className="font-bold text-black text-sm">Pass Internet Mensuel 10 Go 4G+</div>
              <div className="text-gray-500 mt-1">
                Validité 30 jours (10 000 FCFA).
              </div>
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
              className="px-5 py-2 text-xs font-black text-black bg-[#ff7900] hover:bg-[#f16e00] uppercase tracking-wider"
            >
              Valider Rechargement
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
