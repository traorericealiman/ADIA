import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose }) => {
  const { currentAgency, enrollNewCustomer } = useCrm();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [dateOfBirth, setDateOfBirth] = useState('15/08/1995');
  const [rawPhone, setRawPhone] = useState('07');
  const [simIccid, setSimIccid] = useState(`89225 0100 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} 1`);
  const [idType, setIdType] = useState<'CNI' | 'PASSEPORT' | 'PERMIS' | 'ATTESTATION_IDENTITE'>('CNI');
  const [idNumber, setIdNumber] = useState('C01948201948');
  const [address, setAddress] = useState('Cocody Angré 8e Tranche');
  const [city, setCity] = useState(currentAgency.city);
  const [offerName, setOfferName] = useState('Formule Prépayé Orange Max 4G+');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPhone = rawPhone.replace(/\D/g, '');
    const phoneFormatted = `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 4)} ${cleanPhone.slice(4, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8, 10)}`;

    enrollNewCustomer({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      rawPhone: cleanPhone,
      phoneFormatted: phoneFormatted || rawPhone,
      simIccid,
      idType,
      idNumber,
      address,
      city,
      offerName
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full border-2 border-black shadow-2xl my-8">
        
        {/* Header */}
        <div className="bg-black text-white p-5 border-b-2 border-[#ff7900] flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-tight text-white">
              Identification & Enrôlement Nouvelle Puce SIM
            </h3>
            <p className="text-xs text-gray-400">
              Agence : {currentAgency.name}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white font-bold">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="border-b border-gray-200 pb-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Numéro de Ligne & Carte SIM
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Numéro Mobile (10 chiffres) *
                </label>
                <input
                  type="text"
                  required
                  value={rawPhone}
                  onChange={e => setRawPhone(e.target.value)}
                  placeholder="0701020304"
                  className="w-full border-2 border-gray-300 focus:border-[#ff7900] p-2 text-xs font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Numéro de Série SIM (ICCID) *
                </label>
                <input
                  type="text"
                  required
                  value={simIccid}
                  onChange={e => setSimIccid(e.target.value)}
                  className="w-full border-2 border-gray-300 focus:border-[#ff7900] p-2 text-xs font-mono outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-3">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Identité du Titulaire
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Prénom(s) *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Jean-Marc"
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
                  placeholder="KOFFI"
                  className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs uppercase outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Type de Pièce d'Identité *
                </label>
                <select
                  value={idType}
                  onChange={e => setIdType(e.target.value as any)}
                  className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none bg-white"
                >
                  <option value="CNI">Carte Nationale d'Identité (CNI ONECI)</option>
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
                  placeholder="C01948201948"
                  className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Date de Naissance
                </label>
                <input
                  type="text"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  placeholder="15/08/1995"
                  className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Adresse de Résidence
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full border border-gray-300 focus:border-[#ff7900] p-2 text-xs outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
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
              Valider l'Enrôlement & Activer la SIM
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
