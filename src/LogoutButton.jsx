import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/admin-login');
  };

  return (
    <button onClick={handleLogout} className="rounded-2xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-700">
      Logout
    </button>
  );
}
