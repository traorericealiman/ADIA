import React, { useState } from 'react';
import { useCrm } from './context/CrmContext';
import { AppLayout } from './components/layout/AppLayout';
import { Toasts } from './components/layout/Toasts';
import { LoginView } from './components/auth/LoginView';
import { PhoneNumberScreen } from './components/search/PhoneNumberScreen';
import { ClientHeader } from './components/client/ClientHeader';
import { GeneralTelecomTab } from './components/client/GeneralTelecomTab';
import { OrangeMoneyTab } from './components/client/OrangeMoneyTab';
import { SimOwnershipTab } from './components/client/SimOwnershipTab';
import { AuditTicketsTab } from './components/client/AuditTicketsTab';

// Modals
import { EnrollmentModal } from './components/modals/EnrollmentModal';
import { SimSwapModal } from './components/modals/SimSwapModal';
import { OwnershipTransferModal } from './components/modals/OwnershipTransferModal';
import { FreezeOMModal } from './components/modals/FreezeOMModal';
import { CancelTransactionModal } from './components/modals/CancelTransactionModal';
import { ResetPinModal } from './components/modals/ResetPinModal';
import { TopUpModal } from './components/modals/TopUpModal';
import { NewTicketModal } from './components/modals/NewTicketModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { OMTransaction } from './types/crm';

export const App: React.FC = () => {
  const { advisor, selectedCustomer, activeTab } = useCrm();

  // Modals state
  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [isSimSwapOpen, setIsSimSwapOpen] = useState(false);
  const [isOwnershipOpen, setIsOwnershipOpen] = useState(false);
  const [isFreezeOMOpen, setIsFreezeOMOpen] = useState(false);
  const [cancelTxModalState, setCancelTxModalState] = useState<{ isOpen: boolean; transaction: OMTransaction | null }>({
    isOpen: false,
    transaction: null
  });
  const [resetPinModalState, setResetPinModalState] = useState<{ isOpen: boolean; type: 'SIM' | 'ORANGE_MONEY' }>({
    isOpen: false,
    type: 'SIM'
  });
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  return (
    <AppLayout>
      
      {/* 1. Écran de Connexion Conseiller */}
      {!advisor ? (
        <LoginView />
      ) : !selectedCustomer ? (
        /* 2. Écran Dédié de Saisie du Numéro de Téléphone */
        <PhoneNumberScreen onOpenEnrollmentModal={() => setIsEnrollmentOpen(true)} />
      ) : (
        /* 3. Dossier Client 360° */
        <div className="w-full pb-10">
          <ClientHeader onOpenNewTicketModal={() => setIsNewTicketOpen(true)} />

          <div>
            {activeTab === 'telecom' && (
              <GeneralTelecomTab
                onOpenSimSwapModal={() => setIsSimSwapOpen(true)}
                onOpenTopUpModal={() => setIsTopUpOpen(true)}
                onOpenResetPinModal={() => setResetPinModalState({ isOpen: true, type: 'SIM' })}
                onOpenOwnershipModal={() => setIsOwnershipOpen(true)}
              />
            )}

            {activeTab === 'orange_money' && (
              <OrangeMoneyTab
                onOpenFreezeModal={() => setIsFreezeOMOpen(true)}
                onOpenCancelTxModal={(tx) => setCancelTxModalState({ isOpen: true, transaction: tx })}
                onOpenResetOMPinModal={() => setResetPinModalState({ isOpen: true, type: 'ORANGE_MONEY' })}
              />
            )}

            {activeTab === 'ownership' && (
              <SimOwnershipTab
                onOpenOwnershipModal={() => setIsOwnershipOpen(true)}
              />
            )}

            {activeTab === 'audit_tickets' && (
              <AuditTicketsTab
                onOpenNewTicketModal={() => setIsNewTicketOpen(true)}
              />
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <EnrollmentModal
        isOpen={isEnrollmentOpen}
        onClose={() => setIsEnrollmentOpen(false)}
      />

      <SimSwapModal
        isOpen={isSimSwapOpen}
        onClose={() => setIsSimSwapOpen(false)}
      />

      <OwnershipTransferModal
        isOpen={isOwnershipOpen}
        onClose={() => setIsOwnershipOpen(false)}
      />

      <FreezeOMModal
        isOpen={isFreezeOMOpen}
        onClose={() => setIsFreezeOMOpen(false)}
      />

      <CancelTransactionModal
        isOpen={cancelTxModalState.isOpen}
        transaction={cancelTxModalState.transaction}
        onClose={() => setCancelTxModalState({ isOpen: false, transaction: null })}
      />

      <ResetPinModal
        isOpen={resetPinModalState.isOpen}
        type={resetPinModalState.type}
        onClose={() => setResetPinModalState({ isOpen: false, type: 'SIM' })}
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
      />

      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
      />

      <ReceiptModal />

      {/* Floating Notifications */}
      <Toasts />

    </AppLayout>
  );
};

export default App;
