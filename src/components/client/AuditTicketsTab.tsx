import React from 'react';
import { useCrm } from '../../context/CrmContext';

interface AuditTicketsTabProps {
  onOpenNewTicketModal: () => void;
}

export const AuditTicketsTab: React.FC<AuditTicketsTabProps> = ({ onOpenNewTicketModal }) => {
  const { selectedCustomer } = useCrm();

  if (!selectedCustomer) return null;

  const { actionAuditLogs, tickets } = selectedCustomer;

  return (
    <div className="space-y-6">
      
      {/* Tickets Support */}
      <div className="bg-white border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <h3 className="text-sm font-black text-black uppercase tracking-wider">
            Tickets & Réclamations SAV
          </h3>
          <button
            onClick={onOpenNewTicketModal}
            className="bg-black hover:bg-[#ff7900] text-white hover:text-black font-bold text-xs px-3.5 py-1.5 uppercase transition-colors"
          >
            + Ouvrir un Ticket
          </button>
        </div>

        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-400">
              Aucune réclamation ouverte pour ce client.
            </div>
          ) : (
            tickets.map(t => (
              <div key={t.id} className="p-4 bg-gray-50 border border-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-black bg-white px-2 py-0.5 border border-gray-300">
                      {t.id}
                    </span>
                    <h4 className="text-sm font-bold text-black">{t.subject}</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 border border-amber-300">
                    {t.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-2">{t.description}</p>
                <div className="text-[11px] text-gray-500 flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
                  <span>Créé le {t.createdAt}</span>
                  <span>Assigné à : <strong className="text-black">{t.assignedTo}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Audit Trail */}
      <div className="bg-white border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <h3 className="text-sm font-black text-black uppercase tracking-wider">
            Journal d'Audit des Interventions Conseillers
          </h3>
          <span className="text-xs text-gray-500">
            {actionAuditLogs.length} événements
          </span>
        </div>

        <div className="space-y-2.5">
          {actionAuditLogs.map(log => (
            <div key={log.id} className="p-3.5 bg-gray-50 border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black">{log.action}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 text-gray-800">
                    {log.category}
                  </span>
                </div>
                <div className="text-gray-600 mt-0.5">{log.details}</div>
              </div>
              <div className="text-right text-gray-500 font-mono text-[11px] flex-shrink-0">
                <div>{log.timestamp}</div>
                <div className="text-gray-700 font-sans">{log.agentName} ({log.agencyName})</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
