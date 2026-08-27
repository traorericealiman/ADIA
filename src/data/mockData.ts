import { Agency, Advisor, Customer } from '../types/crm';

export const MOCK_AGENCIES: Agency[] = [
  {
    id: 'AG-CI-ABJ-01',
    name: 'Smart Store Orange Plateau (Siège)',
    city: 'Abidjan',
    address: 'Boulevard de la République, Plateau',
    phone: '+225 27 20 20 00 00',
    manager: 'Mamadou Bamba'
  },
  {
    id: 'AG-CI-ABJ-02',
    name: 'Agence Orange Cocody Angré 8e Tranche',
    city: 'Abidjan',
    address: 'Carrefour Bluetooth, 8e Tranche, Cocody',
    phone: '+225 27 22 40 12 89',
    manager: 'Clarisse Kouamé'
  },
  {
    id: 'AG-CI-ABJ-03',
    name: 'Agence Orange Marcory Zone 4',
    city: 'Abidjan',
    address: 'Rue Paul Langevin, Zone 4C, Marcory',
    phone: '+225 27 21 35 44 10',
    manager: 'Serge Diop'
  },
  {
    id: 'AG-CI-SP-01',
    name: 'Agence Orange San Pedro Port',
    city: 'San Pedro',
    address: 'Avenue de la Victoire, Centre Commercial',
    phone: '+225 27 34 71 20 30',
    manager: 'Awa Cissé'
  },
  {
    id: 'AG-CI-BKE-01',
    name: 'Agence Orange Bouaké Commerce',
    city: 'Bouaké',
    address: 'Avenue Reine Pokou',
    phone: '+225 27 31 63 00 00',
    manager: 'Ibrahim Koné'
  }
];

export const INITIAL_ADVISOR: Advisor = {
  id: 'AG-225-ABJ-042',
  name: 'Roland KOFFI',
  email: 'roland.koffi@orange.ci',
  agency: MOCK_AGENCIES[1],
  role: 'Conseiller Clientèle & OM',
  counterNumber: 'Guichet 04',
  status: 'available',
  servedTodayCount: 12,
  loginTime: '08:15'
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-CI-001',
    firstName: 'Jean-Marc',
    lastName: 'KOFFI',
    gender: 'M',
    dateOfBirth: '14/05/1988',
    nationality: 'Ivoirienne',
    email: 'jeanmarc.koffi@gmail.com',
    address: 'Villa 142, Cité Horizon, Riviera Palmeraie',
    city: 'Abidjan',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    customerSince: '12/03/2016',
    kycDocument: {
      type: 'CNI',
      number: 'C01492049182',
      issuedDate: '10/02/2021',
      expiryDate: '10/02/2031',
      issuedBy: 'ONECI Côte d\'Ivoire'
    },
    telecom: {
      msisdn: '07 08 09 10 11',
      rawPhone: '0708091011',
      simType: 'PHYSIQUE',
      simIccid: '89225 0100 4892 1042 1',
      imsi: '612010489210421',
      networkType: '4G+',
      offerName: 'Formule Prépayé Orange Max 4G+',
      lineStatus: 'ACTIVE',
      activationDate: '12/03/2023',
      puk1: '84920194',
      puk2: '10492841',
      currentPin: '0000',
      balances: {
        mainCredit: 14500,
        currency: 'FCFA',
        creditValidity: '31/12/2026',
        dataRemainingMB: 18840,
        dataTotalMB: 25600,
        dataExpiry: '15/09/2026',
        smsRemaining: 450,
        bonusOrange: 5000
      },
      cdrHistory: [
        {
          id: 'CDR-01',
          date: '26/08/2026 08:45',
          type: 'APPEL_SORTANT',
          destinationOrOrigin: '07 04 12 34 56 (Orange)',
          durationOrVolume: '03m 42s',
          cost: 150,
          currency: 'FCFA'
        },
        {
          id: 'CDR-02',
          date: '26/08/2026 07:12',
          type: 'DATA_INTERNET',
          destinationOrOrigin: 'Session Data 4G+ LTE',
          durationOrVolume: '450 Mo',
          cost: 0,
          currency: 'FCFA'
        }
      ]
    },
    orangeMoney: {
      accountNumber: '0708091011',
      status: 'ACTIF',
      kycLevel: 'Niveau 2 (Plafond 1 000 000 FCFA/j)',
      dailyLimit: 1000000,
      monthlyLimit: 5000000,
      currentBalance: 345800,
      savingsVaultBalance: 50000,
      currency: 'FCFA',
      isPinBlocked: false,
      transactions: [
        {
          id: 'TX-CI-2608-9842',
          date: '26/08/2026 08:30',
          type: 'Transfert d\'argent',
          label: 'Transfert vers 07 05 00 11 22 (Erreur numéro)',
          amount: 25000,
          fee: 250,
          currency: 'FCFA',
          senderName: 'Jean-Marc KOFFI',
          senderMsisdn: '0708091011',
          recipientName: 'Kouakou Didier',
          recipientMsisdn: '0705001122',
          status: 'EN_LITIGE',
          canRollback: true
        },
        {
          id: 'TX-CI-2508-8410',
          date: '25/08/2026 16:45',
          type: 'Paiement Facture',
          label: 'Règlement Facture Électricité CIE',
          amount: 38200,
          fee: 0,
          currency: 'FCFA',
          senderName: 'Jean-Marc KOFFI',
          senderMsisdn: '0708091011',
          recipientName: 'CIE Énergie CI',
          recipientMsisdn: 'CIE_BILL',
          status: 'SUCCESS',
          canRollback: false
        },
        {
          id: 'TX-CI-2408-7321',
          date: '24/08/2026 12:15',
          type: 'Dépôt Cash-In',
          label: 'Dépôt Espèces Agence Cocody',
          amount: 150000,
          fee: 0,
          currency: 'FCFA',
          senderName: 'Agence Cocody',
          senderMsisdn: 'AG_CI_02',
          recipientName: 'Jean-Marc KOFFI',
          recipientMsisdn: '0708091011',
          status: 'SUCCESS',
          canRollback: false
        }
      ]
    },
    ownershipHistory: [
      {
        id: 'OWN-01',
        ownerName: 'Jean-Marc KOFFI',
        ownerIdDocument: 'CNI C01492049182',
        ownerPhoneContact: '07 08 09 10 11',
        periodStart: '12/03/2023',
        periodEnd: 'ACTUEL',
        reason: 'Cession amiable de ligne',
        agency: 'Agence Cocody Angré',
        registeredByAgent: 'Roland KOFFI (AG-225-ABJ-042)',
        notes: 'Cession de ligne effectuée en agence avec pièces d\'identité conformes.'
      },
      {
        id: 'OWN-02',
        ownerName: 'Adjoua Marie BAMBA',
        ownerIdDocument: 'CNI C00891244019',
        ownerPhoneContact: '07 48 10 22 99',
        periodStart: '15/09/2019',
        periodEnd: '12/03/2023',
        reason: 'Changement de ligne professionnelle',
        agency: 'Agence Plateau Siège',
        registeredByAgent: 'Mamadou Touré (AG-225-ABJ-008)',
        notes: 'Ancienne utilisatrice. Ligne cédée à M. Koffi.'
      },
      {
        id: 'OWN-03',
        ownerName: 'Kouadio Yves N\'GORAN',
        ownerIdDocument: 'Attestation A-991204',
        ownerPhoneContact: '07 02 03 04 05',
        periodStart: '10/01/2016',
        periodEnd: '02/06/2019',
        reason: 'Recyclage et réattribution de numéro',
        agency: 'Agence Treichville',
        registeredByAgent: 'Patricia Yao',
        notes: 'Premier titulaire enregistré lors du lancement.'
      }
    ],
    actionAuditLogs: [
      {
        id: 'LOG-01',
        timestamp: '26/08/2026 08:31',
        category: 'ORANGE_MONEY',
        action: 'Réclamation litige transfert erroné',
        details: 'Demande d\'annulation enregistrée pour 25 000 FCFA vers 0705001122.',
        agentId: 'AG-225-ABJ-042',
        agentName: 'Roland KOFFI',
        agencyName: 'Agence Cocody Angré'
      },
      {
        id: 'LOG-02',
        timestamp: '12/03/2023 11:04',
        category: 'KYC_IDENTIFICATION',
        action: 'Cession et changement de titulaire',
        details: 'Changement de propriétaire de Adjoua Marie BAMBA vers Jean-Marc KOFFI.',
        agentId: 'AG-225-ABJ-042',
        agentName: 'Roland KOFFI',
        agencyName: 'Agence Cocody Angré'
      }
    ],
    tickets: []
  },
  {
    id: 'CUST-CI-002',
    firstName: 'Aminata',
    lastName: 'TOURÉ',
    gender: 'F',
    dateOfBirth: '22/11/1992',
    nationality: 'Ivoirienne',
    email: 'aminata.toure@orange.ci',
    address: 'Rue des Jardins, II Plateaux Vallon',
    city: 'Abidjan',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    customerSince: '18/07/2021',
    kycDocument: {
      type: 'PASSEPORT',
      number: '19CI884921',
      issuedDate: '05/04/2022',
      expiryDate: '05/04/2027',
      issuedBy: 'Direction de la Surveillance du Territoire'
    },
    telecom: {
      msisdn: '07 44 55 66 77',
      rawPhone: '0744556677',
      simType: 'ESIM',
      esimDetails: {
        eid: '89049032005008882600034821094821',
        profileStatus: 'ACTIF',
        smdpAddress: 'smdp.orange.ci',
        activationCode: 'LPA:1$smdp.orange.ci$ORANGE-CI-EID-9842',
        matchingId: 'ORANGE-CI-EID-9842',
        qrCodeGeneratedDate: '18/07/2021',
        deviceModel: 'iPhone 15 Pro Max'
      },
      simIccid: '89225 0200 7712 9031 4',
      imsi: '612010771290314',
      networkType: '4G+',
      offerName: 'Orange Forfait Pro Business',
      lineStatus: 'ACTIVE',
      activationDate: '18/07/2021',
      puk1: '92817456',
      puk2: '44102938',
      currentPin: '0000',
      balances: {
        mainCredit: 45000,
        currency: 'FCFA',
        creditValidity: 'Illimité',
        dataRemainingMB: 65000,
        dataTotalMB: 100000,
        dataExpiry: '30/09/2026',
        smsRemaining: 2000,
        bonusOrange: 15000
      },
      cdrHistory: []
    },
    orangeMoney: {
      accountNumber: '0744556677',
      status: 'BLOQUE_CODE_ERRONE',
      failedPinAttemptsCount: 3,
      freezeReason: 'Code secret bloqué suite à 3 tentatives de mot de passe erronées consécutives',
      freezeDate: '26/08/2026 07:45',
      kycLevel: 'Niveau 3 (Plafond 2 000 000 FCFA/j)',
      dailyLimit: 2000000,
      monthlyLimit: 10000000,
      currentBalance: 1250000,
      savingsVaultBalance: 300000,
      currency: 'FCFA',
      isPinBlocked: true,
      transactions: [
        {
          id: 'TX-CI-2508-8812',
          date: '25/08/2026 19:10',
          type: 'Retrait Espèces',
          label: 'Tentative de retrait bloquée - Mot de passe incorrect',
          amount: 100000,
          fee: 1000,
          currency: 'FCFA',
          senderName: 'Aminata TOURÉ',
          senderMsisdn: '0744556677',
          recipientName: 'Point de Vente OM #8841',
          recipientMsisdn: '0700112233',
          status: 'GELEE',
          canRollback: false
        }
      ]
    },
    ownershipHistory: [
      {
        id: 'OWN-T01',
        ownerName: 'Aminata TOURÉ',
        ownerIdDocument: 'Passeport 19CI884921',
        ownerPhoneContact: '07 44 55 66 77',
        periodStart: '18/07/2021',
        periodEnd: 'ACTUEL',
        reason: 'Attribution initiale',
        agency: 'Agence Marcory Zone 4',
        registeredByAgent: 'Serge Diop',
        notes: 'Titulaire unique.'
      }
    ],
    actionAuditLogs: [
      {
        id: 'LOG-T01',
        timestamp: '26/08/2026 07:45',
        category: 'SECURITE',
        action: 'Blocage automatique code secret OM',
        details: '3 tentatives USSD erronées. Déblocage requis en agence.',
        agentId: 'SYS-OM',
        agentName: 'Serveur Sécurité OM',
        agencyName: 'Plateforme Orange Money'
      }
    ],
    tickets: []
  },
  {
    id: 'CUST-CI-003',
    firstName: 'Kouassi',
    lastName: 'BROU',
    gender: 'M',
    dateOfBirth: '08/01/1979',
    nationality: 'Ivoirienne',
    email: 'kouassi.brou@orange.ci',
    address: 'Quartier Commerce, San Pedro',
    city: 'San Pedro',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    customerSince: '01/04/2015',
    kycDocument: {
      type: 'CNI',
      number: 'C00781924510',
      issuedDate: '19/08/2020',
      expiryDate: '19/08/2030',
      issuedBy: 'ONECI San Pedro'
    },
    telecom: {
      msisdn: '07 23 45 67 89',
      rawPhone: '0723456789',
      simType: 'PHYSIQUE',
      simIccid: '89225 0300 1199 4482 0',
      imsi: '612010119944820',
      networkType: '4G',
      offerName: 'Formule Prépayé Orange Tranquillité',
      lineStatus: 'ACTIVE',
      activationDate: '01/04/2015',
      puk1: '49201948',
      puk2: '88392014',
      currentPin: '0000',
      balances: {
        mainCredit: 8200,
        currency: 'FCFA',
        creditValidity: '28/02/2027',
        dataRemainingMB: 4200,
        dataTotalMB: 10240,
        dataExpiry: '12/09/2026',
        smsRemaining: 120,
        bonusOrange: 2500
      },
      cdrHistory: []
    },
    orangeMoney: {
      accountNumber: '0723456789',
      status: 'GELE_FRAUDE',
      freezeReason: 'Gel de sécurité conservatoire suite déclaration au service client',
      freezeDate: '25/08/2026 14:20',
      kycLevel: 'Niveau 2 (Plafond 1 000 000 FCFA/j)',
      dailyLimit: 1000000,
      monthlyLimit: 5000000,
      currentBalance: 785000,
      savingsVaultBalance: 120000,
      currency: 'FCFA',
      isPinBlocked: true,
      transactions: []
    },
    ownershipHistory: [
      {
        id: 'OWN-CI03',
        ownerName: 'Kouassi BROU',
        ownerIdDocument: 'CNI C00781924510',
        ownerPhoneContact: '07 23 45 67 89',
        periodStart: '01/04/2015',
        periodEnd: 'ACTUEL',
        reason: 'Attribution initiale',
        agency: 'Agence Orange San Pedro',
        registeredByAgent: 'Awa Cissé',
        notes: 'Client historique enregistré.'
      }
    ],
    actionAuditLogs: [],
    tickets: []
  },
  {
    id: 'CUST-CI-004',
    firstName: 'Adama',
    lastName: 'SANOGO',
    gender: 'M',
    dateOfBirth: '19/09/1990',
    nationality: 'Ivoirienne',
    email: 'adama.sanogo@gmail.com',
    address: 'Quartier Millionnaire, Yopougon',
    city: 'Abidjan',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    customerSince: '05/11/2018',
    kycDocument: {
      type: 'CNI',
      number: 'C03819204918',
      issuedDate: '12/10/2021',
      expiryDate: '12/10/2031',
      issuedBy: 'ONECI Yopougon'
    },
    telecom: {
      msisdn: '07 12 34 56 78',
      rawPhone: '0712345678',
      simType: 'PHYSIQUE',
      simIccid: '89225 0400 9948 1022 5',
      imsi: '612010994810225',
      networkType: '4G+',
      offerName: 'Formule Prépayé Orange Max 4G+',
      lineStatus: 'BLOQUEE_VOL',
      statusReason: 'Téléphone volé le 25/08 à Yopougon • Remplacement SIM requis',
      activationDate: '05/11/2018',
      puk1: '77412093',
      puk2: '11093842',
      currentPin: '0000',
      balances: {
        mainCredit: 5000,
        currency: 'FCFA',
        creditValidity: '31/12/2026',
        dataRemainingMB: 10240,
        dataTotalMB: 15360,
        dataExpiry: '20/09/2026',
        smsRemaining: 200,
        bonusOrange: 1000
      },
      cdrHistory: []
    },
    orangeMoney: {
      accountNumber: '0712345678',
      status: 'ACTIF',
      kycLevel: 'Niveau 2',
      dailyLimit: 1000000,
      monthlyLimit: 5000000,
      currentBalance: 85000,
      savingsVaultBalance: 0,
      currency: 'FCFA',
      isPinBlocked: false,
      transactions: []
    },
    ownershipHistory: [
      {
        id: 'OWN-CI04',
        ownerName: 'Adama SANOGO',
        ownerIdDocument: 'CNI C03819204918',
        ownerPhoneContact: '07 12 34 56 78',
        periodStart: '05/11/2018',
        periodEnd: 'ACTUEL',
        reason: 'Attribution initiale',
        agency: 'Agence Yopougon Siporex',
        registeredByAgent: 'Koffi Paul',
        notes: 'Enrôlement conforme.'
      }
    ],
    actionAuditLogs: [],
    tickets: []
  }
];
