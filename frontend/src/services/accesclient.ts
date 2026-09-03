import { Customer, KycDocument, CustomerTelecom, CustomerOrangeMoney, SIMOwnershipRecord, AuditLogEntry, SupportTicket, OMTransaction, CDRRecord } from '../types/crm';
import { API_ENDPOINTS, apiRequest } from './config';

/**
 * Interface pour les données du Titulaire Actuel de la Puce
 */
export interface TitulaireActuel {
  customer_id: string;
  numero_telephone: string;
  raw_phone: string;
  statut_ligne: string;
  nom: string;
  prenoms: string;
  nom_complet: string;
  genre: 'M' | 'F';
  genre_libelle: string; // "Homme" ou "Femme"
  date_naissance: string;
  date_naissance_texte: string;
  nationalite: string;
  piece_identite: {
    type: string;
    numero: string;
    date_delivrance?: string | null;
    date_expiration?: string | null;
    emetteur?: string | null;
    affichage_complet: string;
  };
  adresse_residence: string;
  ville: string;
  email: string | null;
  client_depuis: string;
  client_depuis_texte: string;
  photo_url: string | null;
}

/**
 * Interface pour la réponse brute retournée par l'API backend /v1/customer/{phone} (snake_case)
 */
interface BackendCustomerResponse {
  id: string;
  first_name: string;
  last_name: string;
  gender: 'M' | 'F';
  date_of_birth: string;
  nationality: string;
  email: string | null;
  address: string | null;
  city: string | null;
  avatar_url: string | null;
  customer_since: string;
  kyc_document?: {
    type: 'CNI' | 'PASSEPORT' | 'PERMIS' | 'ATTESTATION_IDENTITE';
    number: string;
    issued_date: string;
    expiry_date: string;
    issued_by: string;
  } | null;
  telecom?: {
    msisdn: string;
    raw_phone: string;
    sim_type?: 'PHYSIQUE' | 'ESIM';
    sim_iccid: string;
    imsi: string;
    network_type: '4G+' | '5G' | '4G';
    offer_name: string;
    line_status: 'ACTIVE' | 'SUSPENDUE' | 'BLOQUEE_VOL';
    status_reason?: string | null;
    activation_date: string;
    puk1: string;
    puk2: string;
    current_pin: string;
    balances: {
      main_credit: number;
      currency: 'FCFA';
      credit_validity?: string | null;
      data_remaining_mb: number;
      data_total_mb: number;
      data_expiry?: string | null;
      sms_remaining: number;
      bonus_orange: number;
    };
    cdr_history?: Array<{
      id: string;
      occurred_at: string;
      type: 'APPEL_SORTANT' | 'APPEL_ENTRANT' | 'DATA_INTERNET' | 'SMS_SORTANT';
      destination_or_origin: string;
      duration_or_volume: string;
      cost: number;
      currency: 'FCFA';
    }>;
  } | null;
  orange_money?: {
    account_number: string;
    status: 'ACTIF' | 'BLOQUE_CODE_ERRONE' | 'GELE_FRAUDE' | 'BLOQUE_TEMPORAIRE';
    kyc_level: string;
    daily_limit: number;
    monthly_limit: number;
    current_balance: number;
    savings_vault_balance: number;
    currency: 'FCFA';
    is_pin_blocked: boolean;
    failed_pin_attempts_count?: number | null;
    freeze_reason?: string | null;
    freeze_date?: string | null;
    transactions?: Array<{
      id: string;
      occurred_at: string;
      type: string;
      label: string;
      amount: number;
      fee: number;
      currency: 'FCFA';
      sender_name: string;
      sender_msisdn: string;
      recipient_name: string;
      recipient_msisdn: string;
      status: 'SUCCESS' | 'ANNULEE' | 'EN_LITIGE' | 'GELEE';
      can_rollback: boolean;
      cancellation_reason?: string | null;
    }>;
  } | null;
  ownership_history?: Array<{
    id: string;
    owner_name: string;
    owner_id_document: string;
    owner_phone_contact: string;
    period_start: string;
    period_end?: string | null;
    is_current: boolean;
    reason: string;
    agency: string;
    registered_by_agent: string;
    notes?: string | null;
  }>;
  action_audit_logs?: Array<{
    id: string;
    occurred_at: string;
    category: 'TELECOM' | 'ORANGE_MONEY' | 'KYC_IDENTIFICATION' | 'SECURITE';
    action: string;
    details: string;
    agent_id: string;
    agent_name: string;
    agency_name: string;
  }>;
  tickets?: Array<{
    id: string;
    subject: string;
    category: string;
    priority: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'URGENTE';
    status: 'OUVERT' | 'EN_COURS' | 'RESOLU';
    created_at: string;
    assigned_to: string;
    description: string;
  }>;
}

/**
 * Mappe la réponse de la base de données vers le modèle Customer du frontend.
 * Quand une donnée est absente de la BD, un tiret "-" est affiché.
 */
function mapBackendToFrontendCustomer(data: BackendCustomerResponse): Customer {
  const kycDoc: KycDocument = data.kyc_document ? {
    type: data.kyc_document.type || 'CNI',
    number: data.kyc_document.number || '-',
    issuedDate: data.kyc_document.issued_date || '-',
    expiryDate: data.kyc_document.expiry_date || '-',
    issuedBy: data.kyc_document.issued_by || '-'
  } : {
    type: 'CNI',
    number: '-',
    issuedDate: '-',
    expiryDate: '-',
    issuedBy: '-'
  };

  const telecomData: CustomerTelecom = data.telecom ? {
    msisdn: data.telecom.msisdn || '-',
    rawPhone: data.telecom.raw_phone || '-',
    simType: data.telecom.sim_type || 'PHYSIQUE',
    simIccid: data.telecom.sim_iccid || '-',
    imsi: data.telecom.imsi || '-',
    networkType: data.telecom.network_type || '4G+',
    offerName: data.telecom.offer_name || '-',
    lineStatus: data.telecom.line_status || 'ACTIVE',
    activationDate: data.telecom.activation_date || '-',
    puk1: data.telecom.puk1 || '-',
    puk2: data.telecom.puk2 || '-',
    currentPin: data.telecom.current_pin || '-',
    statusReason: data.telecom.status_reason || undefined,
    balances: {
      mainCredit: data.telecom.balances?.main_credit !== undefined ? Number(data.telecom.balances.main_credit) : 0,
      currency: 'FCFA',
      creditValidity: data.telecom.balances?.credit_validity || '-',
      dataRemainingMB: data.telecom.balances?.data_remaining_mb !== undefined ? Number(data.telecom.balances.data_remaining_mb) : 0,
      dataTotalMB: data.telecom.balances?.data_total_mb !== undefined ? Number(data.telecom.balances.data_total_mb) : 0,
      dataExpiry: data.telecom.balances?.data_expiry || '-',
      smsRemaining: data.telecom.balances?.sms_remaining !== undefined ? Number(data.telecom.balances.sms_remaining) : 0,
      bonusOrange: data.telecom.balances?.bonus_orange !== undefined ? Number(data.telecom.balances.bonus_orange) : 0,
    },
    cdrHistory: Array.isArray(data.telecom.cdr_history) ? data.telecom.cdr_history.map((cdr): CDRRecord => ({
      id: cdr.id || '-',
      date: cdr.occurred_at || '-',
      type: cdr.type || 'APPEL_SORTANT',
      destinationOrOrigin: cdr.destination_or_origin || '-',
      durationOrVolume: cdr.duration_or_volume || '-',
      cost: Number(cdr.cost) || 0,
      currency: 'FCFA'
    })) : []
  } : {
    msisdn: '-',
    rawPhone: '-',
    simType: 'PHYSIQUE',
    simIccid: '-',
    imsi: '-',
    networkType: '4G+',
    offerName: '-',
    lineStatus: 'ACTIVE',
    activationDate: '-',
    puk1: '-',
    puk2: '-',
    currentPin: '-',
    balances: {
      mainCredit: 0,
      currency: 'FCFA',
      creditValidity: '-',
      dataRemainingMB: 0,
      dataTotalMB: 0,
      dataExpiry: '-',
      smsRemaining: 0,
      bonusOrange: 0
    },
    cdrHistory: []
  };

  const omData: CustomerOrangeMoney = data.orange_money ? {
    accountNumber: data.orange_money.account_number || '-',
    status: data.orange_money.status || 'ACTIF',
    kycLevel: data.orange_money.kyc_level || '-',
    dailyLimit: data.orange_money.daily_limit !== undefined ? Number(data.orange_money.daily_limit) : 0,
    monthlyLimit: data.orange_money.monthly_limit !== undefined ? Number(data.orange_money.monthly_limit) : 0,
    currentBalance: data.orange_money.current_balance !== undefined ? Number(data.orange_money.current_balance) : 0,
    savingsVaultBalance: data.orange_money.savings_vault_balance !== undefined ? Number(data.orange_money.savings_vault_balance) : 0,
    currency: 'FCFA',
    isPinBlocked: Boolean(data.orange_money.is_pin_blocked),
    failedPinAttemptsCount: data.orange_money.failed_pin_attempts_count || 0,
    freezeReason: data.orange_money.freeze_reason || undefined,
    freezeDate: data.orange_money.freeze_date || undefined,
    transactions: Array.isArray(data.orange_money.transactions) ? data.orange_money.transactions.map((tx): OMTransaction => ({
      id: tx.id || '-',
      date: tx.occurred_at || '-',
      type: tx.type || '-',
      label: tx.label || '-',
      amount: Number(tx.amount) || 0,
      fee: Number(tx.fee) || 0,
      currency: 'FCFA',
      senderName: tx.sender_name || '-',
      senderMsisdn: tx.sender_msisdn || '-',
      recipientName: tx.recipient_name || '-',
      recipientMsisdn: tx.recipient_msisdn || '-',
      status: tx.status || 'SUCCESS',
      canRollback: Boolean(tx.can_rollback),
      cancellationReason: tx.cancellation_reason || undefined
    })) : []
  } : {
    accountNumber: '-',
    status: 'ACTIF',
    kycLevel: '-',
    dailyLimit: 0,
    monthlyLimit: 0,
    currentBalance: 0,
    savingsVaultBalance: 0,
    currency: 'FCFA',
    isPinBlocked: false,
    transactions: []
  };

  const ownershipHistory: SIMOwnershipRecord[] = Array.isArray(data.ownership_history) ? data.ownership_history.map((item): SIMOwnershipRecord => ({
    id: item.id || '-',
    ownerName: item.owner_name || '-',
    ownerIdDocument: item.owner_id_document || '-',
    ownerPhoneContact: item.owner_phone_contact || '-',
    periodStart: item.period_start || '-',
    periodEnd: item.is_current ? 'ACTUEL' : (item.period_end || '-'),
    reason: item.reason || '-',
    agency: item.agency || '-',
    registeredByAgent: item.registered_by_agent || '-',
    notes: item.notes || '-'
  })) : [];

  const actionAuditLogs: AuditLogEntry[] = Array.isArray(data.action_audit_logs) ? data.action_audit_logs.map((log): AuditLogEntry => ({
    id: log.id || '-',
    timestamp: log.occurred_at || '-',
    category: log.category || 'SECURITE',
    action: log.action || '-',
    details: log.details || '-',
    agentId: log.agent_id || '-',
    agentName: log.agent_name || '-',
    agencyName: log.agency_name || '-'
  })) : [];

  const tickets: SupportTicket[] = Array.isArray(data.tickets) ? data.tickets.map((ticket): SupportTicket => ({
    id: ticket.id || '-',
    subject: ticket.subject || '-',
    category: ticket.category || '-',
    priority: ticket.priority || 'BASSE',
    status: ticket.status || 'OUVERT',
    createdAt: ticket.created_at || '-',
    assignedTo: ticket.assigned_to || '-',
    description: ticket.description || '-'
  })) : [];

  return {
    id: data.id || '-',
    firstName: data.first_name || '-',
    lastName: data.last_name || '-',
    gender: data.gender || 'M',
    dateOfBirth: data.date_of_birth || '-',
    nationality: data.nationality || '-',
    email: data.email || '-',
    address: data.address || '-',
    city: data.city || '-',
    avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    kycDocument: kycDoc,
    customerSince: data.customer_since || '-',
    telecom: telecomData,
    orangeMoney: omData,
    ownershipHistory,
    actionAuditLogs,
    tickets
  };
}

/**
 * Endpoint GET : Récupère les données du Titulaire Actuel de la Puce (GET /v1/titulaire/{phone})
 */
export async function getTitulaireActuelByPhone(phoneNumber: string): Promise<TitulaireActuel> {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  if (!cleanPhone) {
    throw new Error('Numéro de téléphone mobile manquant ou invalide.');
  }

  return await apiRequest<TitulaireActuel>(API_ENDPOINTS.TITULAIRE(cleanPhone));
}

/**
 * Endpoint GET : Récupère le profil client 360° complet via GET /v1/customer/{phone} (sans "s")
 */
export async function getClientProfileByPhone(phoneNumber: string): Promise<Customer> {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  if (!cleanPhone) {
    throw new Error('Numéro de téléphone mobile manquant ou invalide.');
  }

  const backendData = await apiRequest<BackendCustomerResponse>(API_ENDPOINTS.CUSTOMER(cleanPhone));
  if (!backendData || !backendData.id) {
    throw new Error(`Aucun client trouvé pour le numéro « ${phoneNumber} ».`);
  }

  return mapBackendToFrontendCustomer(backendData);
}

/**
 * Vérifie l'état de santé du backend (GET /health)
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(API_ENDPOINTS.HEALTH);
    return res.ok;
  } catch {
    return false;
  }
}
