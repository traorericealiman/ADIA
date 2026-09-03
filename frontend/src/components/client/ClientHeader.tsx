import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { ArrowLeft } from 'lucide-react';

export const ClientHeader: React.FC = () => {
  const { 
    selectedCustomer, 
    clearSelectedCustomer, 
    activeTab, 
    setActiveTab 
  } = useCrm();

  if (!selectedCustomer) return null;

  const isOMBlocked = selectedCustomer.orangeMoney?.status !== 'ACTIF';

  return (
    <div className="w-full bg-white border-2 border-black p-6 mb-6 shadow-sm">
      
      {/* Top Details & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        
        {/* Name and Phone Number */}
        <div className="flex items-center gap-4">
          <img
            src={selectedCustomer.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={selectedCustomer.firstName || 'Client'}
            className="w-14 h-14 object-cover border border-black"
          />
          <div>
            <h2 className="text-2xl font-black text-black tracking-tight uppercase">
              {selectedCustomer.firstName || '-'} {selectedCustomer.lastName || '-'}
            </h2>
            <div className="text-xl font-mono font-black text-[#ff7900] mt-0.5">
              {selectedCustomer.telecom?.msisdn || '-'}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div>
          <button
            onClick={clearSelectedCustomer}
            className="flex items-center gap-2 bg-gray-100 hover:bg-black hover:text-white text-black font-bold text-xs px-4 py-2.5 border border-gray-300 transition-colors uppercase cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Saisir un autre numéro</span>
          </button>
        </div>

      </div>

      {/* 3 Clean Navigation Tabs */}
      <div className="flex items-center gap-3 mt-4 pt-2 overflow-x-auto">
        
        <button
          onClick={() => setActiveTab('telecom')}
          className={`py-3 px-6 text-xs font-extrabold uppercase tracking-wide transition-colors border-b-2 cursor-pointer ${
            activeTab === 'telecom'
              ? 'border-[#ff7900] bg-black text-white'
              : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          1. Informations Générales & Ligne Télécom
        </button>

        <button
          onClick={() => setActiveTab('orange_money')}
          className={`py-3 px-6 text-xs font-extrabold uppercase tracking-wide transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'orange_money'
              ? 'border-[#ff7900] bg-black text-white'
              : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <span>2. Espace Orange Money & Transactions</span>
          {isOMBlocked && <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab('ownership')}
          className={`py-3 px-6 text-xs font-extrabold uppercase tracking-wide transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'ownership' || activeTab === 'audit_tickets'
              ? 'border-[#ff7900] bg-black text-white'
              : 'border-transparent text-gray-600 hover:text-black hover:bg-gray-100'
          }`}
        >
          <span>3. Historique de la Ligne & Titularité</span>
          <span className="bg-[#ff7900] text-black text-[10px] px-1.5 py-0.2 font-mono font-bold">
            {selectedCustomer.ownershipHistory?.length || 0}
          </span>
        </button>

      </div>

    </div>
  );
};
