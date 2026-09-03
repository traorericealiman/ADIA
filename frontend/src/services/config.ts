/// <reference types="vite/client" />

/**
 * Configuration Centrale de l'API Backend Orange Côte d'Ivoire
 */
export const API_BASE_URL: string = (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Endpoints réels du Backend Conseiller (sans "s" aux noms des ressources)
 */
export const API_ENDPOINTS = {
  // 1. Profil Client 360° (sans "s")
  CUSTOMER: (phoneNumber: string) => `${API_BASE_URL}/v1/customer/${encodeURIComponent(phoneNumber)}`,
  CUSTOMER_QUERY: (phoneNumber: string) => `${API_BASE_URL}/v1/customer?msisdn=${encodeURIComponent(phoneNumber)}`,

  // 2. Titulaire Actuel de la Puce (sans "s")
  TITULAIRE: (phoneNumber: string) => `${API_BASE_URL}/v1/titulaire/${encodeURIComponent(phoneNumber)}`,
  TITULAIRE_QUERY: (phoneNumber: string) => `${API_BASE_URL}/v1/titulaire?msisdn=${encodeURIComponent(phoneNumber)}`,
  TITULAIRE_SUB: (phoneNumber: string) => `${API_BASE_URL}/v1/customer/${encodeURIComponent(phoneNumber)}/titulaire`,

  // 3. Health & Root
  HEALTH: `${API_BASE_URL}/health`,
  ROOT: `${API_BASE_URL}/`,
} as const;

/**
 * Requête HTTP générique avec gestion d'erreurs et headers standard
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorDetail = `Erreur HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || errorDetail;
    } catch {
      // Pas de JSON
    }
    throw new Error(errorDetail);
  }

  return response.json();
}
