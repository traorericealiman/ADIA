import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { ArrowLeft, Printer, TicketCheck } from 'lucide-react';

interface ClientHeaderProps {
  onOpenNewTicketModal: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ onOpenNewTicketModal }) => {
  const { 
    selectedCustomer, 
    clearSelectedCustomer, 
    activeTab, 
    setActiveTab, 
    printReceipt, 
    currentAgency, 
    advisor 
  } = useCrm();

  if (!selectedCustomer) return null;

  const isOMBlocked = selectedCustomer.orangeMoney.status !== 'ACTIF';

  const handlePrintAttestation = () => {
    printReceipt({
      receiptNumber: 'ATTEST-TIT-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString('fr-FR'),
      agencyName: currentAgency.name,
      agentName: advisor?.name || 'Conseiller Agence',
      agentId: advisor?.id || 'AG-000',
      clientName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
      clientMsisdn: selectedCustomer.telecom.msisdn,
      clientDocumentNumber: `${selectedCustomer.kycDocument.type} ${selectedCustomer.kycDocument.number}`,
      operationType: 'ATTESTATION OFFICIELLE D\'IDENTIFICATION ET DE TITULARITÉ DE LIGNE',
      operationDetails: `La présente atteste que le numéro ${selectedCustomer.telecom.msisdn} (SIM ICCID: ${selectedCustomer.telecom.simIccid}) est dûment identifié au nom de M./Mme ${selectedCustomer.firstName} ${selectedCustomer.lastName}.`,
      status: 'VALIDÉ'
    });
  };

  return (
    <div className="bg-white border-2 border-black p-6 mb-6 shadow-sm">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        
        {/* Name and Phone Number */}
        <div className="flex items-center gap-4">
          <img
            src={selectedCustomer.avatarUrl}
            alt={selectedCustomer.firstName}
            className="w-14 h-14 object-cover border border-black"
          />
          <div>
            <h2 className="text-2xl font-black text-black tracking-tight uppercase">
              {selectedCustomer.firstName} {selectedCustomer.lastName}
            </h2>
            <div className="text-lg font-mono font-black text-[#ff7900] mt-0.5">
              {selectedCustomer.telecom.msisdn}
            </div>
          </div>
        </div>

        {/* Quick Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handlePrintAttestation}
            className="bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold px-3.5 py-2 border border-gray-300 transition-colors"
          >
            Imprimer Attestation de Titularité
          </button>

          <button
            onClick={onOpenNewTicketModal}
            className="bg-black hover:bg-[#ff7900] text-white hover:text-black text-xs font-bold px-3.5 py-2 transition-colors"
          >
            + Ticket SAV
          </button>

          <button
            onClick={clearSelectedCustomer}
            className="text-xs text-gray-500 hover:text-black font-bold px-2 py-2"
          >
            Fermer dossier ✕
          </button>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-4 pt-2 overflow-x-auto">
        
        <button
          onClick={() => setActiveTab('telecom')}
          className={`py-2.5 px-4 text-xs font-extrabold uppercase tracking-wide transition-colors border-b-2 ${
            activeTab === 'telecom'
              ? 'border-[#ff7900] bg-black text-white'
              : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          1. Vue Générale & Ligne Télécom
        </button>

        <button
          onClick={() => setActiveTab('orange_money')}
          className={`py-2.5 px-4 text-xs font-extrabold uppercase tracking-wide transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'orange_money'
              ? 'border-[#ff7900] bg-black text-white'
              : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <span>2. Espace Orange Money</span>
          {isOMBlocked && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab('ownership')}
          className={`py-2.5 px-4 text-xs font-extrabold uppercase tracking-wide transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'ownership'
              ? 'border-[#ff7900] bg-black text-white'
              : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <span>3. Historique Titularité Puce</span>
          <span className="bg-[#ff7900] text-black text-[10px] px-1.5 py-0.2 font-mono font-bold">
            {selectedCustomer.ownershipHistory.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit_tickets')}
          className={`py-2.5 px-4 text-xs font-extrabold uppercase tracking-wide transition-colors border-b-2 ${
            activeTab === 'audit_tickets'
              ? 'border-[#ff7900] bg-black text-white'
              : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          4. Audit & Actions ({selectedCustomer.actionAuditLogs.length})
        </button>

      </div>

    </div>
  );
};
