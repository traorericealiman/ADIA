import React from 'react';
import { useCrm } from '../../context/CrmContext';

export const AuditTicketsTab: React.FC = () => {
  const { selectedCustomer } = useCrm();

  if (!selectedCustomer) return null;

  const { actionAuditLogs } = selectedCustomer;

  return (
    <div className="w-full space-y-6">
      
      {/* Action Audit Trail */}
      <div className="w-full bg-white border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <h3 className="text-sm font-black text-black uppercase tracking-wider">
            Historique & Traçabilité des Actions sur la Ligne
          </h3>
          <span className="text-xs text-gray-500 font-bold">
            {actionAuditLogs.length} événements enregistrés
          </span>
        </div>

        <div className="space-y-3">
          {actionAuditLogs.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400">
              Aucun événement particulier enregistré sur cette puce.
            </div>
          ) : (
            actionAuditLogs.map(log => (
              <div key={log.id} className="p-4 bg-gray-50 border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm">{log.action}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-800">
                      {log.category}
                    </span>
                  </div>
                  <div className="text-gray-600 mt-1">{log.details}</div>
                </div>
                <div className="text-right text-gray-500 font-mono text-[11px] flex-shrink-0">
                  <div className="font-bold text-black">{log.timestamp}</div>
                  <div className="text-gray-600 font-sans">{log.agentName} • {log.agencyName}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
