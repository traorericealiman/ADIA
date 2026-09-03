export interface Agency {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  manager: string;
}

export interface Advisor {
  id: string;
  name: string;
  email: string;
  agency: Agency;
  role: string;
  counterNumber: string;
  status: 'available' | 'in_consultation' | 'paused';
  servedTodayCount: number;
  loginTime: string;
}

export interface KycDocument {
  type: 'CNI' | 'PASSEPORT' | 'PERMIS' | 'ATTESTATION_IDENTITE';
  number: string;
  issuedDate: string;
  expiryDate: string;
  issuedBy: string;
}

export interface CDRRecord {
  id: string;
  date: string;
  type: 'APPEL_SORTANT' | 'APPEL_ENTRANT' | 'DATA_INTERNET' | 'SMS_SORTANT';
  destinationOrOrigin: string;
  durationOrVolume: string;
  cost: number;
  currency: 'FCFA';
}

export interface SIMOwnershipRecord {
  id: string;
  ownerName: string;
  ownerIdDocument: string;
  ownerPhoneContact: string;
  periodStart: string;
  periodEnd: string; // "ACTUEL" ou date
  reason: string;
  agency: string;
  registeredByAgent: string;
  notes: string;
}

export type LineStatus = 'ACTIVE' | 'SUSPENDUE' | 'BLOQUEE_VOL';

export interface ESimDetails {
  eid: string;
  profileStatus: 'ACTIF' | 'EN_ATTENTE_SCAN' | 'NON_INSTALLE';
  smdpAddress: string;
  activationCode: string;
  matchingId: string;
  qrCodeGeneratedDate: string;
  deviceModel?: string;
}

export interface CustomerTelecom {
  msisdn: string;
  rawPhone: string;
  simType: 'PHYSIQUE' | 'ESIM';
  esimDetails?: ESimDetails;
  simIccid: string;
  imsi: string;
  networkType: '4G+' | '5G' | '4G';
  offerName: string;
  lineStatus: LineStatus;
  activationDate: string;
  puk1: string;
  puk2: string;
  currentPin: string;
  statusReason?: string;
  balances: {
    mainCredit: number;
    currency: 'FCFA';
    creditValidity: string;
    dataRemainingMB: number;
    dataTotalMB: number;
    dataExpiry: string;
    smsRemaining: number;
    bonusOrange: number;
  };
  cdrHistory: CDRRecord[];
}

export type OMStatus = 'ACTIF' | 'BLOQUE_CODE_ERRONE' | 'GELE_FRAUDE' | 'BLOQUE_TEMPORAIRE';

export interface OMTransaction {
  id: string;
  date: string;
  type: string;
  label: string;
  amount: number;
  fee: number;
  currency: 'FCFA';
  senderName: string;
  senderMsisdn: string;
  recipientName: string;
  recipientMsisdn: string;
  status: 'SUCCESS' | 'ANNULEE' | 'EN_LITIGE' | 'GELEE';
  canRollback: boolean;
  cancellationReason?: string;
}

export interface CustomerOrangeMoney {
  accountNumber: string;
  status: OMStatus;
  kycLevel: string;
  dailyLimit: number;
  monthlyLimit: number;
  currentBalance: number;
  savingsVaultBalance: number;
  currency: 'FCFA';
  isPinBlocked: boolean;
  failedPinAttemptsCount?: number;
  freezeReason?: string;
  freezeDate?: string;
  transactions: OMTransaction[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  category: 'TELECOM' | 'ORANGE_MONEY' | 'KYC_IDENTIFICATION' | 'SECURITE';
  action: string;
  details: string;
  agentId: string;
  agentName: string;
  agencyName: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'URGENTE';
  status: 'OUVERT' | 'EN_COURS' | 'RESOLU';
  createdAt: string;
  assignedTo: string;
  description: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  dateOfBirth: string;
  nationality: string;
  email: string;
  address: string;
  city: string;
  avatarUrl: string;
  kycDocument: KycDocument;
  customerSince: string;
  telecom: CustomerTelecom;
  orangeMoney: CustomerOrangeMoney;
  ownershipHistory: SIMOwnershipRecord[];
  actionAuditLogs: AuditLogEntry[];
  tickets: SupportTicket[];
}

export interface AgencyReceipt {
  receiptNumber: string;
  date: string;
  agencyName: string;
  agentName: string;
  agentId: string;
  clientName: string;
  clientMsisdn: string;
  clientDocumentNumber: string;
  operationType: string;
  operationDetails: string;
  transactionReference?: string;
  amount?: number;
  currency?: 'FCFA';
  status: string;
}
