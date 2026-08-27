import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Customer } from '../../types/crm';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react';

export const PhoneNumberScreen: React.FC = () => {
  const { customers, selectCustomer, showToast } = useCrm();

  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const clean = phoneNumber.replace(/\D/g, '');
    const searchLow = phoneNumber.toLowerCase().trim();

    // 1. Check if an existing customer matches
    let found = customers.find(c => {
      const pClean = c.telecom.rawPhone.replace(/\D/g, '');
      const mClean = c.telecom.msisdn.replace(/\D/g, '');
      const cniClean = c.kycDocument.number.toLowerCase().replace(/\s/g, '');

      return (
        (clean && (pClean.includes(clean) || mClean.includes(clean))) ||
        (searchLow && (
          cniClean.includes(searchLow) ||
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchLow) ||
          `${c.lastName} ${c.firstName}`.toLowerCase().includes(searchLow)
        ))
      );
    });

    // 2. If not found in mock data, dynamically generate a customer dossier on the fly for whatever was entered
    if (!found) {
      // Format the number to a clean MSISDN
      let formattedPhone = phoneNumber.trim();
      if (clean.length === 10) {
        formattedPhone = `${clean.slice(0, 2)} ${clean.slice(2, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)} ${clean.slice(8, 10)}`;
      } else if (clean.length > 0 && !formattedPhone.includes(' ')) {
        formattedPhone = clean.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
      }
      if (!formattedPhone) {
        formattedPhone = '07 08 09 10 11';
      }

      const generatedCustomer: Customer = {
        id: `CUST-CI-${Date.now()}`,
        firstName: 'Koffi',
        lastName: 'KOUASSI',
        gender: 'M',
        dateOfBirth: '20/06/1991',
        nationality: 'Ivoirienne',
        email: 'client.orange@gmail.com',
        address: 'Cocody Riviera 3',
        city: 'Abidjan',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        customerSince: '14/09/2019',
        kycDocument: {
          type: 'CNI',
          number: 'C01882910492',
          issuedDate: '12/05/2021',
          expiryDate: '12/05/2031',
          issuedBy: "ONECI Côte d'Ivoire"
        },
        telecom: {
          msisdn: formattedPhone,
          rawPhone: clean || '0708091011',
          simType: 'PHYSIQUE',
          simIccid: '89225 0100 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000) + ' 1',
          imsi: '612010' + Math.floor(100000000 + Math.random() * 900000000),
          networkType: '4G+',
          offerName: 'Formule Prépayé Orange Max 4G+',
          lineStatus: 'ACTIVE',
          activationDate: '14/09/2019',
          puk1: '84920194',
          puk2: '10492841',
          currentPin: '0000',
          balances: {
            mainCredit: 8500,
            currency: 'FCFA',
            creditValidity: '31/12/2026',
            dataRemainingMB: 12288,
            dataTotalMB: 15360,
            dataExpiry: '20/09/2026',
            smsRemaining: 300,
            bonusOrange: 4000
          },
          cdrHistory: [
            {
              id: 'CDR-01',
              date: '26/08/2026 09:12',
              type: 'APPEL_SORTANT',
              destinationOrOrigin: '07 07 11 22 33 (Orange)',
              durationOrVolume: '02m 15s',
              cost: 100,
              currency: 'FCFA'
            },
            {
              id: 'CDR-02',
              date: '26/08/2026 08:00',
              type: 'DATA_INTERNET',
              destinationOrOrigin: 'Session Data 4G+ LTE',
              durationOrVolume: '250 Mo',
              cost: 0,
              currency: 'FCFA'
            }
          ]
        },
        orangeMoney: {
          accountNumber: (clean || '0708091011'),
          status: 'ACTIF',
          kycLevel: 'Niveau 2 (Plafond 1 000 000 FCFA/j)',
          dailyLimit: 1000000,
          monthlyLimit: 5000000,
          currentBalance: 185000,
          savingsVaultBalance: 25000,
          currency: 'FCFA',
          isPinBlocked: false,
          transactions: [
            {
              id: 'TX-CI-' + Math.floor(1000 + Math.random() * 9000),
              date: '26/08/2026 08:30',
              type: 'Transfert d\'argent',
              label: 'Transfert vers 07 05 00 11 22',
              amount: 15000,
              fee: 150,
              currency: 'FCFA',
              senderName: 'Koffi KOUASSI',
              senderMsisdn: formattedPhone,
              recipientName: 'Awa Koné',
              recipientMsisdn: '0705001122',
              status: 'SUCCESS',
              canRollback: false
            },
            {
              id: 'TX-CI-' + Math.floor(1000 + Math.random() * 9000),
              date: '24/08/2026 14:10',
              type: 'Dépôt Cash-In',
              label: 'Dépôt Espèces Agence',
              amount: 50000,
              fee: 0,
              currency: 'FCFA',
              senderName: 'Agence Orange',
              senderMsisdn: 'AG_CI_01',
              recipientName: 'Koffi KOUASSI',
              recipientMsisdn: formattedPhone,
              status: 'SUCCESS',
              canRollback: false
            }
          ]
        },
        ownershipHistory: [
          {
            id: 'OWN-DYN-01',
            ownerName: 'Koffi KOUASSI',
            ownerIdDocument: 'CNI C01882910492',
            ownerPhoneContact: formattedPhone,
            periodStart: '14/09/2019',
            periodEnd: 'ACTUEL',
            reason: 'Attribution initiale de ligne',
            agency: 'Agence Cocody Angré',
            registeredByAgent: 'Roland KOFFI',
            notes: 'Enrôlement conforme et pièce d\'identité vérifiée.'
          }
        ],
        actionAuditLogs: [
          {
            id: 'LOG-DYN-01',
            timestamp: '14/09/2019 10:20',
            category: 'KYC_IDENTIFICATION',
            action: 'Création et enregistrement de ligne',
            details: 'Identification initiale conforme ONECI.',
            agentId: 'AG-225-ABJ-042',
            agentName: 'Roland KOFFI',
            agencyName: 'Agence Cocody Angré'
          }
        ],
        tickets: []
      };

      found = generatedCustomer;
    }

    selectCustomer(found);
    showToast('success', 'Dossier Ouvert', `${found.firstName} ${found.lastName} (${found.telecom.msisdn})`);
  };

  const handleQuickSelect = (clientPhone: string) => {
    const found = customers.find(c => c.telecom.rawPhone.includes(clientPhone) || c.telecom.msisdn.includes(clientPhone));
    if (found) {
      selectCustomer(found);
      showToast('success', 'Dossier Ouvert', `${found.firstName} ${found.lastName}`);
    }
  };

  return (
    <div className="w-full flex-1 min-h-[calc(100vh-130px)] flex flex-col justify-center items-center py-10 px-4 sm:px-8 lg:px-12">
      
      {/* Full-Screen Immersive Search Container */}
      <div className="w-full max-w-5xl bg-white border-2 border-black p-8 sm:p-14 lg:p-16 shadow-xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Subtle Orange Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#ff7900]" />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-orange-50 border border-[#ff7900]/30 text-[#ff7900] text-xs font-black uppercase tracking-widest mb-4">
            <span>Orange Côte d'Ivoire</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight uppercase">
            Consultation & Visualisation Dossier Client
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 mt-3 max-w-2xl mx-auto leading-relaxed">
            Saisissez le numéro de téléphone mobile pour accéder à toutes les informations de la puce (titulaire, SIM/eSIM, code PUK, soldes) et du compte Orange Money.
          </p>
        </div>

        {/* Wide Search Bar Form - Clean Input Without Fixed 07 */}
        <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto w-full space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
              Numéro de Téléphone Mobile (10 chiffres) :
            </label>
            
            <div className="flex flex-col sm:flex-row items-stretch bg-gray-50 border-2 border-gray-300 focus-within:border-[#ff7900] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#ff7900]/15 transition-all">
              
              {/* Search Icon */}
              <div className="flex items-center pl-5 pr-2 py-4 text-gray-400 select-none">
                <Search className="w-6 h-6 text-[#ff7900]" />
              </div>

              {/* Free Input field */}
              <input
                type="text"
                autoFocus
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="Exemple : 07 08 09 10 11"
                className="flex-1 py-4 px-4 bg-transparent text-xl sm:text-2xl font-mono font-bold text-black outline-none placeholder:text-gray-300 placeholder:font-sans placeholder:text-base"
              />

              {phoneNumber && (
                <button
                  type="button"
                  onClick={() => setPhoneNumber('')}
                  className="px-4 text-xs font-bold text-gray-400 hover:text-black uppercase self-center cursor-pointer"
                >
                  Effacer
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#ff7900] hover:bg-[#f16e00] text-black font-black text-xs sm:text-sm uppercase tracking-wider px-8 py-4 sm:py-0 flex items-center justify-center gap-2 transition-colors cursor-pointer border-t-2 sm:border-t-0 sm:border-l-2 border-black"
              >
                <span>Consulter</span>
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>
          </div>

          {/* Quick Helper Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Accès sécurisé réservé aux conseillers d'agence Orange Côte d'Ivoire</span>
          </div>

        </form>

        {/* Example Numbers Starting Strictly with 07 */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Exemples de numéros Orange (cliquer pour ouvrir) :
          </div>

          <div className="flex items-center justify-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickSelect('0708091011')}
              className="bg-gray-50 hover:bg-black hover:text-white text-gray-700 text-xs font-semibold px-3 py-1.5 border border-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="font-mono font-bold text-[#ff7900]">07 08 09 10 11</span>
              <span className="text-gray-400">•</span>
              <span>Jean-Marc KOFFI</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect('0744556677')}
              className="bg-gray-50 hover:bg-black hover:text-white text-gray-700 text-xs font-semibold px-3 py-1.5 border border-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="font-mono font-bold text-[#ff7900]">07 44 55 66 77</span>
              <span className="text-gray-400">•</span>
              <span>Aminata TOURÉ (eSIM)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect('0723456789')}
              className="bg-gray-50 hover:bg-black hover:text-white text-gray-700 text-xs font-semibold px-3 py-1.5 border border-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="font-mono font-bold text-[#ff7900]">07 23 45 67 89</span>
              <span className="text-gray-400">•</span>
              <span>Kouassi BROU</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect('0712345678')}
              className="bg-gray-50 hover:bg-black hover:text-white text-gray-700 text-xs font-semibold px-3 py-1.5 border border-gray-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span className="font-mono font-bold text-[#ff7900]">07 12 34 56 78</span>
              <span className="text-gray-400">•</span>
              <span>Adama SANOGO</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
