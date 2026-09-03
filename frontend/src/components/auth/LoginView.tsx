import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { MOCK_AGENCIES } from '../../data/mockData';
import { ArrowRight } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useCrm();

  const [agentId, setAgentId] = useState('AG-225-ABJ-042');
  const [agentName, setAgentName] = useState('Roland KOFFI');
  const [password, setPassword] = useState('••••••••');
  const [selectedAgencyId, setSelectedAgencyId] = useState(MOCK_AGENCIES[1].id);
  const [counterNumber, setCounterNumber] = useState('Guichet 04');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const agency = MOCK_AGENCIES.find(a => a.id === selectedAgencyId) || MOCK_AGENCIES[0];
    login({
      id: agentId,
      name: agentName,
      agency,
      counterNumber,
      servedTodayCount: 12
    });
  };

  const handleQuickLogin = () => {
    login({
      id: 'AG-225-ABJ-042',
      name: 'Roland KOFFI',
      agency: MOCK_AGENCIES[1],
      counterNumber: 'Guichet 04',
      servedTodayCount: 12
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
      
      {/* Login Card */}
      <div className="w-full max-w-md bg-white border-2 border-black p-8 sm:p-10 shadow-lg">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#ff7900] flex items-center justify-center mx-auto mb-3">
            <span className="text-black font-black text-2xl">O</span>
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight uppercase">
            Portail Conseiller Agence
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Orange Côte d'Ivoire • Authentification de Guichet
          </p>
        </div>

        {/* 1-Click Demo Shortcut */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full py-3 px-4 bg-orange-50 hover:bg-[#ff7900] hover:text-black border border-[#ff7900] text-xs font-bold text-[#ff7900] transition-colors flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
          >
            <span>Connexion Rapide Démo (Roland Koffi)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <span className="relative bg-white px-3 text-xs text-gray-400 font-medium">ou saisie personnalisée</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Matricule Agent
            </label>
            <input
              type="text"
              required
              value={agentId}
              onChange={e => setAgentId(e.target.value)}
              className="w-full border border-gray-300 text-xs px-3 py-2.5 font-mono focus:border-[#ff7900] outline-none"
              placeholder="AG-225-ABJ-042"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Nom du Conseiller
            </label>
            <input
              type="text"
              required
              value={agentName}
              onChange={e => setAgentName(e.target.value)}
              className="w-full border border-gray-300 text-xs px-3 py-2.5 focus:border-[#ff7900] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Agence
            </label>
            <select
              value={selectedAgencyId}
              onChange={e => setSelectedAgencyId(e.target.value)}
              className="w-full border border-gray-300 text-xs px-3 py-2.5 focus:border-[#ff7900] outline-none bg-white cursor-pointer"
            >
              {MOCK_AGENCIES.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 text-xs px-3 py-2.5 font-mono focus:border-[#ff7900] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-black hover:bg-[#ff7900] text-white hover:text-black font-extrabold text-xs uppercase tracking-wider py-3.5 px-4 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Ouvrir la session</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>

    </div>
  );
};
