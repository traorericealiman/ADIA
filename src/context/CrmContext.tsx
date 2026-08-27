import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Customer, 
  Advisor, 
  Agency, 
  LineStatus, 
  OMStatus, 
  AuditLogEntry, 
  SupportTicket, 
  AgencyReceipt, 
  SIMOwnershipRecord,
  OMTransaction
} from '../types/crm';
import { INITIAL_CUSTOMERS, INITIAL_ADVISOR, MOCK_AGENCIES } from '../data/mockData';
import confetti from 'canvas-confetti';

interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface CrmContextType {
  advisor: Advisor | null;
  currentAgency: Agency;
  customers: Customer[];
  selectedCustomer: Customer | null;
  searchQuery: string;
  activeTab: 'telecom' | 'orange_money' | 'ownership' | 'audit_tickets';
  toasts: ToastNotification[];
  activeReceipt: AgencyReceipt | null;
  
  // Auth & Agency methods
  login: (advisorData: Partial<Advisor>) => void;
  logout: () => void;
  setAdvisorStatus: (status: 'available' | 'in_consultation' | 'paused') => void;
  switchAgency: (agencyId: string) => void;
  
  // Search & Navigation
  setSearchQuery: (query: string) => void;
  selectCustomer: (customer: Customer) => void;
  clearSelectedCustomer: () => void;
  setActiveTab: (tab: 'telecom' | 'orange_money' | 'ownership' | 'audit_tickets') => void;
  dismissToast: (id: string) => void;
  showToast: (type: 'success' | 'warning' | 'danger' | 'info', title: string, message: string) => void;
  
  // Telecom Operations
  revealPuk: (customerId: string, pukType: 'PUK1' | 'PUK2') => string;
  resetPinSim: (customerId: string, newPin: string) => void;
  updateLineStatus: (customerId: string, status: LineStatus, reason: string) => void;
  performSimSwap: (customerId: string, newIccid: string, reason: string) => void;
  transferOwnership: (
    customerId: string, 
    newOwner: {
      firstName: string;
      lastName: string;
      idType: 'CNI' | 'PASSEPORT' | 'PERMIS' | 'ATTESTATION_IDENTITE';
      idNumber: string;
      phoneContact: string;
      reason: string;
      notes: string;
    }
  ) => void;
  rechargeLine: (customerId: string, amount: number, type: 'credit' | 'data') => void;

  // Orange Money Operations
  toggleOMFreeze: (customerId: string, reason?: string) => void;
  unblockOMPassword: (customerId: string) => void;
  cancelOMTransaction: (customerId: string, transactionId: string, reason: string) => void;
  resetOMPin: (customerId: string, verificationMethod: string) => void;
  
  // Enrollment & Tickets
  enrollNewCustomer: (customerData: any) => Customer;
  createSupportTicket: (customerId: string, ticketData: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
  closeReceipt: () => void;
  printReceipt: (receipt: AgencyReceipt) => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [advisor, setAdvisor] = useState<Advisor | null>(INITIAL_ADVISOR);
  const [currentAgency, setCurrentAgency] = useState<Agency>(INITIAL_ADVISOR.agency);
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('orange_ci_crm_customers_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored customers', e);
      }
    }
    return INITIAL_CUSTOMERS;
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(INITIAL_CUSTOMERS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'telecom' | 'orange_money' | 'ownership' | 'audit_tickets'>('telecom');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<AgencyReceipt | null>(null);

  useEffect(() => {
    localStorage.setItem('orange_ci_crm_customers_v2', JSON.stringify(customers));
  }, [customers]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || null;

  const showToast = (type: 'success' | 'warning' | 'danger' | 'info', title: string, message: string) => {
    const id = 'toast_' + Date.now();
    const newToast: ToastNotification = {
      id,
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = (advisorData: Partial<Advisor>) => {
    const agency = MOCK_AGENCIES.find(a => a.id === advisorData.agency?.id) || MOCK_AGENCIES[0];
    const newAdvisor: Advisor = {
      ...INITIAL_ADVISOR,
      ...advisorData,
      agency,
      status: 'available',
      loginTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    setAdvisor(newAdvisor);
    setCurrentAgency(agency);
    showToast('success', 'Connexion Réussie', `Bienvenue ${newAdvisor.name} au ${agency.name}`);
  };

  const logout = () => {
    setAdvisor(null);
    setSelectedCustomerId(null);
    showToast('info', 'Déconnexion', 'Session conseiller clôturée.');
  };

  const setAdvisorStatus = (status: 'available' | 'in_consultation' | 'paused') => {
    if (!advisor) return;
    setAdvisor({ ...advisor, status });
  };

  const switchAgency = (agencyId: string) => {
    const found = MOCK_AGENCIES.find(a => a.id === agencyId);
    if (found && advisor) {
      setCurrentAgency(found);
      setAdvisor({ ...advisor, agency: found });
      showToast('info', 'Changement d\'Agence', `Agence active : ${found.name}`);
    }
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    if (advisor) {
      setAdvisor({
        ...advisor,
        status: 'in_consultation',
        servedTodayCount: advisor.servedTodayCount + 1
      });
    }
  };

  const clearSelectedCustomer = () => {
    setSelectedCustomerId(null);
    if (advisor) {
      setAdvisor({ ...advisor, status: 'available' });
    }
  };

  const addCustomerLog = (
    customerId: string, 
    category: AuditLogEntry['category'], 
    action: string, 
    details: string
  ) => {
    const timestamp = new Date().toLocaleString('fr-FR', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });

    const newLog: AuditLogEntry = {
      id: 'LOG-' + Date.now(),
      timestamp,
      category,
      action,
      details,
      agentId: advisor?.id || 'AG-SYSTEM',
      agentName: advisor?.name || 'Conseiller Guichet',
      agencyName: currentAgency.name
    };

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          actionAuditLogs: [newLog, ...c.actionAuditLogs]
        };
      }
      return c;
    }));
  };

  // Telecom actions
  const revealPuk = (customerId: string, pukType: 'PUK1' | 'PUK2'): string => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return '--------';
    const code = pukType === 'PUK1' ? cust.telecom.puk1 : cust.telecom.puk2;
    addCustomerLog(
      customerId, 
      'SECURITE', 
      `Consultation Code ${pukType}`, 
      `Code ${pukType} transmis au titulaire par le conseiller ${advisor?.name || ''}.`
    );
    showToast('info', `Code ${pukType}`, `Code : ${code} (copié)`);
    return code;
  };

  const resetPinSim = (customerId: string, newPin: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          telecom: {
            ...c.telecom,
            currentPin: newPin
          }
        };
      }
      return c;
    }));

    addCustomerLog(
      customerId,
      'TELECOM',
      'Réinitialisation Code PIN SIM',
      `Code PIN SIM remis à "${newPin}". Notification SMS transmise.`
    );

    showToast('success', 'Code PIN SIM Réinitialisé', `Le code PIN a été remis à ${newPin}.`);
  };

  const updateLineStatus = (customerId: string, status: LineStatus, reason: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          telecom: {
            ...c.telecom,
            lineStatus: status,
            statusReason: reason
          }
        };
      }
      return c;
    }));

    addCustomerLog(
      customerId,
      'TELECOM',
      `Modification statut ligne : ${status}`,
      `Statut : ${status}. Motif : ${reason}`
    );

    showToast(status === 'ACTIVE' ? 'success' : 'warning', `Ligne ${status}`, reason);
  };

  const performSimSwap = (customerId: string, newIccid: string, reason: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          telecom: {
            ...c.telecom,
            simIccid: newIccid,
            lineStatus: 'ACTIVE',
            statusReason: undefined,
            puk1: Math.floor(10000000 + Math.random() * 90000000).toString(),
            puk2: Math.floor(10000000 + Math.random() * 90000000).toString()
          }
        };
      }
      return c;
    }));

    addCustomerLog(
      customerId,
      'TELECOM',
      'Remplacement de Carte SIM (SIM Swap)',
      `Nouvelle SIM associée : ${newIccid}. Motif: ${reason}`
    );

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast('success', 'SIM Swap Effectué', `Nouvelle SIM ${newIccid} immédiatement active.`);
    
    if (selectedCustomer) {
      printReceipt({
        receiptNumber: 'REC-SWAP-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleString('fr-FR'),
        agencyName: currentAgency.name,
        agentName: advisor?.name || 'Conseiller Agence',
        agentId: advisor?.id || 'AG-000',
        clientName: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
        clientMsisdn: selectedCustomer.telecom.msisdn,
        clientDocumentNumber: selectedCustomer.kycDocument.number,
        operationType: 'REMPLACEMENT CARTE SIM (SIM SWAP)',
        operationDetails: `Nouvel ICCID SIM: ${newIccid} | Nouveaux codes PUK générés | Motif: ${reason}`,
        status: 'VALIDÉ'
      });
    }
  };

  const transferOwnership = (
    customerId: string, 
    newOwner: {
      firstName: string;
      lastName: string;
      idType: 'CNI' | 'PASSEPORT' | 'PERMIS' | 'ATTESTATION_IDENTITE';
      idNumber: string;
      phoneContact: string;
      reason: string;
      notes: string;
    }
  ) => {
    const today = new Date().toLocaleDateString('fr-FR');
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const previousOwnerRecord: SIMOwnershipRecord = {
      id: 'OWN-' + Date.now(),
      ownerName: `${cust.firstName} ${cust.lastName}`,
      ownerIdDocument: `${cust.kycDocument.type} ${cust.kycDocument.number}`,
      ownerPhoneContact: cust.telecom.msisdn,
      periodStart: cust.ownershipHistory[0]?.periodStart || cust.customerSince,
      periodEnd: today,
      reason: newOwner.reason || 'Cession amiable de ligne',
      agency: currentAgency.name,
      registeredByAgent: `${advisor?.name} (${advisor?.id})`,
      notes: `Cession validée vers ${newOwner.firstName} ${newOwner.lastName}. ${newOwner.notes}`
    };

    const newOwnerRecord: SIMOwnershipRecord = {
      id: 'OWN-NEW-' + Date.now(),
      ownerName: `${newOwner.firstName} ${newOwner.lastName}`,
      ownerIdDocument: `${newOwner.idType} ${newOwner.idNumber}`,
      ownerPhoneContact: newOwner.phoneContact || cust.telecom.msisdn,
      periodStart: today,
      periodEnd: 'ACTUEL',
      reason: newOwner.reason || 'Cession amiable de ligne',
      agency: currentAgency.name,
      registeredByAgent: `${advisor?.name} (${advisor?.id})`,
      notes: newOwner.notes || 'Nouveau titulaire enregistré au guichet.'
    };

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          firstName: newOwner.firstName,
          lastName: newOwner.lastName,
          kycDocument: {
            ...c.kycDocument,
            type: newOwner.idType,
            number: newOwner.idNumber,
            issuedDate: today,
            expiryDate: '10 ans',
            issuedBy: 'ONECI Côte d\'Ivoire'
          },
          ownershipHistory: [newOwnerRecord, previousOwnerRecord, ...c.ownershipHistory.filter(h => h.periodEnd !== 'ACTUEL')]
        };
      }
      return c;
    }));

    addCustomerLog(
      customerId,
      'KYC_IDENTIFICATION',
      'Changement de titulaire de ligne',
      `Ligne cédée de ${cust.firstName} ${cust.lastName} à ${newOwner.firstName} ${newOwner.lastName}.`
    );

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    showToast('success', 'Changement de Titulaire Enregistré', `La puce est maintenant au nom de ${newOwner.firstName} ${newOwner.lastName}.`);

    printReceipt({
      receiptNumber: 'ATTEST-CESS-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString('fr-FR'),
      agencyName: currentAgency.name,
      agentName: advisor?.name || 'Conseiller Agence',
      agentId: advisor?.id || 'AG-000',
      clientName: `${newOwner.firstName} ${newOwner.lastName}`,
      clientMsisdn: cust.telecom.msisdn,
      clientDocumentNumber: `${newOwner.idType} ${newOwner.idNumber}`,
      operationType: 'ATTESTATION OFFICIELLE DE CESSION DE LIGNE',
      operationDetails: `Cession de ${cust.firstName} ${cust.lastName} -> Nouveau titulaire: ${newOwner.firstName} ${newOwner.lastName}`,
      status: 'VALIDÉ'
    });
  };

  const rechargeLine = (customerId: string, amount: number, type: 'credit' | 'data') => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        if (type === 'credit') {
          return {
            ...c,
            telecom: {
              ...c.telecom,
              balances: {
                ...c.telecom.balances,
                mainCredit: c.telecom.balances.mainCredit + amount
              }
            }
          };
        } else {
          return {
            ...c,
            telecom: {
              ...c.telecom,
              balances: {
                ...c.telecom.balances,
                dataRemainingMB: c.telecom.balances.dataRemainingMB + 10240
              }
            }
          };
        }
      }
      return c;
    }));

    addCustomerLog(
      customerId,
      'TELECOM',
      `Rechargement (${type === 'credit' ? 'Crédit Voix' : 'Pass Internet'})`,
      `Rechargement de ${amount.toLocaleString()} FCFA au guichet.`
    );

    showToast('success', 'Rechargement Effectué', `Ligne créditée de ${amount.toLocaleString()} FCFA.`);
  };

  // Orange Money Actions
  const toggleOMFreeze = (customerId: string, reason?: string) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const isCurrentlyFrozen = cust.orangeMoney.status === 'GELE_FRAUDE' || cust.orangeMoney.status === 'BLOQUE_TEMPORAIRE';
    const newStatus: OMStatus = isCurrentlyFrozen ? 'ACTIF' : 'GELE_FRAUDE';
    const timestamp = new Date().toLocaleString('fr-FR');

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          orangeMoney: {
            ...c.orangeMoney,
            status: newStatus,
            freezeReason: isCurrentlyFrozen ? undefined : (reason || 'Gel conservatoire de sécurité'),
            freezeDate: isCurrentlyFrozen ? undefined : timestamp
          }
        };
      }
      return c;
    }));

    addCustomerLog(
      customerId,
      'ORANGE_MONEY',
      isCurrentlyFrozen ? 'Dégel Compte Orange Money' : 'Gel Compte Orange Money',
      isCurrentlyFrozen ? 'Compte dégelé et réactivé au guichet.' : `Compte gelé. Motif: ${reason || 'Sécurité'}`
    );

    showToast(
      isCurrentlyFrozen ? 'success' : 'danger',
      isCurrentlyFrozen ? 'Compte Orange Money Débloqué' : 'Compte Orange Money GELÉ',
      isCurrentlyFrozen ? 'Le compte est réactivé.' : `Débits bloqués. Motif: ${reason || 'Sécurité'}`
    );
  };

  // Unblock OM Password / PIN attempts (3 failed tries)
  const unblockOMPassword = (customerId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          orangeMoney: {
            ...c.orangeMoney,
            status: 'ACTIF',
            isPinBlocked: false,
            failedPinAttemptsCount: 0,
            freezeReason: undefined
          }
        };
      }
      return c;
    }));

    addCustomerLog(
      customerId,
      'ORANGE_MONEY',
      'Déblocage Code Secret OM (3 tentatives erronées)',
      'Compte débloqué après vérification de la pièce d\'identité physique en agence.'
    );

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    showToast('success', 'Compte Orange Money Débloqué', 'Le blocage pour mot de passe erroné a été levé avec succès.');
  };

  const cancelOMTransaction = (customerId: string, transactionId: string, reason: string) => {
    let cancelledTx: OMTransaction | undefined;

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updatedTransactions = c.orangeMoney.transactions.map(tx => {
          if (tx.id === transactionId) {
            cancelledTx = tx;
            return {
              ...tx,
              status: 'ANNULEE' as const,
              canRollback: false,
              cancellationReason: reason
            };
          }
          return tx;
        });

        const refundAmount = (cancelledTx && cancelledTx.senderMsisdn.includes(c.telecom.rawPhone)) ? cancelledTx.amount : 0;

        return {
          ...c,
          orangeMoney: {
            ...c.orangeMoney,
            currentBalance: c.orangeMoney.currentBalance + refundAmount,
            transactions: updatedTransactions
          }
        };
      }
      return c;
    }));

    if (cancelledTx) {
      addCustomerLog(
        customerId,
        'ORANGE_MONEY',
        `Annulation Transaction OM : ${transactionId}`,
        `Transaction de ${cancelledTx.amount.toLocaleString()} FCFA annulée. Solde recrédité. Motif: ${reason}.`
      );

      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      showToast('success', 'Transaction Annulée & Remboursée', `${cancelledTx.amount.toLocaleString()} FCFA ont été recrédités sur le compte.`);

      const cust = customers.find(c => c.id === customerId);
      if (cust) {
        printReceipt({
          receiptNumber: 'REC-CANCEL-' + Math.floor(100000 + Math.random() * 900000),
          date: new Date().toLocaleString('fr-FR'),
          agencyName: currentAgency.name,
          agentName: advisor?.name || 'Conseiller Agence',
          agentId: advisor?.id || 'AG-000',
          clientName: `${cust.firstName} ${cust.lastName}`,
          clientMsisdn: cust.telecom.msisdn,
          clientDocumentNumber: cust.kycDocument.number,
          operationType: 'ANNULATION / RECOURS TRANSACTION ORANGE MONEY',
          operationDetails: `Réf Transaction : ${transactionId} | Montant restitué : ${cancelledTx.amount.toLocaleString()} FCFA | Motif : ${reason}`,
          transactionReference: transactionId,
          amount: cancelledTx.amount,
          currency: 'FCFA',
          status: 'ANNULATION VALIDÉE & RECRÉDITÉE'
        });
      }
    }
  };

  const resetOMPin = (customerId: string, verificationMethod: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          orangeMoney: {
            ...c.orangeMoney,
            status: 'ACTIF',
            isPinBlocked: false,
            failedPinAttemptsCount: 0
          }
        };
      }
      return c;
    }));

    addCustomerLog(
      customerId,
      'ORANGE_MONEY',
      'Réinitialisation Code Secret OM',
      `Code secret provisoire envoyé par SMS au client. Procédure : ${verificationMethod}.`
    );

    showToast('success', 'Code Secret OM Réinitialisé', 'Un code secret provisoire a été envoyé par SMS.');
  };

  const enrollNewCustomer = (customerData: any): Customer => {
    const newId = 'CUST-CI-' + Math.floor(1000 + Math.random() * 9000);
    const today = new Date().toLocaleDateString('fr-FR');
    
    const newCust: Customer = {
      id: newId,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      gender: customerData.gender || 'M',
      dateOfBirth: customerData.dateOfBirth,
      nationality: 'Ivoirienne',
      email: customerData.email || `${customerData.firstName.toLowerCase()}.${customerData.lastName.toLowerCase()}@gmail.com`,
      address: customerData.address,
      city: customerData.city || 'Abidjan',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775?w=150&auto=format&fit=crop&q=80`,
      kycDocument: {
        type: customerData.idType,
        number: customerData.idNumber,
        issuedDate: today,
        expiryDate: '10 ans',
        issuedBy: 'ONECI Côte d\'Ivoire'
      },
      customerSince: today,
      telecom: {
        msisdn: customerData.phoneFormatted,
        rawPhone: customerData.rawPhone,
        simType: 'PHYSIQUE',
        simIccid: customerData.simIccid,
        imsi: '612010' + Math.floor(100000000 + Math.random() * 900000000),
        networkType: '4G+',
        offerName: 'Formule Prépayé Orange Max 4G+',
        lineStatus: 'ACTIVE',
        activationDate: today,
        puk1: Math.floor(10000000 + Math.random() * 90000000).toString(),
        puk2: Math.floor(10000000 + Math.random() * 90000000).toString(),
        currentPin: '0000',
        balances: {
          mainCredit: 1000,
          currency: 'FCFA',
          creditValidity: '31/12/2026',
          dataRemainingMB: 2048,
          dataTotalMB: 2048,
          dataExpiry: '30 jours',
          smsRemaining: 50,
          bonusOrange: 1000
        },
        cdrHistory: []
      },
      orangeMoney: {
        accountNumber: customerData.rawPhone,
        status: 'ACTIF',
        kycLevel: 'Niveau 1',
        dailyLimit: 200000,
        monthlyLimit: 1000000,
        currentBalance: 0,
        savingsVaultBalance: 0,
        currency: 'FCFA',
        isPinBlocked: false,
        transactions: []
      },
      ownershipHistory: [
        {
          id: 'OWN-' + Date.now(),
          ownerName: `${customerData.firstName} ${customerData.lastName}`,
          ownerIdDocument: `${customerData.idType} ${customerData.idNumber}`,
          ownerPhoneContact: customerData.phoneFormatted,
          periodStart: today,
          periodEnd: 'ACTUEL',
          reason: 'Enrôlement & identification initiale',
          agency: currentAgency.name,
          registeredByAgent: `${advisor?.name} (${advisor?.id})`,
          notes: 'Nouvel abonnement enregistré au guichet.'
        }
      ],
      actionAuditLogs: [
        {
          id: 'LOG-' + Date.now(),
          timestamp: new Date().toLocaleString('fr-FR'),
          category: 'KYC_IDENTIFICATION',
          action: 'Création de ligne & Enrôlement SIM',
          details: `Enrôlement de la SIM ${customerData.simIccid} au nom de ${customerData.firstName} ${customerData.lastName}.`,
          agentId: advisor?.id || 'AG-000',
          agentName: advisor?.name || 'Conseiller Agence',
          agencyName: currentAgency.name
        }
      ],
      tickets: []
    };

    setCustomers(prev => [newCust, ...prev]);
    setSelectedCustomerId(newCust.id);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    showToast('success', 'Nouveau Numéro Enrôlé', `La ligne ${newCust.telecom.msisdn} est activée.`);
    return newCust;
  };

  const createSupportTicket = (customerId: string, ticketData: Omit<SupportTicket, 'id' | 'createdAt'>) => {
    const newTicket: SupportTicket = {
      id: 'TCK-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toLocaleString('fr-FR'),
      ...ticketData
    };

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          tickets: [newTicket, ...c.tickets]
        };
      }
      return c;
    }));

    showToast('success', 'Ticket Réclamation Créé', `Ticket ${newTicket.id} enregistré.`);
  };

  const printReceipt = (receipt: AgencyReceipt) => {
    setActiveReceipt(receipt);
  };

  const closeReceipt = () => {
    setActiveReceipt(null);
  };

  return (
    <CrmContext.Provider
      value={{
        advisor,
        currentAgency,
        customers,
        selectedCustomer,
        searchQuery,
        activeTab,
        toasts,
        activeReceipt,
        login,
        logout,
        setAdvisorStatus,
        switchAgency,
        setSearchQuery,
        selectCustomer,
        clearSelectedCustomer,
        setActiveTab,
        dismissToast,
        showToast,
        revealPuk,
        resetPinSim,
        updateLineStatus,
        performSimSwap,
        transferOwnership,
        rechargeLine,
        toggleOMFreeze,
        unblockOMPassword,
        cancelOMTransaction,
        resetOMPin,
        enrollNewCustomer,
        createSupportTicket,
        closeReceipt,
        printReceipt
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
