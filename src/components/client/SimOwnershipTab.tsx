import React from 'react';
import { useCrm } from '../../context/CrmContext';

interface SimOwnershipTabProps {
  onOpenOwnershipModal: () => void;
}

export const SimOwnershipTab: React.FC<SimOwnershipTabProps> = ({ onOpenOwnershipModal }) => {
  const { selectedCustomer } = useCrm();

  if (!selectedCustomer) return null;

  const { ownershipHistory, telecom } = selectedCustomer;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border-2 border-black p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black text-black uppercase tracking-wide">
            Historique de Titularité de la Puce SIM
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            À qui appartenait le numéro <strong className="font-mono text-black">{telecom.msisdn}</strong> avant ? Traçabilité des détenteurs successifs.
          </p>
        </div>

        <button
          onClick={onOpenOwnershipModal}
          className="bg-[#ff7900] hover:bg-[#f16e00] text-black font-extrabold text-xs px-4 py-2.5 uppercase tracking-wide transition-colors flex-shrink-0"
        >
          + Effectuer une Cession / Changement de Titulaire
        </button>
      </div>

      {/* Timeline List */}
      <div className="bg-white border-2 border-gray-200 p-6">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 pb-2 border-b border-gray-200">
          Détenteurs successifs ({ownershipHistory.length}) :
        </div>

        <div className="space-y-4">
          {ownershipHistory.map((record) => {
            const isCurrent = record.periodEnd === 'ACTUEL';

            return (
              <div
                key={record.id}
                className={`p-5 border-2 transition-colors ${
                  isCurrent
                    ? 'bg-orange-50/40 border-[#ff7900]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-black text-black">
                      {record.ownerName}
                    </h4>
                    {isCurrent ? (
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 uppercase">
                        ✓ Titulaire Actuel
                      </span>
                    ) : (
                      <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 uppercase">
                        Ancien Titulaire
                      </span>
                    )}
                  </div>

                  <div className="font-mono text-xs font-bold text-black bg-white px-2.5 py-1 border border-gray-200">
                    {record.periodStart} → {record.periodEnd}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Justificatif d'Identité :</span>
                    <strong className="font-mono text-black">{record.ownerIdDocument}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Motif de Cession :</span>
                    <span className="text-gray-900 font-semibold">{record.reason}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Enrôlé à l'agence :</span>
                    <span className="text-gray-700">{record.agency} ({record.registeredByAgent})</span>
                  </div>
                </div>

                {record.notes && (
                  <div className="mt-3 text-xs text-gray-600 italic bg-white p-2.5 border border-gray-200">
                    « {record.notes} »
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
