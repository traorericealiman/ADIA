import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';

export const GeneralTelecomTab: React.FC = () => {
  const { selectedCustomer, showToast } = useCrm();

  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!selectedCustomer) return null;

  const { telecom, kycDocument } = selectedCustomer;
  const isEsim = telecom.simType === 'ESIM';

  const handleCopy = (text: string, label: string) => {
    if (!text || text === '-') return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast('info', 'Copié', `${label} (${text}) copié dans le presse-papier.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formattedAddress = [selectedCustomer.address, selectedCustomer.city].filter(Boolean).filter(s => s !== '-').join(', ') || '-';

  return (
    <div className="w-full space-y-6">
      
      {/* Alert if Line is Suspended or Stolen */}
      {telecom.lineStatus !== 'ACTIVE' && (
        <div className="w-full bg-red-50 border-2 border-red-600 p-4 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black text-red-900 uppercase">
              STATUT DE LA LIGNE : {telecom.lineStatus || '-'}
            </h4>
            <p className="text-xs text-red-700 mt-0.5">
              {telecom.statusReason || 'Ligne momentanément hors service.'}
            </p>
          </div>
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase">
            Suspendue
          </span>
        </div>
      )}

      {/* Grid: 2 Full-Width Clean Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* Card 1: Titulaire Actuel de la Puce */}
        <div className="bg-white border-2 border-gray-200 p-6 flex flex-col justify-between">
          <div>
            
            {/* Header: Title + Status */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-sm font-black text-black uppercase tracking-wider">
                Titulaire Actuel de la Puce
              </h3>
              
              {/* Statut Ligne SIM */}
              <span className={`text-xs font-black px-3 py-0.5 uppercase ${
                telecom.lineStatus === 'ACTIVE' 
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                  : 'bg-red-100 text-red-900 border border-red-300'
              }`}>
                SIM {telecom.lineStatus || '-'}
              </span>
            </div>

            {/* KYC & Identity Metadata */}
            <div className="mt-4 space-y-3.5 text-xs">
              
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Nom & Prénoms :</span>
                <span className="font-extrabold text-sm text-black">
                  {selectedCustomer.firstName || '-'} {selectedCustomer.lastName || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Date de naissance :</span>
                <span className="font-semibold text-gray-900">
                  {selectedCustomer.dateOfBirth || '-'} ({selectedCustomer.gender === 'M' ? 'Homme' : selectedCustomer.gender === 'F' ? 'Femme' : '-'})
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Pièce d'Identité :</span>
                <span className="font-mono font-bold text-black bg-gray-100 px-2 py-0.5 border border-gray-200">
                  {kycDocument?.type || '-'} {kycDocument?.number || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Nationalité :</span>
                <span className="text-gray-900">{selectedCustomer.nationality || '-'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Adresse de résidence :</span>
                <span className="text-gray-900 truncate max-w-xs">{formattedAddress}</span>
              </div>

              {/* Client depuis le */}
              <div className="flex items-center justify-between py-2 bg-orange-50 px-3 border border-orange-200">
                <span className="text-gray-700 font-medium">Client Orange depuis le :</span>
                <span className="font-black text-black">{selectedCustomer.customerSince || '-'}</span>
              </div>

            </div>
          </div>
        </div>

        {/* Card 2: Données Techniques SIM & Code PUK */}
        <div className="bg-white border-2 border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-sm font-black text-black uppercase tracking-wider">
                Données SIM & Code PUK
              </h3>
              <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 border border-gray-300">
                {telecom.networkType || '-'} LTE
              </span>
            </div>

            {/* Single Clean PUK Display */}
            <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-300">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-gray-500 uppercase">Code PUK Déblocage SIM</div>
                  <div className="font-mono text-2xl font-black text-[#ff7900] tracking-widest mt-1">
                    {telecom.puk1 || '-'}
                  </div>
                </div>

                {telecom.puk1 && telecom.puk1 !== '-' && (
                  <button
                    onClick={() => handleCopy(telecom.puk1, 'Code PUK')}
                    className="bg-black hover:bg-[#ff7900] text-white hover:text-black text-xs font-bold px-3 py-2 transition-colors uppercase cursor-pointer"
                  >
                    {copiedField === 'Code PUK' ? 'Copié ✓' : 'Copier PUK'}
                  </button>
                )}
              </div>
            </div>

            {/* SIM Details, Type (eSIM / Physique) & PIN */}
            <div className="mt-4 space-y-2.5 text-xs">
              
              {/* Type de Puce : eSIM ou Physique */}
              <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Type de Puce / Support :</span>
                {isEsim ? (
                  <span className="bg-[#ff7900] text-black font-black text-xs px-2.5 py-0.5 uppercase tracking-wide">
                    ✓ Profil eSIM (Dématérialisée)
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-800 font-bold text-xs px-2.5 py-0.5 border border-gray-300 uppercase">
                    Carte SIM Physique
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">N° Série SIM (ICCID) :</span>
                <span className="font-mono font-bold text-black bg-gray-100 px-2 py-0.5">
                  {telecom.simIccid || '-'}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Code IMSI Réseau :</span>
                <span className="font-mono font-bold text-gray-700">{telecom.imsi || '-'}</span>
              </div>
              
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Formule Tarifaire :</span>
                <span className="font-bold text-black">{telecom.offerName || '-'}</span>
              </div>
              
              <div className="flex items-center justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Code PIN SIM par défaut :</span>
                <span className="font-mono font-black text-black bg-gray-100 px-2 py-0.5">{telecom.currentPin || '-'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Card 3: Soldes Voix, Pass Internet & Consommations */}
      <div className="bg-white border-2 border-gray-200 p-6 w-full">
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-5">
          <h3 className="text-sm font-black text-black uppercase tracking-wider">
            Soldes Télécom & Consommations d'Appel / Data
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Main Credit */}
          <div className="p-4 bg-gray-50 border border-gray-300">
            <div className="text-xs font-bold text-gray-500 uppercase">Solde Voix Principal</div>
            <div className="mt-2 text-2xl font-black text-black font-mono">
              {(telecom.balances?.mainCredit ?? 0).toLocaleString()} <span className="text-xs font-bold">FCFA</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Validité : {telecom.balances?.creditValidity || '-'}
            </div>
          </div>

          {/* Data Pass */}
          <div className="p-4 bg-gray-50 border border-gray-300">
            <div className="text-xs font-bold text-gray-500 uppercase">Pass Internet 4G+</div>
            <div className="mt-2 text-2xl font-black text-black font-mono">
              {((telecom.balances?.dataRemainingMB ?? 0) / 1024).toFixed(1)} <span className="text-xs font-bold">Go restants</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Sur {((telecom.balances?.dataTotalMB ?? 0) / 1024).toFixed(0)} Go • Expire le : {telecom.balances?.dataExpiry || '-'}
            </div>
          </div>

          {/* SMS & Bonus */}
          <div className="p-4 bg-gray-50 border border-gray-300">
            <div className="text-xs font-bold text-gray-500 uppercase">SMS & Bonus Orange</div>
            <div className="mt-2 text-2xl font-black text-black font-mono">
              {telecom.balances?.smsRemaining ?? 0} <span className="text-xs font-bold">SMS</span>
            </div>
            <div className="mt-2 text-xs text-emerald-700 font-bold">
              Bonus Voix : +{(telecom.balances?.bonusOrange ?? 0).toLocaleString()} FCFA
            </div>
          </div>

        </div>

        {/* Consommations Récentes */}
        {telecom.cdrHistory && telecom.cdrHistory.length > 0 ? (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Historique des consommations récentes (Appels & Connexions) :
            </div>
            <div className="space-y-2">
              {telecom.cdrHistory.map(cdr => (
                <div key={cdr.id} className="flex items-center justify-between p-3 bg-gray-50 text-xs border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-gray-500">{cdr.date || '-'}</span>
                    <span className="font-bold text-black">{cdr.destinationOrOrigin || '-'}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-gray-600">{cdr.durationOrVolume || '-'}</span>
                    <span className="font-bold text-black">{cdr.cost === 0 ? 'Inclus' : `${cdr.cost} FCFA`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-400 py-3">
            Aucun historique d'appel ou de connexion récent.
          </div>
        )}

      </div>

    </div>
  );
};
