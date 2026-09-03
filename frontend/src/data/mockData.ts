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

export const INITIAL_CUSTOMERS: Customer[] = [];
