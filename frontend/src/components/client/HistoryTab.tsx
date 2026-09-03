import React from 'react';
import { useCrm } from '../../context/CrmContext';

export const HistoryTab: React.FC = () => {
  const { selectedCustomer } = useCrm();

  if (!selectedCustomer) return null;

  const { ownershipHistory, actionAuditLogs } = selectedCustomer;

  return (
    <div className="w-full space-y-6">
      
      {/* 1. Historique de Titularité de la Puce */}
      <div className="w-full bg-white border-2 border-gray-200 p-6">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6 pb-2 border-b border-gray-200">
          Chronologie des Propriétaires de la Ligne ({ownershipHistory?.length || 0} détenteur(s) répertorié(s)) :
        </div>

        {ownershipHistory && ownershipHistory.length > 0 ? (
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
                        {record.ownerName || '-'}
                      </h4>
                      {isCurrent ? (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 uppercase">
                          ✓ Titulaire Actuel
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 uppercase">
                          Ancien Propriétaire
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-xs font-bold text-black bg-white px-2.5 py-1 border border-gray-200">
                      {record.periodStart || '-'} → {record.periodEnd || '-'}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 block">Justificatif d'Identité :</span>
                      <strong className="font-mono text-black">{record.ownerIdDocument || '-'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Motif de Passation / Mutation :</span>
                      <span className="text-gray-900 font-semibold">{record.reason || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Agence d'Enrôlement :</span>
                      <span className="text-gray-700">{record.agency || '-'} ({record.registeredByAgent || '-'})</span>
                    </div>
                  </div>

                  {record.notes && record.notes !== '-' && (
                    <div className="mt-3 text-xs text-gray-600 italic bg-white p-2.5 border border-gray-200">
                      « {record.notes} »
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-gray-400">
            Aucun historique de titularité enregistré pour cette puce.
          </div>
        )}
      </div>

      {/* 2. Historique des Actions & Événements sur la Puce */}
      <div className="w-full bg-white border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <h3 className="text-sm font-black text-black uppercase tracking-wider">
            Historique des Actions & Événements sur la Ligne
          </h3>
          <span className="text-xs text-gray-500 font-bold">
            {actionAuditLogs?.length || 0} événement(s) enregistré(s)
          </span>
        </div>

        <div className="space-y-3">
          {!actionAuditLogs || actionAuditLogs.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400">
              Aucun événement particulier enregistré sur cette puce.
            </div>
          ) : (
            actionAuditLogs.map(log => (
              <div key={log.id} className="p-4 bg-gray-50 border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm">{log.action || '-'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-800">
                      {log.category || '-'}
                    </span>
                  </div>
                  <div className="text-gray-600 mt-1">{log.details || '-'}</div>
                </div>
                <div className="text-right text-gray-500 font-mono text-[11px] flex-shrink-0">
                  <div className="font-bold text-black">{log.timestamp || '-'}</div>
                  <div className="text-gray-600 font-sans">{log.agentName || '-'} • {log.agencyName || '-'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
