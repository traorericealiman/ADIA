import React from 'react';
import { useCrm } from './context/CrmContext';
import { AppLayout } from './components/layout/AppLayout';
import { Toasts } from './components/layout/Toasts';
import { LoginView } from './components/auth/LoginView';
import { PhoneNumberScreen } from './components/search/PhoneNumberScreen';
import { ClientHeader } from './components/client/ClientHeader';
import { GeneralTelecomTab } from './components/client/GeneralTelecomTab';
import { OrangeMoneyTab } from './components/client/OrangeMoneyTab';
import { HistoryTab } from './components/client/HistoryTab';

export const App: React.FC = () => {
  const { advisor, selectedCustomer, activeTab } = useCrm();

  return (
    <AppLayout>
      
      {/* 1. Écran de Connexion Conseiller */}
      {!advisor ? (
        <LoginView />
      ) : !selectedCustomer ? (
        /* 2. Écran de Saisie du Numéro Client */
        <PhoneNumberScreen />
      ) : (
        /* 3. Visualisation du Client */
        <div className="w-full pb-10">
          <ClientHeader />

          <div className="w-full">
            {activeTab === 'telecom' && <GeneralTelecomTab />}
            {activeTab === 'orange_money' && <OrangeMoneyTab />}
            {(activeTab === 'ownership' || activeTab === 'audit_tickets') && <HistoryTab />}
          </div>
        </div>
      )}

      {/* Floating Notification Toasts */}
      <Toasts />

    </AppLayout>
  );
};

export default App;
