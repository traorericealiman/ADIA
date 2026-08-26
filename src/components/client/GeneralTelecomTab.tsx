import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';

interface GeneralTelecomTabProps {
  onOpenSimSwapModal: () => void;
  onOpenTopUpModal: () => void;
  onOpenResetPinModal: () => void;
  onOpenOwnershipModal: () => void;
}

export const GeneralTelecomTab: React.FC<GeneralTelecomTabProps> = ({
  onOpenSimSwapModal,
  onOpenTopUpModal,
  onOpenResetPinModal,
  onOpenOwnershipModal
}) => {
  const { selectedCustomer, revealPuk, updateLineStatus } = useCrm();

  const [revealedPuk1, setRevealedPuk1] = useState(false);
  const [revealedPuk2, setRevealedPuk2] = useState(false);
  const [copiedPuk, setCopiedPuk] = useState<string | null>(null);

  if (!selectedCustomer) return null;

  const { telecom, kycDocument } = selectedCustomer;

  const handleRevealPuk = (type: 'PUK1' | 'PUK2') => {
    const code = revealPuk(selectedCustomer.id, type);
    if (type === 'PUK1') setRevealedPuk1(true);
    else setRevealedPuk2(true);

    navigator.clipboard.writeText(code);
    setCopiedPuk(type);
    setTimeout(() => setCopiedPuk(null), 3000);
  };

  const handleToggleSuspend = () => {
    if (telecom.lineStatus === 'ACTIVE') {
      updateLineStatus(selectedCustomer.id, 'SUSPENDUE', 'Suspension demandée par le client');
    } else {
      updateLineStatus(selectedCustomer.id, 'ACTIVE', 'Réactivation demandée au guichet');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Alert if Line is not Active */}
      {telecom.lineStatus !== 'ACTIVE' && (
        <div className="bg-red-50 border-2 border-red-600 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-red-900 uppercase">
              LIGNE {telecom.lineStatus}
            </h4>
            <p className="text-xs text-red-700 mt-0.5">
              {telecom.statusReason || 'Ligne momentanément hors service.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSuspend}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5"
            >
              Réactiver la Ligne
            </button>
            <button
              onClick={onOpenSimSwapModal}
              className="bg-black hover:bg-[#ff7900] text-white hover:text-black text-xs font-bold px-3 py-1.5 transition-colors"
            >
              Faire un SIM Swap
            </button>
          </div>
        </div>
      )}

      {/* Grid: 2 Clean Wide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Titulaire Actuel de la Puce */}
        <div className="bg-white border-2 border-gray-200 p-6 flex flex-col justify-between">
          <div>
            
            {/* Header: Title + Status + Date */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-sm font-black text-black uppercase tracking-wider">
                Titulaire Actuel de la Puce
              </h3>
              
              {/* Statut Ligne SIM */}
              <span className={`text-xs font-black px-2.5 py-0.5 uppercase ${
                telecom.lineStatus === 'ACTIVE' 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                  : 'bg-red-100 text-red-900 border border-red-300'
              }`}>
                SIM {telecom.lineStatus}
              </span>
            </div>

            {/* KYC & Identity Metadata */}
            <div className="mt-4 space-y-3 text-xs">
              
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Nom & Prénoms :</span>
                <span className="font-extrabold text-sm text-black">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Date de naissance :</span>
                <span className="font-semibold text-gray-900">{selectedCustomer.dateOfBirth}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Pièce d'Identité :</span>
                <span className="font-mono font-bold text-black bg-gray-100 px-2 py-0.5">
                  {kycDocument.type} {kycDocument.number}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Nationalité :</span>
                <span className="text-gray-900">{selectedCustomer.nationality}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Adresse de résidence :</span>
                <span className="text-gray-900 truncate max-w-[220px]">{selectedCustomer.address}, {selectedCustomer.city}</span>
              </div>

              {/* Client depuis le */}
              <div className="flex items-center justify-between py-1.5 bg-orange-50/70 px-2.5 border border-orange-200">
                <span className="text-gray-700 font-medium">Client depuis le :</span>
                <span className="font-bold text-black">{selectedCustomer.customerSince}</span>
              </div>

            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={onOpenOwnershipModal}
              className="text-xs text-[#ff7900] hover:underline font-bold"
            >
              Cession / Changer de Titulaire →
            </button>
          </div>
        </div>

        {/* Card 2: Sécurité SIM & Codes PUK / PIN */}
        <div className="bg-white border-2 border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-sm font-black text-black uppercase tracking-wider">
                Données SIM & Codes PUK
              </h3>
              <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5">
                {telecom.networkType}
              </span>
            </div>

            {/* PUK 1 & PUK 2 Display */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              
              {/* PUK 1 */}
              <div className="p-3 bg-gray-50 border border-gray-300">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Code PUK 1</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-[#ff7900]">
                    {revealedPuk1 ? telecom.puk1 : '••••••••'}
                  </span>
                  <button
                    onClick={() => handleRevealPuk('PUK1')}
                    className="bg-black hover:bg-[#ff7900] text-white hover:text-black text-xs font-bold px-2 py-1 transition-colors"
                  >
                    {copiedPuk === 'PUK1' ? 'Copié ✓' : 'Révéler'}
                  </button>
                </div>
              </div>

              {/* PUK 2 */}
              <div className="p-3 bg-gray-50 border border-gray-300">
                <div className="text-[10px] font-bold text-gray-500 uppercase">Code PUK 2</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-black">
                    {revealedPuk2 ? telecom.puk2 : '••••••••'}
                  </span>
                  <button
                    onClick={() => handleRevealPuk('PUK2')}
                    className="bg-black hover:bg-[#ff7900] text-white hover:text-black text-xs font-bold px-2 py-1 transition-colors"
                  >
                    {copiedPuk === 'PUK2' ? 'Copié ✓' : 'Révéler'}
                  </button>
                </div>
              </div>

            </div>

            {/* SIM Details & PIN */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Numéro de Série SIM (ICCID) :</span>
                <span className="font-mono font-bold text-black">{telecom.simIccid}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Formule Tarifaire :</span>
                <span className="font-bold text-black">{telecom.offerName}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Code PIN SIM par défaut :</span>
                <span className="font-mono font-bold text-black">{telecom.currentPin}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={onOpenResetPinModal}
              className="text-xs text-[#ff7900] hover:underline font-bold"
            >
              Réinitialiser PIN (0000)
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSimSwapModal}
                className="bg-black hover:bg-[#ff7900] text-white hover:text-black text-xs font-bold px-3 py-1.5 transition-colors"
              >
                Remplacer SIM (Swap)
              </button>
              <button
                onClick={handleToggleSuspend}
                className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1 border border-red-300 hover:border-red-600"
              >
                {telecom.lineStatus === 'ACTIVE' ? 'Suspendre ligne' : 'Débloquer ligne'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Card 3: Soldes Voix, Pass Internet & CDR */}
      <div className="bg-white border-2 border-gray-200 p-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-5">
          <h3 className="text-sm font-black text-black uppercase tracking-wider">
            Soldes & Pass Internet
          </h3>
          <button
            onClick={onOpenTopUpModal}
            className="bg-[#ff7900] hover:bg-[#f16e00] text-black font-extrabold text-xs px-3.5 py-1.5 uppercase tracking-wide transition-colors"
          >
            + Recharger Crédit / Pass
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Main Credit */}
          <div className="p-4 bg-gray-50 border border-gray-300">
            <div className="text-xs font-bold text-gray-500 uppercase">Solde Voix Principal</div>
            <div className="mt-2 text-2xl font-black text-black font-mono">
              {telecom.balances.mainCredit.toLocaleString()} <span className="text-xs font-bold">FCFA</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Validité : {telecom.balances.creditValidity}
            </div>
          </div>

          {/* Data Pass */}
          <div className="p-4 bg-gray-50 border border-gray-300">
            <div className="text-xs font-bold text-gray-500 uppercase">Pass Internet 4G+</div>
            <div className="mt-2 text-2xl font-black text-black font-mono">
              {(telecom.balances.dataRemainingMB / 1024).toFixed(1)} <span className="text-xs font-bold">Go restants</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Expire le : {telecom.balances.dataExpiry}
            </div>
          </div>

          {/* SMS & Bonus */}
          <div className="p-4 bg-gray-50 border border-gray-300">
            <div className="text-xs font-bold text-gray-500 uppercase">SMS & Bonus Orange</div>
            <div className="mt-2 text-2xl font-black text-black font-mono">
              {telecom.balances.smsRemaining} <span className="text-xs font-bold">SMS</span>
            </div>
            <div className="mt-2 text-xs text-emerald-700 font-bold">
              Bonus : +{telecom.balances.bonusOrange.toLocaleString()} FCFA
            </div>
          </div>

        </div>

        {/* Recent CDR History */}
        {telecom.cdrHistory.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Consommations récentes :
            </div>
            <div className="space-y-2">
              {telecom.cdrHistory.map(cdr => (
                <div key={cdr.id} className="flex items-center justify-between p-2.5 bg-gray-50 text-xs border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-gray-500">{cdr.date}</span>
                    <span className="font-bold text-black">{cdr.destinationOrOrigin}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-gray-600">{cdr.durationOrVolume}</span>
                    <span className="font-bold text-black">{cdr.cost === 0 ? 'Inclus' : `${cdr.cost} FCFA`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
