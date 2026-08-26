import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { OrangeLogo } from '../common/OrangeLogo';
import { Printer, Download, X, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, closeReceipt } = useCrm();

  if (!activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 overflow-y-auto">
      
      <div className="bg-white max-w-2xl w-full shadow-2xl my-6 border-2 border-black flex flex-col">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-black text-white p-4 flex items-center justify-between no-print border-b-2 border-[#ff7900]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#ff7900] uppercase tracking-wider">
              Document Officiel Orange Prêt à l'Impression
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-[#ff7900] hover:bg-[#f16e00] text-black font-extrabold text-xs px-4 py-2 flex items-center gap-1.5 transition-colors uppercase tracking-wide shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le Document</span>
            </button>
            <button
              onClick={closeReceipt}
              className="text-gray-400 hover:text-white p-1 text-sm font-bold"
              title="Fermer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Official Printable Receipt Content */}
        <div className="p-8 sm:p-10 bg-white text-black font-sans print:p-0">
          
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-black">
            <div>
              <OrangeLogo size="lg" className="text-black" />
              <div className="mt-3 text-xs text-gray-700 space-y-0.5">
                <div className="font-extrabold text-sm text-black">{activeReceipt.agencyName}</div>
                <div>Orange SA • Service Relation Clientèle & Agences</div>
                <div className="font-mono text-[11px] text-gray-500">
                  Émis le : {activeReceipt.date}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="bg-black text-white text-xs font-mono font-bold px-3 py-1 inline-block">
                N° : {activeReceipt.receiptNumber}
              </div>
              <div className="mt-3 flex justify-end">
                <div className="w-16 h-16 border-2 border-black p-1 bg-gray-50 flex items-center justify-center">
                  <QrCode className="w-14 h-14 text-black" />
                </div>
              </div>
              <div className="text-[9px] text-gray-400 mt-1 font-mono">AUTHENTIFICATION SÉCURISÉE</div>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="my-6 py-3 px-4 bg-gray-100 border-l-4 border-l-[#ff7900]">
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
              {activeReceipt.operationType}
            </h2>
            <div className="text-xs text-emerald-800 font-bold mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Statut : {activeReceipt.status}</span>
            </div>
          </div>

          {/* Client & Operator Grid */}
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-200 text-xs">
            
            {/* Client Info */}
            <div className="p-4 bg-gray-50 border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Informations du Client / Titulaire
              </span>
              <div className="space-y-1">
                <div><span className="text-gray-500">Nom & Prénom :</span> <strong className="text-black text-sm">{activeReceipt.clientName}</strong></div>
                <div><span className="text-gray-500">Numéro Mobile :</span> <strong className="font-mono text-black text-sm">{activeReceipt.clientMsisdn}</strong></div>
                <div><span className="text-gray-500">N° Pièce Identité :</span> <span className="font-mono font-bold">{activeReceipt.clientDocumentNumber}</span></div>
              </div>
            </div>

            {/* Advisor Info */}
            <div className="p-4 bg-gray-50 border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Conseiller Émetteur & Guichet
              </span>
              <div className="space-y-1">
                <div><span className="text-gray-500">Conseiller :</span> <strong className="text-black">{activeReceipt.agentName}</strong></div>
                <div><span className="text-gray-500">Matricule :</span> <span className="font-mono font-bold">{activeReceipt.agentId}</span></div>
                <div><span className="text-gray-500">Agence :</span> <span>{activeReceipt.agencyName}</span></div>
              </div>
            </div>

          </div>

          {/* Operation Details Section */}
          <div className="py-6 border-b border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Détails de l'Opération Exécutée
            </span>
            <div className="p-4 bg-orange-50/50 border border-orange-200 text-xs leading-relaxed text-black">
              {activeReceipt.operationDetails}
            </div>

            {activeReceipt.amount !== undefined && (
              <div className="mt-4 flex items-center justify-between p-3 bg-gray-100 border border-gray-300 font-mono">
                <span className="text-xs font-bold uppercase text-gray-700">Montant de la Transaction :</span>
                <span className="text-lg font-black text-black">
                  {activeReceipt.amount.toLocaleString()} {activeReceipt.currency}
                </span>
              </div>
            )}
          </div>

          {/* Signature & Stamp Section */}
          <div className="mt-8 pt-4 grid grid-cols-2 gap-8 text-xs">
            <div className="border border-dashed border-gray-400 p-4 h-32 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Cachet & Signature de l'Agence Orange</span>
              <div className="text-[10px] text-gray-400 italic">
                Validé électroniquement par {activeReceipt.agentName} ({activeReceipt.agentId})
              </div>
            </div>

            <div className="border border-dashed border-gray-400 p-4 h-32 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Signature du Client / Titulaire</span>
              <div className="text-[10px] text-gray-400 italic">
                « Lu et approuvé, certifié exact »
              </div>
            </div>
          </div>

          {/* Legal Footer */}
          <div className="mt-8 pt-4 border-t border-gray-200 text-[10px] text-gray-500 text-center leading-relaxed">
            Document officiel généré par le Système d'Information Agence Orange. Les données personnelles sont traitées conformément aux lois en vigueur relatives à la protection des données et aux régulations des télécommunications.
          </div>

        </div>

      </div>

    </div>
  );
};
