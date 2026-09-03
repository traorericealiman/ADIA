import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { getClientProfileByPhone } from '../../services/accesclient';
import { ArrowRight, Search, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

export const PhoneNumberScreen: React.FC = () => {
  const { selectCustomer, showToast } = useCrm();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const clean = phoneNumber.replace(/\D/g, '');

    if (!clean) {
      setErrorMessage('Veuillez saisir le numéro de téléphone mobile du client.');
      return;
    }

    if (clean.length < 8) {
      setErrorMessage('Le numéro de téléphone est incomplet (au moins 8 à 10 chiffres requis).');
      return;
    }

    setLoading(true);

    try {
      // Appel direct et exclusif de l'API Backend Conseiller (GET /v1/customer/{phone})
      const backendCustomer = await getClientProfileByPhone(phoneNumber);
      selectCustomer(backendCustomer);
      showToast('success', 'Dossier Ouvert', `${backendCustomer.firstName} ${backendCustomer.lastName} (${backendCustomer.telecom.msisdn})`);
    } catch (apiError: any) {
      setErrorMessage(apiError?.message || `Aucun client trouvé pour le numéro « ${phoneNumber} ».`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 min-h-[calc(100vh-130px)] flex flex-col justify-center items-center py-10 px-4 sm:px-8 lg:px-12">
      
      {/* Full-Screen Immersive Search Container */}
      <div className="w-full max-w-5xl bg-white border-2 border-black p-8 sm:p-14 lg:p-16 shadow-xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Subtle Orange Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#ff7900]" />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          
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

        {/* Wide Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto w-full space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
              Numéro de Téléphone Mobile (10 chiffres) :
            </label>
            
            <div className={`flex flex-col sm:flex-row items-stretch bg-gray-50 border-2 transition-all ${
              errorMessage 
                ? 'border-red-500 focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-500/15' 
                : 'border-gray-300 focus-within:border-[#ff7900] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#ff7900]/15'
            }`}>
              
              {/* Search Icon */}
              <div className="flex items-center pl-5 pr-2 py-4 text-gray-400 select-none">
                <Search className={`w-6 h-6 ${errorMessage ? 'text-red-500' : 'text-[#ff7900]'}`} />
              </div>

              {/* Free Input field */}
              <input
                type="text"
                autoFocus
                disabled={loading}
                value={phoneNumber}
                onChange={e => {
                  setPhoneNumber(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Exemple : 07 08 09 10 11"
                className="flex-1 py-4 px-4 bg-transparent text-xl sm:text-2xl font-mono font-bold text-black outline-none placeholder:text-gray-300 placeholder:font-sans placeholder:text-base disabled:opacity-50"
              />

              {phoneNumber && !loading && (
                <button
                  type="button"
                  onClick={() => {
                    setPhoneNumber('');
                    setErrorMessage(null);
                  }}
                  className="px-4 text-xs font-bold text-gray-400 hover:text-black uppercase self-center cursor-pointer"
                >
                  Effacer
                </button>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#ff7900] hover:bg-[#f16e00] text-black font-black text-xs sm:text-sm uppercase tracking-wider px-8 py-4 sm:py-0 flex items-center justify-center gap-2 transition-colors cursor-pointer border-t-2 sm:border-t-0 sm:border-l-2 border-black disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Vérification...</span>
                  </>
                ) : (
                  <>
                    <span>Consulter</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Error Banner if customer is not found or input invalid */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border-2 border-red-400 text-xs font-bold text-red-900 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Helper Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Accès sécurisé réservé aux conseillers d'agence Orange Côte d'Ivoire</span>
          </div>

        </form>

      </div>

    </div>
  );
};
