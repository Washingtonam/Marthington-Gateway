import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password === 'admin1234') {
      sessionStorage.setItem('isAdmin', 'true');
      navigate('/records');
    } else {
      setError('Password is incorrect. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-lg shadow-slate-900/30">
        <h1 className="text-3xl font-bold mb-4">Admin login</h1>
        <p className="text-slate-400 mb-6">Enter the admin password to access the records dashboard.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button type="submit" className="w-full rounded-2xl bg-emerald-600 px-6 py-4 text-white font-semibold hover:bg-emerald-700">
            Access records
          </button>
        </form>
      </div>
    </div>
  );
}
