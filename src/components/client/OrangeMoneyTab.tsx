import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { OMTransaction } from '../../types/crm';
import { Unlock, Lock, RotateCcw } from 'lucide-react';

interface OrangeMoneyTabProps {
  onOpenFreezeModal: () => void;
  onOpenCancelTxModal: (tx: OMTransaction) => void;
  onOpenResetOMPinModal: () => void;
}

export const OrangeMoneyTab: React.FC<OrangeMoneyTabProps> = ({
  onOpenFreezeModal,
  onOpenCancelTxModal,
  onOpenResetOMPinModal
}) => {
  const { selectedCustomer, unblockOMPassword, printReceipt, currentAgency, advisor } = useCrm();

  if (!selectedCustomer) return null;

  const { orangeMoney, telecom } = selectedCustomer;
  const isPinAttemptsBlocked = orangeMoney.status === 'BLOQUE_CODE_ERRONE';
  const isFraudFrozen = orangeMoney.status === 'GELE_FRAUDE' || orangeMoney.status === 'BLOQUE_TEMPORAIRE';

  const handlePrintTxReceipt = (tx: OMTransaction) => {
    printReceipt({
      receiptNumber: 'REC-' + tx.id,
      date: tx.date,
      agencyName: currentAgency.name,
      agentName: advisor?.name || 'Conseiller Agence',
      agentId: advisor?.id || 'AG-000',
      clientName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
      clientMsisdn: telecom.msisdn,
      clientDocumentNumber: selectedCustomer.kycDocument.number,
      operationType: `TRANSACTION ORANGE MONEY (${tx.type})`,
      operationDetails: `${tx.label} | De: ${tx.senderName} (${tx.senderMsisdn}) -> Vers: ${tx.recipientName} (${tx.recipientMsisdn})`,
      transactionReference: tx.id,
      amount: tx.amount,
      currency: 'FCFA',
      status: tx.status
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Alerte Spécifique : Mot de passe bloqué après plusieurs essais erronés */}
      {isPinAttemptsBlocked && (
        <div className="bg-red-50 border-2 border-red-600 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-red-950 uppercase">
                COMPTE BLOQUÉ — 3 TENTATIVES DE MOT DE PASSE ERRONÉES
              </h4>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase">
                Accès Verrouillé
              </span>
            </div>
            <p className="text-xs text-red-800 mt-1">
              Le client a saisi un code secret incorrect à 3 reprises consécutives. L'accès USSD/Application est suspendu.
            </p>
          </div>

          <button
            onClick={() => unblockOMPassword(selectedCustomer.id)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 uppercase tracking-wider shadow-sm flex items-center gap-2 flex-shrink-0"
          >
            <Unlock className="w-4 h-4" />
            <span>Débloquer le Mot de Passe & Rétablir l'Accès</span>
          </button>
        </div>
      )}

      {/* 2. Alerte : Gel Conservatoire / Fraude */}
      {isFraudFrozen && (
        <div className="bg-red-50 border-2 border-red-600 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-black text-red-950 uppercase">
              COMPTE ORANGE MONEY GELÉ (SÉCURITÉ)
            </h4>
            <p className="text-xs text-red-800 mt-1">
              Motif : <strong>{orangeMoney.freezeReason || 'Gel de sécurité conservatoire'}</strong>
            </p>
          </div>

          <button
            onClick={onOpenFreezeModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 uppercase tracking-wider shadow-sm flex items-center gap-2 flex-shrink-0"
          >
            <Unlock className="w-4 h-4" />
            <span>Lever le Gel / Dégeler le Compte</span>
          </button>
        </div>
      )}

      {/* Main Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Solde OM */}
        <div className="bg-white border-2 border-black p-6">
          <div className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
            <span>Solde Principal Orange Money</span>
            <span className={`text-[10px] font-black px-2 py-0.5 border ${
              orangeMoney.status === 'ACTIF' 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-red-100 text-red-800 border-red-300'
            }`}>
              {orangeMoney.status === 'BLOQUE_CODE_ERRONE' ? 'MOT DE PASSE BLOQUÉ' : orangeMoney.status}
            </span>
          </div>

          <div className="mt-3 text-3xl font-black text-black font-mono">
            {orangeMoney.currentBalance.toLocaleString()} <span className="text-sm font-bold">FCFA</span>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            N° Compte OM : <strong className="font-mono text-black">{orangeMoney.accountNumber}</strong>
          </div>
        </div>

        {/* Coffre-fort */}
        <div className="bg-white border-2 border-gray-200 p-6">
          <div className="text-xs font-bold text-gray-500 uppercase">
            Coffre-fort Épargne OM
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-700 font-mono">
            {orangeMoney.savingsVaultBalance.toLocaleString()} <span className="text-sm font-bold">FCFA</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Épargne sécurisée à 3.5%
          </div>
        </div>

        {/* Plafonds */}
        <div className="bg-white border-2 border-gray-200 p-6">
          <div className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
            <span>Plafonds & Niveau</span>
            <span className="bg-[#ff7900] text-black text-[10px] font-bold px-2 py-0.5">
              {orangeMoney.kycLevel}
            </span>
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Jour :</span>
              <strong className="font-mono text-black">{orangeMoney.dailyLimit.toLocaleString()} FCFA</strong>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Mois :</span>
              <strong className="font-mono text-black">{orangeMoney.monthlyLimit.toLocaleString()} FCFA</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Actions Conseiller OM Bar */}
      <div className="bg-white border-2 border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-black text-black uppercase">
          Actions Conseiller Orange Money :
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          
          {isPinAttemptsBlocked ? (
            <button
              onClick={() => unblockOMPassword(selectedCustomer.id)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 uppercase"
            >
              Débloquer Mot de Passe (3 essais erronés)
            </button>
          ) : null}

          <button
            onClick={onOpenFreezeModal}
            className={`text-xs font-bold px-3.5 py-2 border transition-colors uppercase ${
              isFraudFrozen
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-300'
            }`}
          >
            {isFraudFrozen ? 'Lever le Gel' : 'Geler le Compte (Sécurité)'}
          </button>

          <button
            onClick={onOpenResetOMPinModal}
            className="bg-black hover:bg-[#ff7900] text-white hover:text-black text-xs font-bold px-3.5 py-2 transition-colors uppercase"
          >
            Réinitialiser Code Secret PIN OM
          </button>

        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <h3 className="text-sm font-black text-black uppercase tracking-wider">
            Dernières Transactions Orange Money
          </h3>
          <span className="text-xs text-gray-500">
            {orangeMoney.transactions.length} transactions
          </span>
        </div>

        <div className="space-y-3">
          {orangeMoney.transactions.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400">
              Aucune transaction récente enregistrée.
            </div>
          ) : (
            orangeMoney.transactions.map(tx => (
              <div
                key={tx.id}
                className={`p-4 border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  tx.status === 'EN_LITIGE'
                    ? 'bg-amber-50/70 border-amber-300'
                    : tx.status === 'ANNULEE'
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-gray-50 border-gray-200 hover:border-black'
                }`}
              >
                
                {/* Details */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-black">{tx.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-800">
                      {tx.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 ${
                      tx.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                      tx.status === 'ANNULEE' ? 'bg-gray-300 text-gray-700 line-through' :
                      tx.status === 'EN_LITIGE' ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.status}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-black mt-1">{tx.label}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    {tx.date} • {tx.senderName} ({tx.senderMsisdn}) → {tx.recipientName} ({tx.recipientMsisdn})
                  </div>
                  {tx.cancellationReason && (
                    <div className="text-xs text-red-600 font-medium mt-1">
                      Motif annulation : {tx.cancellationReason}
                    </div>
                  )}
                </div>

                {/* Amount & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200">
                  <div className="font-mono text-base font-black text-black">
                    <span className={tx.status === 'ANNULEE' ? 'line-through text-gray-400' : ''}>
                      {tx.amount.toLocaleString()} FCFA
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {tx.canRollback && tx.status !== 'ANNULEE' && (
                      <button
                        onClick={() => onOpenCancelTxModal(tx)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1 flex items-center gap-1 shadow-sm"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Annuler / Rembourser</span>
                      </button>
                    )}

                    <button
                      onClick={() => handlePrintTxReceipt(tx)}
                      className="bg-white hover:bg-black hover:text-white text-gray-800 text-xs font-bold px-2.5 py-1 border border-gray-300 transition-colors"
                    >
                      Reçu
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
