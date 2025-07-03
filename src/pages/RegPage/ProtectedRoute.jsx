import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/registration" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= payload.exp * 1000) {
      localStorage.removeItem('token');
      return <Navigate to="/registration" replace />;
    }
  } catch (err) {
    localStorage.removeItem('token');
    return <Navigate to="/registration" replace />;
  }

  return <Outlet />;
}
