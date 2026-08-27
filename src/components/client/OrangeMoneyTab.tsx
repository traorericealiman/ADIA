import React from 'react';
import { useCrm } from '../../context/CrmContext';

export const OrangeMoneyTab: React.FC = () => {
  const { selectedCustomer } = useCrm();

  if (!selectedCustomer) return null;

  const { orangeMoney } = selectedCustomer;
  const isBlocked = orangeMoney.status !== 'ACTIF';

  return (
    <div className="w-full space-y-6">
      
      {/* Alert if Account is Blocked or Frozen */}
      {isBlocked && (
        <div className="w-full bg-red-50 border-2 border-red-600 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black text-red-950 uppercase">
                STATUT DU COMPTE ORANGE MONEY : {orangeMoney.status === 'BLOQUE_CODE_ERRONE' ? 'BLOQUÉ SUITE À 3 MOTS DE PASSE ERRONÉS' : orangeMoney.status}
              </h4>
              <p className="text-xs text-red-800 mt-0.5">
                {orangeMoney.freezeReason || 'Compte temporairement bloqué pour des raisons de sécurité.'}
              </p>
            </div>
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase">
              Verrouillé
            </span>
          </div>
        </div>
      )}

      {/* Main Balances Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
        
        {/* Solde OM */}
        <div className="bg-white border-2 border-black p-6">
          <div className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
            <span>Solde Principal Orange Money</span>
            <span className={`text-[10px] font-black px-2 py-0.5 border ${
              orangeMoney.status === 'ACTIF' 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                : 'bg-red-100 text-red-800 border-red-300'
            }`}>
              {orangeMoney.status}
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

      {/* Transactions List */}
      <div className="bg-white border-2 border-gray-200 p-6 w-full">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <h3 className="text-sm font-black text-black uppercase tracking-wider">
            Dernières Transactions Orange Money
          </h3>
          <span className="text-xs text-gray-500">
            {orangeMoney.transactions.length} transactions enregistrées
          </span>
        </div>

        <div className="space-y-3">
          {orangeMoney.transactions.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400">
              Aucune transaction récente enregistrée sur ce compte.
            </div>
          ) : (
            orangeMoney.transactions.map(tx => (
              <div
                key={tx.id}
                className="p-4 bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div className="font-mono text-lg font-black text-black">
                    {tx.amount.toLocaleString()} FCFA
                  </div>
                  {tx.fee > 0 && (
                    <div className="text-[10px] text-gray-400">
                      Frais : {tx.fee} FCFA
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
