import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import PaymentPage from './PaymentPage';
import RecordsPage from './RecordsPage';
import AuthPage from './AuthPage';
import ProtectedRoute from './ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/admin-login" element={<AuthPage />} />
        <Route path="/records" element={<ProtectedRoute><RecordsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
