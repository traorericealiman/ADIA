import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { MOCK_AGENCIES } from '../../data/mockData';
import { 
  Building2, 
  User, 
  LogOut, 
  ChevronDown, 
  Search, 
  Phone,
  ArrowLeft
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    advisor, 
    currentAgency, 
    logout, 
    setAdvisorStatus, 
    switchAgency,
    selectedCustomer,
    clearSelectedCustomer 
  } = useCrm();

  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);

  const statusLabels = {
    available: { label: 'Disponible', color: 'bg-emerald-500' },
    in_consultation: { label: 'En Consultation', color: 'bg-[#ff7900]' },
    paused: { label: 'En Pause', color: 'bg-amber-500' }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F6] flex flex-col font-sans antialiased text-gray-900 selection:bg-[#ff7900] selection:text-white">
      
      {/* Official Clean Top Navigation Bar */}
      <header className="bg-black text-white sticky top-0 z-40 border-b-2 border-[#ff7900] shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Orange Brand Block & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={clearSelectedCustomer}
                className="flex items-center gap-3 text-left focus:outline-none hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 bg-[#ff7900] rounded-none flex items-center justify-center font-black text-black text-sm select-none">
                  O
                </div>
                <div>
                  <div className="text-xs font-black tracking-widest text-[#ff7900] uppercase">
                    Orange Côte d'Ivoire
                  </div>
                  <h1 className="text-sm font-bold text-white tracking-wide">
                    Portail Conseiller Agence
                  </h1>
                </div>
              </button>

              {/* Return to Phone Number Search Button */}
              {selectedCustomer && (
                <button
                  onClick={clearSelectedCustomer}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white bg-[#222] hover:bg-[#333] px-3 py-1.5 border border-gray-700 transition-colors ml-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#ff7900]" />
                  <span>Saisir un autre numéro</span>
                </button>
              )}
            </div>

            {/* Right: Advisor Info, Agency Switcher, Status */}
            {advisor ? (
              <div className="flex items-center gap-4">
                
                {/* Agency Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
                    className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#282828] px-3 py-1.5 border border-gray-700 text-xs font-medium transition-colors text-gray-200"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#ff7900]" />
                    <span className="max-w-[160px] truncate hidden md:inline">{currentAgency.name}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>

                  {agencyDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-[#1c1c1c] border border-gray-700 shadow-2xl py-1 z-50 text-xs">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-800">
                        Sélectionner l'Agence (Côte d'Ivoire)
                      </div>
                      {MOCK_AGENCIES.map(a => (
                        <button
                          key={a.id}
                          onClick={() => {
                            switchAgency(a.id);
                            setAgencyDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-[#2a2a2a] transition-colors ${
                            a.id === currentAgency.id ? 'text-[#ff7900] font-bold bg-[#ff7900]/10' : 'text-gray-300'
                          }`}
                        >
                          <div>{a.name}</div>
                          <div className="text-[10px] text-gray-500">{a.city} • {a.address}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="hidden sm:flex items-center gap-2 text-xs bg-[#1c1c1c] px-3 py-1.5 border border-gray-700">
                  <span className={`w-2 h-2 rounded-full ${statusLabels[advisor.status].color} animate-pulse`} />
                  <span className="text-gray-300">{statusLabels[advisor.status].label}</span>
                </div>

                {/* Advisor Details */}
                <div className="flex items-center gap-2.5 pl-3 border-l border-gray-800">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-white">{advisor.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{advisor.counterNumber} • {advisor.id}</div>
                  </div>

                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-red-400 p-1.5 transition-colors border border-transparent hover:border-red-800/40"
                    title="Déconnexion"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : null}

          </div>
        </div>
      </header>

      {/* Main Wide Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-gray-200 bg-white py-3 text-center text-xs text-gray-500">
        Orange Côte d'Ivoire • Portail Espace Client & Gestion Orange Money
      </footer>

    </div>
  );
};
