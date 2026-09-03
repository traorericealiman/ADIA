import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { OMTransaction } from '../../types/crm';
import { RotateCcw, AlertTriangle, ShieldCheck, DollarSign, X } from 'lucide-react';

interface CancelTransactionModalProps {
  isOpen: boolean;
  transaction: OMTransaction | null;
  onClose: () => void;
}

export const CancelTransactionModal: React.FC<CancelTransactionModalProps> = ({
  isOpen,
  transaction,
  onClose
}) => {
  const { selectedCustomer, cancelOMTransaction, advisor } = useCrm();

  const [reason, setReason] = useState('Erreur de composition du numéro destinataire (1 chiffre erroné)');
  const [customDetail, setCustomDetail] = useState('Le client a saisi un numéro erroné lors de l\'envoi USSD. Fonds bloqués et rapatriés.');

  if (!isOpen || !transaction || !selectedCustomer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cancelOMTransaction(selectedCustomer.id, transaction.id, `${reason} - ${customDetail}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full border-2 border-red-600 shadow-2xl">
        
        {/* Header */}
        <div className="bg-red-700 text-white p-5 border-b-2 border-red-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-tight text-white">
                Annulation & Remboursement Transaction OM
              </h3>
              <p className="text-xs text-white/80">
                Réf : {transaction.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white font-bold">✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Transaction Summary Card */}
          <div className="p-4 bg-gray-50 border border-gray-200 text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Montant à rembourser :</span>
              <span className="text-lg font-black text-black font-mono">
                {transaction.amount.toLocaleString()} {transaction.currency}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-gray-700">
              <div>
                <span className="text-gray-400 block text-[10px]">Émetteur (Client) :</span>
                <strong>{transaction.senderName}</strong> ({transaction.senderMsisdn})
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Destinataire Erroné :</span>
                <strong>{transaction.recipientName}</strong> ({transaction.recipientMsisdn})
              </div>
            </div>
            <div className="text-[11px] text-gray-500">
              Date initiale de l'opération : {transaction.date}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Motif de l'Annulation / Litige *
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full border border-gray-300 focus:border-red-600 p-2.5 text-xs outline-none bg-white"
            >
              <option value="Erreur de composition du numéro destinataire (1 chiffre erroné)">Erreur de composition du numéro destinataire (1 chiffre erroné)</option>
              <option value="Double débit suite à incident réseau USSD">Double débit suite à incident réseau USSD</option>
              <option value="Paiement marchand non délivré">Paiement marchand non délivré</option>
              <option value="Contestation de fraude / usurpation">Contestation de fraude / usurpation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Précisions pour le Dossier SAV
            </label>
            <textarea
              rows={2}
              value={customDetail}
              onChange={e => setCustomDetail(e.target.value)}
              className="w-full border border-gray-300 focus:border-red-600 p-2 text-xs outline-none"
            />
          </div>

          <div className="bg-orange-50 p-3 border border-orange-200 text-xs text-orange-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#ff7900] flex-shrink-0 mt-0.5" />
            <span>
              L'annulation recréditera immédiatement <strong>{transaction.amount.toLocaleString()} {transaction.currency}</strong> sur le compte de {selectedCustomer.firstName} {selectedCustomer.lastName} et émettra un reçu officiel d'agence.
            </span>
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
              className="px-5 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 uppercase tracking-wider shadow-md"
            >
              Confirmer l'Annulation & Recréditer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
