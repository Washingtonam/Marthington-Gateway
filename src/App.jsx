import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import PaymentPage from './PaymentPage';
import RecordsPage from './RecordsPage';
import AuthPage from './AuthPage';
import ProtectedRoute from './ProtectedRoute';
import LegalPage from './LegalPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/nin-services" element={<LandingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/admin-login" element={<AuthPage />} />
        <Route path="/records" element={<ProtectedRoute><RecordsPage /></ProtectedRoute>} />
        <Route path="/disclaimer" element={<LegalPage page="disclaimer" />} />
        <Route path="/privacy-policy" element={<LegalPage page="privacy" />} />
        <Route path="/terms-and-conditions" element={<LegalPage page="terms" />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
