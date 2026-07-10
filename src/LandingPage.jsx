import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addRequest } from './requestStorage';

// Service configuration array
const SERVICES_DATA = [
  { id: 'retrieve_nin', title: 'Retrieve Lost NIN', amount: 1500, description: 'Recover misplaced or forgotten NIN details with a guided lookup flow.' },
  { id: 'verify_nin', title: 'NIN Verification', amount: 1000, description: 'Validate multiple NIN records for verification and compliance needs.' },
  { id: 'fresh_child', title: 'Fresh Child Enrollment', amount: 50000, description: 'Prepare a complete application package for child enrollment support.' },
  { id: 'fresh_adult', title: 'Fresh Adult Enrollment', amount: 50000, description: 'Prepare a complete application package for adult enrollment support.' },
  { id: 'address_mod', title: 'Address Modification', amount: 12000, description: 'Submit a corrected residential address request with supporting details.' },
  { id: 'phone_mod', title: 'Phone Number Modification', amount: 12000, description: 'Update your registered GSM number on the NIN profile.' },
  { id: 'name_mod', title: 'Name Modification', amount: 12000, description: 'Submit a correction request for name changes and related details.' },
  { id: 'dob_mod', title: 'NIN DoB Modification & NPC Online Attestation', amount: 65000, description: 'Handle comprehensive date-of-birth correction and attestation support.' },
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
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all text-slate-700"
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

function FreshChildEnrollmentInputs({ formData, updateGroupField }) {
  const fields = [
    ['Surname *', 'surname'],
    ['First Name *', 'firstName'],
    ['Middle Name', 'middleName'],
    ['GSM *', 'gsm'],
    ['Email *', 'email'],
    ['Gender *', 'gender'],
    ['Full Date of Birth *', 'fullDob'],
    ['Full Contact Address *', 'contactAddress'],
    ['State of Residence *', 'stateResidence'],
    ['LGA of Residence *', 'lgaResidence'],
    ['State of Origin *', 'stateOrigin'],
    ['LGA of Origin *', 'lgaOrigin'],
    ['Parent / Guardian First Name *', 'parentFirstName'],
    ['Parent / Guardian Last Name *', 'parentLastName'],
    ['Parent / Guardian NIN *', 'parentNin'],
  ];

  return (
    <div className="space-y-4">
      {fields.map(([label, field]) => (
        <div key={field}>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
          <input
            value={formData.freshChild[field] || ''}
            onChange={(e) => updateGroupField('freshChild', field, e.target.value)}
            type={field === 'fullDob' ? 'date' : 'text'}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
          />
        </div>
      ))}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-800">
        <strong>Requirement:</strong> Attach two half-body photographs with different backgrounds and very sharp quality.
      </div>
    </div>
  );
}

function FreshAdultEnrollmentInputs({ formData, updateGroupField }) {
  const fields = [
    ['Surname *', 'surname'],
    ['First Name *', 'firstName'],
    ['Middle Name', 'middleName'],
    ['GSM *', 'gsm'],
    ['Email *', 'email'],
    ['Gender *', 'gender'],
    ['Full Date of Birth *', 'fullDob'],
    ['Full Contact Address *', 'contactAddress'],
    ['State of Residence *', 'stateResidence'],
    ['LGA of Residence *', 'lgaResidence'],
    ['State of Origin *', 'stateOrigin'],
    ['LGA of Origin *', 'lgaOrigin'],
  ];

  return (
    <div className="space-y-4">
      {fields.map(([label, field]) => (
        <div key={field}>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">{label}</label>
          <input
            value={formData.freshAdult[field] || ''}
            onChange={(e) => updateGroupField('freshAdult', field, e.target.value)}
            type={field === 'fullDob' ? 'date' : 'text'}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
          />
        </div>
      ))}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-800">
        <strong>Requirement:</strong> Attach two half-body photographs with different backgrounds and very sharp quality.
      </div>
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
    freshChild: {
      surname: '', firstName: '', middleName: '', gsm: '', email: '',
      gender: '', fullDob: '', contactAddress: '', stateResidence: '',
      lgaResidence: '', stateOrigin: '', lgaOrigin: '',
      parentFirstName: '', parentLastName: '', parentNin: '',
    },
    freshAdult: {
      surname: '', firstName: '', middleName: '', gsm: '', email: '',
      gender: '', fullDob: '', contactAddress: '', stateResidence: '',
      lgaResidence: '', stateOrigin: '', lgaOrigin: '',
    },
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

export default function LandingPage() {
  const [activeService, setActiveService] = useState(null);
  const [formData, setFormData] = useState(createInitialFormData());
  const navigate = useNavigate();

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

    if (activeService.id === 'fresh_child') {
      const values = formData.freshChild;
      const missing = [
        ['Surname', values.surname], ['First Name', values.firstName],
        ['GSM', values.gsm], ['Email', values.email], ['Gender', values.gender],
        ['Full Date of Birth', values.fullDob], ['Full Contact Address', values.contactAddress],
        ['State of residence', values.stateResidence], ['LGA of residence', values.lgaResidence],
        ['State of origin', values.stateOrigin], ['LGA of origin', values.lgaOrigin],
        ['Parent / Guardian First Name', values.parentFirstName],
        ['Parent / Guardian Last Name', values.parentLastName], ['Parent / Guardian NIN', values.parentNin],
      ].filter(([, value]) => !String(value).trim());
      if (missing.length) {
        window.alert(`Please complete the required fields: ${missing.map(([label]) => label).join(', ')}`);
        return;
      }
      addRequest({
        id: requestId,
        service: activeService.title,
        amount,
        details: { ...values, photoRequirement: 'Attach two half-body photographs with different backgrounds and very sharp quality.' },
        status: 'Awaiting payment',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receiptName: null,
      });
      navigate(`/payment?id=${requestId}`);
      return;
    }

    if (activeService.id === 'fresh_adult') {
      const values = formData.freshAdult;
      const missing = [
        ['Surname', values.surname], ['First Name', values.firstName],
        ['GSM', values.gsm], ['Email', values.email], ['Gender', values.gender],
        ['Full Date of Birth', values.fullDob], ['Full Contact Address', values.contactAddress],
        ['State of residence', values.stateResidence], ['LGA of residence', values.lgaResidence],
        ['State of origin', values.stateOrigin], ['LGA of origin', values.lgaOrigin],
      ].filter(([, value]) => !String(value).trim());
      if (missing.length) {
        window.alert(`Please complete the required fields: ${missing.map(([label]) => label).join(', ')}`);
        return;
      }
      addRequest({
        id: requestId,
        service: activeService.title,
        amount,
        details: { ...values, photoRequirement: 'Attach two half-body photographs with different backgrounds and very sharp quality.' },
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
    <div className="min-h-screen bg-slate-50/50 px-4 py-12 md:py-20 font-sans text-slate-900 antialiased">
      <div className="mx-auto max-w-5xl">
        {/* HEADER - ALWAYS VISIBLE */}
        {!activeService && (
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 border border-emerald-200/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Marthington Synergy Solutions Gateway
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
              Lost your NIN or misplaced your slip? <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">Retrieve it securely online.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Skip the long queues. Securely submit your lookup criteria, complete a manual transfer verification, and get results sent directly to your WhatsApp.
            </p>
          </header>
        )}

        {/* CONDITION 1: SERVICE GRID - Show when NO service is selected */}
        {!activeService && (
          <section className="space-y-16">
            {/* Service Cards Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-8 text-center">Select a Service</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {SERVICES_DATA.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
                    onClick={() => setActiveService(service)}
                  >
                    <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed my-3">{service.description}</p>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-sm font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg">
                        ₦{service.amount.toLocaleString()}
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
                How the processing ecosystem works
              </h2>
              <div className="grid gap-8 md:grid-cols-3">
                {[
                  { step: '01', title: 'Provide Identity Criteria', detail: 'Select your needed operation and securely fill out the matching data points.' },
                  { step: '02', title: 'Verify Escrow Remittance', detail: 'Execute a direct manual transfer directly into our corporate clearing account.' },
                  { step: '03', title: 'Instant Delivery via WhatsApp', detail: 'Our desk validates the transaction, pulls the asset record, and delivers it securely.' },
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

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white font-bold shadow-md shadow-emerald-600/10 transition-all hover:brightness-105 active:scale-[0.99]"
                >
                  Generate Processing Route (₦{activeService.amount.toLocaleString()})
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 rounded-3xl border border-slate-200/80 bg-white p-8 text-center md:text-left shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="font-black text-slate-900 tracking-tight text-lg">Marthington Synergy Solutions</p>
            <p className="mt-1 text-xs text-slate-500">Corporate Identity Clearing, Verification & Document Architecture Services.</p>
          </div>
          <div className="text-xs text-slate-600 md:text-right space-y-1">
            <p><strong>Official Liaison Support:</strong> +234 807 320 0555</p>
            <p className="text-slate-400">Secure Client Access Framework Module v2.4</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

