import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { TicketCheck, AlertCircle, X } from 'lucide-react';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose }) => {
  const { selectedCustomer, createSupportTicket, advisor } = useCrm();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'RECLAMATION_OM' | 'LIGNE_TELECOM' | 'CARTE_SIM' | 'FRAUDE' | 'FACTURATION'>('RECLAMATION_OM');
  const [priority, setPriority] = useState<'BASSE' | 'MOYENNE' | 'HAUTE' | 'URGENTE'>('HAUTE');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('Support Réclamations Orange Money');

  if (!isOpen || !selectedCustomer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSupportTicket(selectedCustomer.id, {
      subject,
      category,
      priority,
      status: 'OUVERT',
      assignedTo,
      description
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full border-2 border-black shadow-2xl">
        
        {/* Header */}
        <div className="bg-black text-white p-5 border-b-2 border-[#ff7900] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff7900] text-black flex items-center justify-center font-bold">
              <TicketCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-tight text-white">
                Ouverture Ticket Réclamation Client
              </h3>
              <p className="text-xs text-gray-400">
                Client : {selectedCustomer.firstName} {selectedCustomer.lastName} ({selectedCustomer.telecom.msisdn})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Objet de la Réclamation *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="ex: Contestation transfert erroné 25 000 FCFA"
              className="w-full border border-gray-300 focus:border-[#ff7900] p-2.5 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none bg-white"
              >
                <option value="RECLAMATION_OM">Litige Orange Money</option>
                <option value="LIGNE_TELECOM">Incident Réseau / Ligne</option>
                <option value="CARTE_SIM">Carte SIM Défectueuse / Vol</option>
                <option value="FRAUDE">Suspicion Fraude / Phishing</option>
                <option value="FACTURATION">Contestation Facture</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Niveau d'Urgence / Priorité *
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none bg-white font-bold"
              >
                <option value="URGENTE">🚨 Urgente (Traitement 2h)</option>
                <option value="HAUTE">⚡ Haute (Traitement 24h)</option>
                <option value="MOYENNE">Standard (48h)</option>
                <option value="BASSE">Basse (72h)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Service Technique Assigné
            </label>
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none bg-white"
            >
              <option value="Support Réclamations Orange Money">Support Réclamations Orange Money</option>
              <option value="Cellule Anti-Fraude & CyberDefense">Cellule Anti-Fraude & CyberDefense</option>
              <option value="Centre d'Opérations Réseau Télécom">Centre d'Opérations Réseau Télécom</option>
              <option value="Gestionnaire Commercial Agence">Gestionnaire Commercial Agence</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description Détaillée du Litige / Requête *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Précisez les circonstances de la demande et les pièces justificatives présentées par le client..."
              className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black text-black bg-[#ff7900] hover:bg-[#f16e00] uppercase tracking-wider shadow-md"
            >
              Créer & Transmettre le Ticket
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
