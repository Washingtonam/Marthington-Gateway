import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRequestById, updateRequest } from './requestStorage';

function renderDetailValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (Array.isArray(value)) {
    return value.map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item))).join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [receiptName, setReceiptName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestId = params.get('id');
    if (!requestId) {
      navigate('/');
      return;
    }

    const stored = getRequestById(requestId);
    if (!stored) {
      navigate('/');
      return;
    }

    setRequest(stored);
  }, [location.search, navigate]);

  const handleReceiptChange = (event) => {
    const file = event.target.files?.[0] || null;
    setReceiptName(file ? file.name : '');
  };

  const handleConfirmPayment = () => {
    if (!request) return;

    const receiptText = receiptName
      ? `\nReceipt attached: ${receiptName}`
      : '\n(Attaching receipt screenshot below)';

    const whatsappNumber = '2348073200555';
    const details = request.details || {};
    const detailLines = Object.entries(details)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}: ${renderDetailValue(value)}`);

    const intakeDetails = detailLines.length > 0 ? detailLines.join('\n') : 'No structured intake details were saved.';

    const message = `Hello Marthington Support, I have successfully executed the manual transfer for my request.\n\n[REQUEST INTAKE DETAILS]\nID: ${request.id}\nOperation: ${request.service}\nAmount Retained: ₦${request.amount?.toLocaleString() || '1,000'}\n${intakeDetails}${receiptText}\n\nPlease confirm the remittance balance and release the verification document.`;

    updateRequest(request.id, {
      status: 'Payment sent',
      updatedAt: new Date().toISOString(),
      receiptName: receiptName || null,
    });
    setRequest((prev) => prev && ({ ...prev, status: 'Payment sent', updatedAt: new Date().toISOString(), receiptName: receiptName || null }));
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Request Context Missing</h1>
          <p className="text-sm text-slate-600 mb-6">No localized session tracking data found. Please restart the request verification protocol.</p>
          <button onClick={() => navigate('/')} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
            Return to Gateway Input
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-12 font-sans text-slate-900 antialiased">
      <div className="mx-auto max-w-3xl bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="bg-slate-900 px-8 py-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Escrow Clearing Vault</span>
            <h1 className="text-2xl font-black mt-1">Manual Remittance Wire</h1>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700/60 text-xs text-slate-300">
            ID: <span className="font-mono text-white font-bold">{request.id}</span>
          </div>
        </div>

        <div className="p-8">
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Operation</span>
              <p className="mt-1.5 text-base font-bold text-slate-900">{request.service}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Processing Fee</span>
                <p className="mt-0.5 text-2xl font-black text-slate-900">₦{request.amount?.toLocaleString() || '1,000'}</p>
              </div>
              <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-1 rounded-md">Pending Verification</span>
            </div>
          </div>

          <div className="mb-6 bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Intake Summary</h3>
            <div className="space-y-2 text-sm text-slate-700">
              {Object.entries(request.details || {}).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium text-slate-800">{renderDetailValue(value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 mb-8 bg-slate-50/30">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Official Payment Allocation Account</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Beneficiary Bank</span>
                <span className="font-bold text-slate-900">OPay</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Corporate Name</span>
                <span className="font-bold text-slate-900">Marthington Synergy Solutions</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono font-black text-emerald-700 text-base tracking-wider">6104102697</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 p-6 mb-8 bg-white">
            <label className="block text-sm font-bold text-slate-900">Upload Transfer Document Receipt</label>
            <p className="text-xs text-slate-500 mt-1 mb-4">Optional context placeholder. The image stays on your local device—simply attach it inside WhatsApp during final confirmation.</p>
            
            <div className="relative border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex items-center gap-3">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleReceiptChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-sm">Choose File</span>
              <span className="text-xs text-slate-500 truncate max-w-[200px]">
                {receiptName || 'No document snapshot loaded'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleConfirmPayment} 
              className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-white font-bold text-center shadow-lg shadow-emerald-600/10 transition-all hover:bg-emerald-700 active:scale-[0.99] flex items-center justify-center gap-2"
            >
              🚀 I Have Completed the Wire Transfer
            </button>
            <p className="text-center text-[11px] text-slate-400">
              Clicking triggers an instant link routing to secure liaison support managed directly under Amedu Washington.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
