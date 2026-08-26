import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { ArrowRight, UserPlus, Phone, AlertCircle } from 'lucide-react';

interface PhoneNumberScreenProps {
  onOpenEnrollmentModal: () => void;
}

export const PhoneNumberScreen: React.FC<PhoneNumberScreenProps> = ({ onOpenEnrollmentModal }) => {
  const { 
    customers, 
    selectCustomer, 
    currentAgency, 
    advisor,
    showToast 
  } = useCrm();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cleanPhone = phoneNumber.replace(/\D/g, '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!cleanPhone) {
      setErrorMessage('Veuillez saisir le numéro de téléphone du client.');
      return;
    }

    const found = customers.find(c => {
      const pClean = c.telecom.rawPhone.replace(/\D/g, '');
      const mClean = c.telecom.msisdn.replace(/\D/g, '');
      const cniClean = c.kycDocument.number.toLowerCase().replace(/\s/g, '');
      const searchLow = phoneNumber.toLowerCase().trim();

      return (
        pClean.includes(cleanPhone) ||
        mClean.includes(cleanPhone) ||
        cniClean.includes(searchLow) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchLow) ||
        `${c.lastName} ${c.firstName}`.toLowerCase().includes(searchLow)
      );
    });

    if (found) {
      selectCustomer(found);
      showToast('success', 'Dossier Ouvert', `${found.firstName} ${found.lastName} (${found.telecom.msisdn})`);
    } else {
      setErrorMessage(`Aucun client trouvé pour le numéro « ${phoneNumber} ». Vous pouvez l'enregistrer comme nouveau client.`);
    }
  };

  const handleQuickSelect = (clientPhone: string) => {
    const found = customers.find(c => c.telecom.rawPhone.includes(clientPhone) || c.telecom.msisdn.includes(clientPhone));
    if (found) {
      selectCustomer(found);
      showToast('success', 'Dossier Ouvert', `${found.firstName} ${found.lastName}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-black tracking-tight uppercase">
          Accueil & Identification Client
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Saisissez le numéro de téléphone mobile du client pour accéder à son dossier complet.
        </p>
      </div>

      {/* Main Search Card */}
      <div className="bg-white border-2 border-black p-8 sm:p-10 shadow-sm mb-10">
        
        <form onSubmit={handleSearchSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              Numéro de Téléphone Mobile (10 chiffres) :
            </label>
            
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={phoneNumber}
                onChange={e => {
                  setPhoneNumber(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Exemple : 07 08 09 10 11 (ou 05 / 01...)"
                className="w-full py-4 px-5 bg-gray-50 border-2 border-gray-300 focus:border-[#ff7900] focus:bg-white text-xl sm:text-2xl font-mono font-bold text-black outline-none transition-colors"
              />
              {phoneNumber && (
                <button
                  type="button"
                  onClick={() => setPhoneNumber('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-black"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between gap-3">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={onOpenEnrollmentModal}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 text-xs"
              >
                + Enrôler ce numéro
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#ff7900] hover:bg-[#f16e00] text-black font-extrabold text-sm uppercase tracking-wider py-4 px-6 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Accéder aux Informations du Client</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600">
          <span>Le numéro n'est pas encore identifié ou est une nouvelle puce ?</span>
          <button
            type="button"
            onClick={onOpenEnrollmentModal}
            className="text-[#ff7900] hover:underline font-bold"
          >
            + Enregistrer / Identifier un Nouveau Numéro SIM →
          </button>
        </div>

      </div>

      {/* Quick Test Scenarios */}
      <div>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Dossiers clients de test disponibles :
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Jean-Marc Koffi */}
          <button
            type="button"
            onClick={() => handleQuickSelect('0708091011')}
            className="bg-white border-2 border-gray-200 hover:border-black p-4 text-left transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-black">Jean-Marc KOFFI</span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 border border-amber-300">
                  Litige OM
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-[#ff7900] mt-1">
                07 08 09 10 11
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Transfert erroné 25 000 FCFA à annuler • 3 anciens propriétaires de puce
              </div>
            </div>
            <div className="mt-3 text-xs font-bold text-black">
              Ouvrir le dossier →
            </div>
          </button>

          {/* Aminata Touré - Mot de passe bloqué */}
          <button
            type="button"
            onClick={() => handleQuickSelect('0544556677')}
            className="bg-white border-2 border-red-300 hover:border-red-600 p-4 text-left transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-black">Aminata TOURÉ</span>
                <span className="bg-red-100 text-red-900 text-[10px] font-bold px-2 py-0.5 border border-red-300">
                  Mot de passe bloqué
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-red-600 mt-1">
                05 44 55 66 77
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Compte Orange Money bloqué après 3 tentatives de mot de passe erronées
              </div>
            </div>
            <div className="mt-3 text-xs font-bold text-red-600">
              Débloquer le mot de passe →
            </div>
          </button>

          {/* Kouassi Brou */}
          <button
            type="button"
            onClick={() => handleQuickSelect('0123456789')}
            className="bg-white border-2 border-gray-200 hover:border-black p-4 text-left transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-black">Kouassi BROU</span>
                <span className="bg-red-100 text-red-900 text-[10px] font-bold px-2 py-0.5 border border-red-300">
                  OM Gelé
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-black mt-1">
                01 23 45 67 89
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Gel de sécurité conservatoire (San Pedro)
              </div>
            </div>
            <div className="mt-3 text-xs font-bold text-black">
              Ouvrir le dossier →
            </div>
          </button>

          {/* Adama Sanogo */}
          <button
            type="button"
            onClick={() => handleQuickSelect('0712345678')}
            className="bg-white border-2 border-gray-200 hover:border-black p-4 text-left transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-black">Adama SANOGO</span>
                <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 border border-gray-300">
                  SIM Volée
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-black mt-1">
                07 12 34 56 78
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Ligne suspendue pour vol • Remplacement SIM Swap requis
              </div>
            </div>
            <div className="mt-3 text-xs font-bold text-black">
              Ouvrir le dossier →
            </div>
          </button>

        </div>
      </div>

    </div>
  );
};
