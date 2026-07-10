import { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';
import { getRequests, updateRequest } from './requestStorage';

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-NG', {
    hour12: true,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function flattenDetails(details) {
  if (!details || typeof details !== 'object') return '';

  return Object.entries(details)
    .map(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return `${key}:\n${flattenDetails(value)}`;
      }

      return `${key}: ${value ?? '—'}`;
    })
    .join('\n');
}

export default function RecordsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests(getRequests().reverse());
  }, []);

  const handleConfirm = (id) => {
    updateRequest(id, {
      status: 'Payment confirmed',
      updatedAt: new Date().toISOString(),
    });
    setRequests(getRequests().reverse());
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-lg shadow-slate-900/30">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Private Records Dashboard</h1>
            <p className="text-slate-400 mt-2">Admin-only access. Do not share this page publicly.</p>
          </div>
          <LogoutButton />
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
            <h2 className="text-xl font-semibold mb-3">Requests received</h2>
            <p className="text-slate-400">View user-submitted requests stored locally in your browser.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
            <h2 className="text-xl font-semibold mb-3">Payment status</h2>
            <p className="text-slate-400">Mark payments as confirmed once you verify the transfer via WhatsApp.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
            <h2 className="text-xl font-semibold mb-3">Verification details</h2>
            <p className="text-slate-400">See request time, status, and receipt note for easier claim checks.</p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-10 text-center text-slate-400">
            No requests have been submitted yet.
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={request.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{request.service}</h2>
                    <p className="mt-1 text-slate-400">{request.service} request</p>
                  </div>
                  <div className="space-y-1 text-right text-slate-400">
                    <p>Created: {formatTime(request.createdAt)}</p>
                    <p>Updated: {formatTime(request.updatedAt)}</p>
                    <p className="text-sm text-slate-300">Status: <span className="font-semibold text-white">{request.status}</span></p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-900 p-4">
                  <p className="text-slate-400 text-sm">Intake details</p>
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-white">{flattenDetails(request.details || {}) || 'No detail payload stored.'}</pre>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-900 p-4">
                  <p className="text-slate-400 text-sm">Receipt note</p>
                  <p className="mt-1 text-white">{request.receiptName ? `${request.receiptName} (receipt file name stored)` : 'No receipt attachment indicated yet.'}</p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-slate-400 text-sm">
                    <p><strong>Request ID:</strong> {request.id}</p>
                  </div>
                  <button
                    onClick={() => handleConfirm(request.id)}
                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-white font-semibold hover:bg-emerald-700"
                  >
                    Mark payment confirmed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
