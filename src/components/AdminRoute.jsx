import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/registration" replace />;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = Date.now() >= payload.exp * 1000;
    const isAdminOrModerator = ['admin', 'moderator'].includes(payload.role);

    if (isExpired) {
      localStorage.removeItem('token');
      return <Navigate to="/registration" replace />;
    }

    if (!isAdminOrModerator) {
      // Просто редирект без удаления токена, чтобы не ломать сессии других ролей
      return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/registration" replace />;
  }
}
