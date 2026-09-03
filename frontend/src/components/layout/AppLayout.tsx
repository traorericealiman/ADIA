import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { MOCK_AGENCIES } from '../../data/mockData';
import { 
  Building2, 
  LogOut, 
  ChevronDown
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    advisor, 
    currentAgency, 
    logout, 
    switchAgency,
    clearSelectedCustomer 
  } = useCrm();

  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#F4F4F6] flex flex-col font-sans antialiased text-gray-900 selection:bg-[#ff7900] selection:text-white">
      
      {/* Top Navigation Bar */}
      <header className="bg-black text-white w-full sticky top-0 z-40 border-b-2 border-[#ff7900] shadow-sm">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand */}
            <div className="flex items-center gap-6">
              <button
                onClick={clearSelectedCustomer}
                className="flex items-center gap-3 text-left focus:outline-none hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 bg-[#ff7900] flex items-center justify-center font-black text-black text-sm select-none">
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
            </div>

            {/* Right: Advisor Info & Agency */}
            {advisor ? (
              <div className="flex items-center gap-4">
                
                {/* Agency Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
                    className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#282828] px-3 py-1.5 border border-gray-700 text-xs font-medium transition-colors text-gray-200"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#ff7900]" />
                    <span className="max-w-[180px] truncate hidden md:inline">{currentAgency.name}</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>

                  {agencyDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-[#1c1c1c] border border-gray-700 shadow-2xl py-1 z-50 text-xs">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-800">
                        Sélectionner l'Agence
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
                          <div className="text-[10px] text-gray-500">{a.city}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Advisor Details */}
                <div className="flex items-center gap-3 pl-3 border-l border-gray-800">
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

      {/* Main Full-Screen Content Area */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-3 px-4 sm:px-8 text-center text-xs text-gray-500">
        Orange Côte d'Ivoire • Portail Visualisation Client Télécom & Orange Money
      </footer>

    </div>
  );
};
