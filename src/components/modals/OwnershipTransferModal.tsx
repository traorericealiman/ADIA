import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';

interface OwnershipTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnershipTransferModal: React.FC<OwnershipTransferModalProps> = ({ isOpen, onClose }) => {
  const { selectedCustomer, transferOwnership } = useCrm();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idType, setIdType] = useState<'CNI' | 'PASSEPORT' | 'PERMIS' | 'ATTESTATION_IDENTITE'>('CNI');
  const [idNumber, setIdNumber] = useState('C02849104921');
  const [phoneContact, setPhoneContact] = useState('');
  const [reason, setReason] = useState('Cession amiable de ligne');
  const [notes, setNotes] = useState('Formulaire de cession signé en présence du cédant et du cessionnaire.');

  if (!isOpen || !selectedCustomer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    transferOwnership(selectedCustomer.id, {
      firstName,
      lastName,
      idType,
      idNumber,
      phoneContact: phoneContact || selectedCustomer.telecom.msisdn,
      reason,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white max-w-xl w-full border-2 border-black shadow-2xl">
        
        {/* Header */}
        <div className="bg-black text-white p-5 border-b-2 border-[#ff7900] flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-tight text-white">
              Cession & Changement de Titulaire
            </h3>
            <p className="text-xs text-gray-400">
              Ligne : {selectedCustomer.telecom.msisdn}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="p-3 bg-gray-50 border border-gray-200 text-xs">
            <span className="text-gray-500 font-medium">Titulaire Actuel (Cédant) :</span>
            <div className="font-extrabold text-black text-sm">
              {selectedCustomer.firstName} {selectedCustomer.lastName} ({selectedCustomer.kycDocument.type} {selectedCustomer.kycDocument.number})
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Nouveau Titulaire (Cessionnaire)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Prénom(s) *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Amadou"
                  className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nom de Famille *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="KONE"
                  className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs uppercase outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Type de Pièce *
                </label>
                <select
                  value={idType}
                  onChange={e => setIdType(e.target.value as any)}
                  className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none bg-white"
                >
                  <option value="CNI">CNI ONECI</option>
                  <option value="PASSEPORT">Passeport Biométrique</option>
                  <option value="ATTESTATION_IDENTITE">Attestation d'Identité ONECI</option>
                  <option value="PERMIS">Permis de Conduire</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Numéro de la Pièce *
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={e => setIdNumber(e.target.value)}
                  placeholder="C02849104921"
                  className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs font-mono outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Motif de la Cession
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none bg-white"
              >
                <option value="Cession amiable entre particuliers">Cession amiable entre particuliers</option>
                <option value="Transfert professionnel vers particulier">Transfert professionnel vers particulier</option>
                <option value="Succession familiale">Succession familiale</option>
                <option value="Changement de ligne">Changement de ligne</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contact Téléphonique
              </label>
              <input
                type="text"
                value={phoneContact}
                onChange={e => setPhoneContact(e.target.value)}
                placeholder="0700000000"
                className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Observations Conseiller
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
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
              className="px-5 py-2 text-xs font-black text-black bg-[#ff7900] hover:bg-[#f16e00] uppercase tracking-wider shadow-sm"
            >
              Enregistrer la Cession
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
