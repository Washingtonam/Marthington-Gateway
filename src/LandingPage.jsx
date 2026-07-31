import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRequest } from './requestStorage';

const CONSENT_STORAGE_KEY = 'marthington-portal-consent';
const WHATSAPP_NUMBER = '2348073200555';
const OFFICE_ADDRESS = '80 Mission Road, Benin City, Edo State';
const WEBSITE_URL = 'https://xcombinator.com.ng';

// Service configuration array
const SERVICES_DATA = [
  { id: 'retrieve_nin', title: 'Find Your NIN', amount: 1000, description: 'Lost your NIN? We help you find it using your name, phone number, or date of birth.', popular: true },
  { id: 'verify_nin', title: 'Check NIN Details', amount: 1000, description: 'Verify one or more NIN numbers to confirm if they match the right person.' },
  { id: 'address_mod', title: 'Update Your Address', amount: 12000, description: 'Change your home address on your NIN record.' },
  { id: 'phone_mod', title: 'Change Your Phone Number', amount: 12000, description: 'Update the phone number connected to your NIN.' },
  { id: 'name_mod', title: 'Update Your Name', amount: 12000, description: 'Correct your name or add a middle name to your NIN.' },
  { id: 'dob_mod', title: 'Fix Your Date of Birth', amount: 65000, description: 'Correct your birth date and complete government verification.' },
  { id: 'contact_whatsapp', title: 'Chat with Our Team', amount: 2000, description: 'Not sure what you need? Chat with our agents on WhatsApp - they\'ll guide you.', badge: '💬 Consultancy' },
];

// ============================================================================
// INPUT COMPONENTS FOR EACH SERVICE
// ============================================================================

function RetrieveLostNINInputs({ formData, updateField }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">First Name *</label>
        <input
          value={formData.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
          type="text"
          placeholder="Given name"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Surname *</label>
        <input
          value={formData.surname}
          onChange={(e) => updateField('surname', e.target.value)}
          type="text"
          placeholder="Family name"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Mobile Phone Number</label>
          <input
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            type="tel"
            placeholder="e.g. 08012345678"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Date of Birth</label>
          <input
            value={formData.dob}
            onChange={(e) => updateField('dob', e.target.value)}
            type="date"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">NIN</label>
        <input
          value={formData.nin}
          onChange={(e) => updateField('nin', e.target.value)}
          type="text"
          placeholder="If you have it, enter the NIN"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Email Address</label>
        <input
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          type="email"
          placeholder="name@domain.com"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
        />
      </div>
    </div>
  );
}

function NINVerificationInputs({ formData, updateField, updateVerificationEntry, addVerificationEntry, removeVerificationEntry }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Applicant Full Name *</label>
        <input
          value={formData.applicantName}
          onChange={(e) => updateField('applicantName', e.target.value)}
          type="text"
          placeholder="Your full name (agent/applicant)"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
        />
      </div>
      <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
        <input id="consent" type="checkbox" checked={formData.consent} onChange={(e) => updateField('consent', e.target.checked)} className="h-4 w-4 rounded cursor-pointer" />
        <label htmlFor="consent" className="text-sm text-slate-600 cursor-pointer">I consent to using this platform for NIN verification and confirm the information provided is accurate.</label>
      </div>
      {formData.verificationEntries.map((entry, idx) => (
        <div key={idx} className="space-y-3 p-4 border border-slate-200 rounded-xl bg-slate-50/30">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">NIN Entry {idx + 1}</label>
          <input
            value={entry.subjectName}
            onChange={(e) => updateVerificationEntry(idx, 'subjectName', e.target.value)}
            type="text"
            placeholder="Subject name (optional)"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
          />
          <input
            value={entry.nin}
            onChange={(e) => updateVerificationEntry(idx, 'nin', e.target.value)}
            type="text"
            placeholder="NIN *"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
          />
          {formData.verificationEntries.length > 1 && (
            <button type="button" onClick={() => removeVerificationEntry(idx)} className="text-sm text-red-600 px-3 py-2 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 transition">
              Remove Entry
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addVerificationEntry} className="text-sm font-bold bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-100 transition">
        + Add More NIN Entries
      </button>
    </div>
  );
}

function AddressModificationInputs({ formData, updateGroupField }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Have you ever done modification before via NIMC Self-Service Portal? *</label>
        <select 
          value={formData.addressModification.hasDoneModificationBefore} 
          onChange={(e) => updateGroupField('addressModification', 'hasDoneModificationBefore', e.target.value)} 
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      {[
        ['NIN *', 'nin'],
        ['Last Name / Surname *', 'surname'],
        ['First Name *', 'firstName'],
        ['Middle Name', 'middleName'],
        ['GSM *', 'gsm'],
        ['Address *', 'address'],
        ['Email *', 'email'],
      ].map(([label, field]) => (
        <div key={field}>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
          <input
            value={formData.addressModification[field] || ''}
            onChange={(e) => updateGroupField('addressModification', field, e.target.value)}
            type={field === 'email' ? 'email' : 'text'}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
          />
        </div>
      ))}
    </div>
  );
}

function PhoneModificationInputs({ formData, updateGroupField }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Have you ever done modification before via NIMC Self-Service Portal? *</label>
        <select 
          value={formData.phoneModification.hasDoneModificationBefore} 
          onChange={(e) => updateGroupField('phoneModification', 'hasDoneModificationBefore', e.target.value)} 
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      {[
        ['NIN *', 'nin'],
        ['Last Name / Surname *', 'surname'],
        ['First Name *', 'firstName'],
        ['Middle Name', 'middleName'],
        ['New GSM *', 'newGsm'],
        ['Old GSM *', 'oldGsm'],
        ['Email *', 'email'],
      ].map(([label, field]) => (
        <div key={field}>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
          <input
            value={formData.phoneModification[field] || ''}
            onChange={(e) => updateGroupField('phoneModification', field, e.target.value)}
            type={field === 'email' ? 'email' : 'tel'}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
          />
        </div>
      ))}
    </div>
  );
}

function NameModificationInputs({ formData, updateGroupField }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Have you ever done modification before via NIMC Self-Service Portal? *</label>
        <select 
          value={formData.nameModification.hasDoneModificationBefore} 
          onChange={(e) => updateGroupField('nameModification', 'hasDoneModificationBefore', e.target.value)} 
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      {[
        ['NIN *', 'nin'],
        ['Last Name / Surname *', 'surname'],
        ['First Name *', 'firstName'],
        ['Middle Name', 'middleName'],
        ['Email *', 'email'],
        ['GSM *', 'gsm'],
      ].map(([label, field]) => (
        <div key={field}>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
          <input
            value={formData.nameModification[field] || ''}
            onChange={(e) => updateGroupField('nameModification', field, e.target.value)}
            type={field === 'email' ? 'email' : 'text'}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
          />
        </div>
      ))}
    </div>
  );
}

function DateOfBirthCorrectionInputs({ formData, updateGroupField }) {
  const sections = [
    {
      title: 'Personal Information',
      fields: [
        ['NIN *', 'nin'],
        ['Last Name / Surname *', 'surname'],
        ['First Name *', 'firstName'],
        ['Middle Name', 'middleName'],
        ['GSM *', 'gsm'],
        ['Email *', 'email'],
        ['New Date of Birth *', 'newDob'],
        ['Old Date of Birth *', 'oldDob'],
      ],
    },
    {
      title: 'Demographics',
      fields: [
        ['Gender *', 'gender'],
        ['Marital Status *', 'maritalStatus'],
        ['Education Level *', 'educationLevel'],
        ['Occupation *', 'occupation'],
      ],
    },
    {
      title: 'Origin Information',
      fields: [
        ['State of Origin *', 'stateOfOrigin'],
        ['LGA of Origin *', 'lgaOfOrigin'],
        ['Town/Village of Origin *', 'townVillageOfOrigin'],
      ],
    },
    {
      title: 'Birth Registration Details',
      fields: [
        ['Place of Birth *', 'placeOfBirth'],
        ['State of Birth *', 'stateOfBirth'],
        ['LGA of Birth *', 'lgaOfBirth'],
        ['Resident State (Birth Registration) *', 'residentState'],
        ['Resident LGA (Birth Registration) *', 'residentLga'],
        ['Nearest Registration Center *', 'nearestRegistrationCenter'],
      ],
    },
    {
      title: 'Residential & Work Information',
      fields: [
        ['Full House Address *', 'fullHouseAddress'],
        ['Work Address *', 'workAddress'],
      ],
    },
    {
      title: 'Father\'s Information',
      fields: [
        ['Father Surname *', 'fatherSurname'],
        ['Father First Name *', 'fatherFirstName'],
        ['Father Middle Name', 'fatherMiddleName'],
        ['Father State of Origin *', 'fatherStateOfOrigin'],
        ['Father LGA of Origin *', 'fatherLgaOfOrigin'],
        ['Father Village/Town *', 'fatherVillageTown'],
      ],
    },
    {
      title: 'Mother\'s Information',
      fields: [
        ['Mother Surname *', 'motherSurname'],
        ['Mother First Name *', 'motherFirstName'],
        ['Mother Maiden Name (Compulsory) *', 'motherMaidenName'],
        ['Mother State of Origin *', 'motherStateOfOrigin'],
        ['Mother LGA of Origin *', 'motherLgaOfOrigin'],
        ['Mother Village/Town *', 'motherVillageTown'],
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="rounded-2xl border border-slate-200 p-6 bg-slate-50/30">
          <h3 className="text-sm font-bold text-slate-900 mb-4">{section.title}</h3>
          <div className="space-y-4">
            {section.fields.map(([label, field]) => (
              <div key={field}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
                <input
                  value={formData.dobModification[field] || ''}
                  onChange={(e) => updateGroupField('dobModification', field, e.target.value)}
                  type={field.includes('Date') || field === 'newDob' || field === 'oldDob' ? 'date' : 'text'}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function createInitialFormData() {
  return {
    firstName: '',
    surname: '',
    phone: '',
    dob: '',
    nin: '',
    email: '',
    applicantName: '',
    consent: false,
    verificationEntries: [{ subjectName: '', nin: '' }],
    addressModification: {
      hasDoneModificationBefore: 'No', nin: '', surname: '', firstName: '',
      middleName: '', gsm: '', address: '', email: '',
    },
    phoneModification: {
      hasDoneModificationBefore: 'No', nin: '', surname: '', firstName: '',
      middleName: '', newGsm: '', oldGsm: '', email: '',
    },
    nameModification: {
      hasDoneModificationBefore: 'No', nin: '', surname: '', firstName: '',
      middleName: '', email: '', gsm: '',
    },
    dobModification: {
      nin: '', surname: '', firstName: '', middleName: '', gsm: '', email: '',
      newDob: '', oldDob: '', gender: '', maritalStatus: '', stateOfOrigin: '',
      lgaOfOrigin: '', townVillageOfOrigin: '', placeOfBirth: '', stateOfBirth: '',
      lgaOfBirth: '', residentState: '', residentLga: '', nearestRegistrationCenter: '',
      fullHouseAddress: '', educationLevel: '', occupation: '', workAddress: '',
      fatherSurname: '', fatherFirstName: '', fatherMiddleName: '', fatherStateOfOrigin: '',
      fatherLgaOfOrigin: '', fatherVillageTown: '', motherSurname: '', motherFirstName: '',
      motherMaidenName: '', motherStateOfOrigin: '', motherLgaOfOrigin: '', motherVillageTown: '',
    },
  };
}

// ============================================================================
// DISCLAIMER MODAL COMPONENT
// ============================================================================

function DisclaimerModal({ isOpen, onClose, activeTab, onTabChange }) {
  if (!isOpen) return null;

  const tabs = [
    { key: 'disclaimer', label: 'Disclaimer' },
    { key: 'privacy', label: 'Privacy Policy' },
    { key: 'terms', label: 'Terms & Conditions' },
  ];

  const content = {
    disclaimer: (
      <div className="space-y-5">
        <div>
          <h3 className="font-bold text-slate-900 mb-3 text-base">Who We Are</h3>
          <p>We are <strong>Marthington Synergy Solutions</strong>, a trusted company that helps with NIN services. We work with official rules and handle your information carefully.</p>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <h3 className="font-bold text-red-900 mb-2 text-base flex items-center gap-2"><span>❌</span> No Refunds After We Start</h3>
          <p className="text-red-800"><strong>Important:</strong> Once you pay and we begin working on your request, we cannot refund your money. Refunds only happen if payment fails.</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-3 text-base">Your Information Must Be True</h3>
          <p>Everything you tell us must be accurate and honest. If you give false information, we cannot help you and there are no refunds.</p>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <h3 className="font-bold text-amber-900 mb-2 text-base flex items-center gap-2"><span>⚠️</span> Not for New Registration</h3>
          <p className="text-amber-800">If you need a NEW NIN (fresh registration), go to NIMC directly or chat with us on WhatsApp. We help with changes to existing NIMs, not new ones.</p>
        </div>
      </div>
    ),
    privacy: (
      <div className="space-y-5">
        <div>
          <h3 className="font-bold text-slate-900 mb-3 text-base">What Information We Collect</h3>
          <p>We only ask for the information we need to help you with your NIN request - nothing more.</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-3 text-base">What We Collect</h3>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li>Your name and phone number</li>
            <li>Information specific to your request</li>
            <li>Payment details to process your order</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-3 text-base">How We Use Your Information</h3>
          <p>We use your information only to process your request, send you results, and keep records. We do not share your information with anyone else unless the law requires it.</p>
        </div>
      </div>
    ),
    terms: (
      <div className="space-y-5">
        <div>
          <h3 className="font-bold text-slate-900 mb-3 text-base">Using This Service</h3>
          <p>By using this website, you agree that all information you provide is correct and that you will use this service honestly.</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-3 text-base">Your Responsibilities</h3>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li>Make sure all your information is correct</li>
            <li>Be ready for follow-up questions from us</li>
            <li>Let us know if we need to contact official channels</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 mb-3 text-base">Our Limits</h3>
          <p>We help prepare and guide you, but the government (NIMC) makes the final decision. We cannot guarantee that your request will be approved.</p>
        </div>
      </div>
    ),
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 md:px-8 py-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white">Legal & Compliance Notice</h2>
          <button onClick={onClose} className="text-white hover:text-emerald-100 text-2xl leading-none">✕</button>
        </div>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition ${activeTab === tab.key ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 hover:bg-emerald-50'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 md:p-8 space-y-6 text-slate-700 text-sm md:text-base leading-relaxed">
          {content[activeTab]}
        </div>
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 md:px-8 py-4 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition">I Understand</button>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [activeService, setActiveService] = useState(null);
  const [formData, setFormData] = useState(createInitialFormData());
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [legalTab, setLegalTab] = useState('disclaimer');
  const [showConsentGate, setShowConsentGate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const consentValue = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (consentValue === 'accepted') {
      setShowConsentGate(false);
      setDisclaimerAgreed(true);
    } else {
      setShowConsentGate(true);
    }
  }, []);

  const acceptConsent = () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    setDisclaimerAgreed(true);
    setShowConsentGate(false);
  };

  const createRequestId = () => `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateGroupField = (group, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  };

  const updateVerificationEntry = (index, field, value) => {
    setFormData((prev) => {
      const nextEntries = [...prev.verificationEntries];
      nextEntries[index] = { ...nextEntries[index], [field]: value };
      return { ...prev, verificationEntries: nextEntries };
    });
  };

  const addVerificationEntry = () => {
    setFormData((prev) => ({ ...prev, verificationEntries: [...prev.verificationEntries, { subjectName: '', nin: '' }] }));
  };

  const removeVerificationEntry = (index) => {
    setFormData((prev) => ({ ...prev, verificationEntries: prev.verificationEntries.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!activeService) return;

    const requestId = createRequestId();
    const amount = activeService.amount;

    if (activeService.id === 'retrieve_nin') {
      if (!formData.firstName.trim() || !formData.surname.trim()) {
        window.alert('Please enter both first name and surname.');
        return;
      }
      if (!formData.phone.trim() && !formData.dob.trim() && !formData.nin.trim()) {
        window.alert('Please provide at least one of: phone, date of birth, or NIN.');
        return;
      }
      addRequest({
        id: requestId,
        service: activeService.title,
        amount,
        details: {
          firstName: formData.firstName.trim(),
          surname: formData.surname.trim(),
          phone: formData.phone.trim() || null,
          dob: formData.dob || null,
          nin: formData.nin.trim() || null,
          email: formData.email.trim() || null,
        },
        status: 'Awaiting payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receiptName: null,
      });
      navigate(`/payment?id=${requestId}`);
      return;
    }

    if (activeService.id === 'verify_nin') {
      if (!formData.applicantName.trim()) {
        window.alert('Please enter your full name (applicant).');
        return;
      }
      if (!formData.consent) {
        window.alert('Please consent to using this platform for NIN verification.');
        return;
      }
      const validEntries = formData.verificationEntries.filter((entry) => entry.nin.trim());
      if (validEntries.length === 0) {
        window.alert('Please add at least one NIN to verify.');
        return;
      }
      addRequest({
        id: requestId,
        service: activeService.title,
        amount: validEntries.length * amount,
        details: {
          applicantName: formData.applicantName.trim(),
          entries: validEntries.map((entry) => ({ subjectName: entry.subjectName?.trim() || null, nin: entry.nin.trim() })),
        },
        status: 'Awaiting payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receiptName: null,
      });
      navigate(`/payment?id=${requestId}`);
      return;
    }

    if (activeService.id === 'contact_whatsapp') {
      addRequest({
        id: requestId,
        service: activeService.title,
        amount,
        details: {
          consultancyType: 'General NIN enquiry and guidance',
        },
        status: 'Awaiting payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receiptName: null,
      });
      navigate(`/payment?id=${requestId}`);
      return;
    }

    if (activeService.id === 'address_mod') {
      const values = formData.addressModification;
      const missing = [
        ['NIN', values.nin], ['Last Name / Surname', values.surname],
        ['First Name', values.firstName], ['GSM', values.gsm],
        ['Address', values.address], ['Email', values.email],
      ].filter(([, value]) => !String(value).trim());
      if (missing.length) {
        window.alert(`Please complete the required fields: ${missing.map(([label]) => label).join(', ')}`);
        return;
      }
      addRequest({
        id: requestId,
        service: activeService.title,
        amount,
        details: { ...values },
        status: 'Awaiting payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receiptName: null,
      });
      navigate(`/payment?id=${requestId}`);
      return;
    }

    if (activeService.id === 'phone_mod') {
      const values = formData.phoneModification;
      const missing = [
        ['NIN', values.nin], ['Last Name / Surname', values.surname],
        ['First Name', values.firstName], ['New GSM', values.newGsm],
        ['Old GSM', values.oldGsm], ['Email', values.email],
      ].filter(([, value]) => !String(value).trim());
      if (missing.length) {
        window.alert(`Please complete the required fields: ${missing.map(([label]) => label).join(', ')}`);
        return;
      }
      addRequest({
        id: requestId,
        service: activeService.title,
        amount,
        details: { ...values },
        status: 'Awaiting payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receiptName: null,
      });
      navigate(`/payment?id=${requestId}`);
      return;
    }

    if (activeService.id === 'name_mod') {
      const values = formData.nameModification;
      const missing = [
        ['NIN', values.nin], ['Last Name / Surname', values.surname],
        ['First Name', values.firstName], ['Email', values.email],
        ['GSM', values.gsm],
      ].filter(([, value]) => !String(value).trim());
      if (missing.length) {
        window.alert(`Please complete the required fields: ${missing.map(([label]) => label).join(', ')}`);
        return;
      }
      addRequest({
        id: requestId,
        service: activeService.title,
        amount,
        details: { ...values },
        status: 'Awaiting payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receiptName: null,
      });
      navigate(`/payment?id=${requestId}`);
      return;
    }

    if (activeService.id === 'dob_mod') {
      const values = formData.dobModification;
      const missing = [
        ['NIN', values.nin], ['Last Name / Surname', values.surname],
        ['First Name', values.firstName], ['GSM', values.gsm],
        ['Email', values.email], ['New DoB', values.newDob],
        ['Gender', values.gender], ['Marital Status', values.maritalStatus],
        ['State of Origin', values.stateOfOrigin], ['LGA of Origin', values.lgaOfOrigin],
        ['Town/Village of Origin', values.townVillageOfOrigin], ['Place of Birth', values.placeOfBirth],
        ['State of Birth', values.stateOfBirth], ['LGA of Birth', values.lgaOfBirth],
        ['Resident State', values.residentState], ['Resident LGA', values.residentLga],
        ['Nearest Registration Center', values.nearestRegistrationCenter],
        ['Full House Address', values.fullHouseAddress], ['Education Level', values.educationLevel],
        ['Occupation', values.occupation], ['Work Address', values.workAddress],
        ['Old DoB', values.oldDob], ['Father Surname', values.fatherSurname],
        ['Father First Name', values.fatherFirstName], ['Mother Surname', values.motherSurname],
        ['Mother First Name', values.motherFirstName], ['Mother Maiden Name', values.motherMaidenName],
      ].filter(([, value]) => !String(value).trim());
      if (missing.length) {
        window.alert(`Please complete the required fields: ${missing.map(([label]) => label).join(', ')}`);
        return;
      }
      addRequest({
        id: requestId,
        service: activeService.title,
        amount,
        details: { ...values },
        status: 'Awaiting payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receiptName: null,
      });
      navigate(`/payment?id=${requestId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#f0fdf4_100%)] px-4 py-8 md:py-12 font-sans text-slate-900 antialiased">
      {showConsentGate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-emerald-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Welcome</div>
            <h2 className="mt-4 text-2xl font-black text-slate-900">Quick Question Before We Start</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We need to make sure you're comfortable with how we work. Please read this quickly - it'll take just 30 seconds.
            </p>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 space-y-3">
              <div className="flex gap-3">
                <div className="text-lg">✓</div>
                <div>
                  <p className="font-semibold text-slate-900">Your information is safe</p>
                  <p className="text-xs text-slate-600">We keep your details private and only use them for your request.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-lg">✓</div>
                <div>
                  <p className="font-semibold text-slate-900">No refunds after we start</p>
                  <p className="text-xs text-slate-600">Once you pay and we begin, we can't give your money back.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-lg">✓</div>
                <div>
                  <p className="font-semibold text-slate-900">You give correct information</p>
                  <p className="text-xs text-slate-600">Only send us true and accurate details.</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={acceptConsent}
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                I Understand - Continue
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="sticky top-0 z-40 mb-6 flex justify-center px-2 md:px-0">
        <a
          href="https://ds.marthington.com.ng/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-3xl rounded-full border border-emerald-200 bg-emerald-600 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700"
        >
          Agent Dashboard Login: Click here to sign in to your dashboard
        </a>
      </div>
      <div className="mx-auto max-w-5xl">
        {/* HEADER - ALWAYS VISIBLE */}
        {!activeService && (
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 border border-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Marthington Synergy Solutions Gateway
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
              Trusted NIN support for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">verification, modification, and guidance.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
              Our portal helps you request the right NIN assistance quickly, while keeping you aligned with NIMC guidance. For fresh registration enquiries, our team is available directly on WhatsApp to guide you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'm not sure what service I need. Can you help me?`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                💬 Chat First (No Charge)
              </a>
              <a
                href="https://ds.marthington.com.ng/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-6 py-3.5 text-sm font-bold text-emerald-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50"
              >
                Agent Portal
              </a>
            </div>
          </header>
        )}

        {/* CONDITION 1: SERVICE GRID - Show when NO service is selected */}
        {!activeService && (
          <section className="space-y-16">
            {/* Social Proof Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 p-8 md:p-10">
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-emerald-600">5,200+</p>
                  <p className="text-sm text-slate-600 mt-2">Successful Services Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-emerald-600">98%</p>
                  <p className="text-sm text-slate-600 mt-2">Customer Satisfaction Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-emerald-600">24 hrs</p>
                  <p className="text-sm text-slate-600 mt-2">Average Delivery Time</p>
                </div>
              </div>
              
              <div className="border-t border-emerald-200 pt-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700 mb-6 text-center">What People Say</p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200">
                    <div className="flex gap-1 mb-3">
                      <span className="text-lg">⭐</span><span className="text-lg">⭐</span><span className="text-lg">⭐</span><span className="text-lg">⭐</span><span className="text-lg">⭐</span>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">"I lost my NIN and thought it was gone forever. They found it in 2 hours using just my name!"</p>
                    <p className="text-xs font-bold text-slate-900">Chioma O. - Lagos</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-200">
                    <div className="flex gap-1 mb-3">
                      <span className="text-lg">⭐</span><span className="text-lg">⭐</span><span className="text-lg">⭐</span><span className="text-lg">⭐</span><span className="text-lg">⭐</span>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">"The process was so simple. I updated my address without any stress. Highly recommended!"</p>
                    <p className="text-xs font-bold text-slate-900">Tunde A. - Abuja</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-200">
                    <div className="flex gap-1 mb-3">
                      <span className="text-lg">⭐</span><span className="text-lg">⭐</span><span className="text-lg">⭐</span><span className="text-lg">⭐</span><span className="text-lg">⭐</span>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">"The team on WhatsApp was so helpful. They explained everything clearly. Thank you!"</p>
                    <p className="text-xs font-bold text-slate-900">Blessing U. - Port Harcourt</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-8 flex flex-col gap-3 text-center md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">Quick & Easy</p>
                  <h2 className="text-2xl font-bold text-slate-900">Choose what you need</h2>
                </div>
                <p className="text-sm text-slate-600">Not sure? Chat with our team first - no cost, no pressure.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {SERVICES_DATA.map((service) => (
                  <div
                    key={service.id}
                    className={`rounded-3xl border p-6 shadow-sm transition-all cursor-pointer relative ${service.id === 'contact_whatsapp' ? 'border-blue-200 bg-blue-50/70 hover:border-blue-300 hover:shadow-md md:col-span-2 xl:col-span-1' : 'border-slate-200/80 bg-white hover:border-emerald-300 hover:shadow-md'} ${service.popular ? 'ring-2 ring-emerald-400' : ''}`}
                    onClick={() => setActiveService(service)}
                  >
                    {service.popular && (
                      <div className="absolute -top-3 left-6 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ⭐ Most Popular
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed my-3">{service.description}</p>
                    <div className="flex items-center justify-between pt-4">
                      <span className={`text-sm font-bold px-3 py-1 rounded-lg ${service.amount ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                        {service.amount ? `₦${service.amount.toLocaleString()}` : service.badge || 'Free'}
                      </span>
                      <button className="text-emerald-600 font-bold hover:text-emerald-700">→</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works Section */}
            <section className="mb-16 bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8 flex items-center gap-3">
                <span className="h-6 w-1 bg-emerald-600 rounded-full"></span>
                How It Works (3 Simple Steps)
              </h2>
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  { step: '01', title: 'Fill Your Information', detail: 'Tell us who you are and what you need. Takes just 5 minutes.' },
                  { step: '02', title: 'Make Payment', detail: 'Send money to our account. We confirm it automatically.' },
                  { step: '03', title: 'Get Your Result', detail: 'We send your result via WhatsApp in 24 hours or less.' },
                ].map((item) => (
                  <div key={item.step} className="relative group">
                    <span className="text-4xl font-black text-slate-100 transition-colors group-hover:text-emerald-50/70 block mb-2">{item.step}</span>
                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </section>
        )}

        {/* CONDITION 2: SERVICE FORM - Show when a service IS selected */}
        {activeService && (
          <section className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-10 shadow-sm">
            {/* Back Button */}
            <button
              onClick={() => {
                setActiveService(null);
                setFormData(createInitialFormData());
                setDisclaimerAgreed(false);
              }}
              className="text-slate-600 hover:text-slate-900 mb-6 flex items-center gap-2 font-bold transition"
            >
              ← Back to Services
            </button>

            {/* Form Header */}
            <div className="mb-8 pb-6 border-b border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{activeService.title}</h2>
              <p className="text-sm text-slate-500">Service Fee: <span className="font-bold text-emerald-600">₦{activeService.amount.toLocaleString()}</span></p>
            </div>

            {/* Form */}
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {activeService.id === 'retrieve_nin' && (
                <RetrieveLostNINInputs formData={formData} updateField={updateField} />
              )}

              {activeService.id === 'verify_nin' && (
                <NINVerificationInputs
                  formData={formData}
                  updateField={updateField}
                  updateVerificationEntry={updateVerificationEntry}
                  addVerificationEntry={addVerificationEntry}
                  removeVerificationEntry={removeVerificationEntry}
                />
              )}

              {activeService.id === 'fresh_child' && (
                <FreshChildEnrollmentInputs formData={formData} updateGroupField={updateGroupField} />
              )}

              {activeService.id === 'fresh_adult' && (
                <FreshAdultEnrollmentInputs formData={formData} updateGroupField={updateGroupField} />
              )}

              {activeService.id === 'address_mod' && (
                <AddressModificationInputs formData={formData} updateGroupField={updateGroupField} />
              )}

              {activeService.id === 'phone_mod' && (
                <PhoneModificationInputs formData={formData} updateGroupField={updateGroupField} />
              )}

              {activeService.id === 'name_mod' && (
                <NameModificationInputs formData={formData} updateGroupField={updateGroupField} />
              )}

              {activeService.id === 'dob_mod' && (
                <DateOfBirthCorrectionInputs formData={formData} updateGroupField={updateGroupField} />
              )}

              {/* Disclaimer Checkbox */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <input
                    id="disclaimerCheckbox"
                    type="checkbox"
                    checked={disclaimerAgreed}
                    onChange={(e) => setDisclaimerAgreed(e.target.checked)}
                    className="h-5 w-5 rounded cursor-pointer mt-0.5 flex-shrink-0 accent-emerald-600"
                  />
                  <div className="flex-1">
                    <label htmlFor="disclaimerCheckbox" className="cursor-pointer">
                      <span className="block text-sm font-bold text-slate-900 mb-1">
                        I Agree to the Terms (No Refunds After We Start)
                      </span>
                      <span className="text-xs text-slate-600">
                        I confirm my information is correct and I understand we cannot refund money once work begins.
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowDisclaimerModal(true)}
                      className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition"
                    >
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-700">
                        ℹ
                      </span>
                      View Full Disclaimer
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!disclaimerAgreed}
                  className={`w-full rounded-xl px-6 py-4 text-white font-bold shadow-md transition-all ${
                    disclaimerAgreed
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/10 hover:brightness-105 active:scale-[0.99] cursor-pointer'
                      : 'bg-slate-300 shadow-none cursor-not-allowed opacity-60'
                  }`}
                >
                  {disclaimerAgreed ? `Continue to Payment (₦${activeService.amount.toLocaleString()})` : 'I Agree - Continue'}
                </button>
              </div>
            </form>

            {/* Disclaimer Modal */}
            <DisclaimerModal isOpen={showDisclaimerModal} onClose={() => setShowDisclaimerModal(false)} activeTab={legalTab} onTabChange={setLegalTab} />
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-sm md:text-left">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="font-black text-slate-900 tracking-tight text-lg">Marthington Synergy Solutions</p>
              <p className="mt-2 text-sm text-slate-600">Corporate identity, verification, and document support services for NIN-related assistance.</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Office address:</span> {OFFICE_ADDRESS}</p>
                <p><span className="font-semibold text-slate-900">Website:</span> <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">{WEBSITE_URL}</a></p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Important notices</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => { setLegalTab('disclaimer'); setShowDisclaimerModal(true); }} className="rounded-full border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">Terms & Disclaimer</button>
                <button type="button" onClick={() => { setLegalTab('privacy'); setShowDisclaimerModal(true); }} className="rounded-full border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">Privacy Policy</button>
                <button type="button" onClick={() => { setLegalTab('terms'); setShowDisclaimerModal(true); }} className="rounded-full border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">Terms & Conditions</button>
              </div>
              <a
                href="https://ds.marthington.com.ng/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Agent Dashboard Login →
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

