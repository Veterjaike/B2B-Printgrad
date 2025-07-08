import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('ProtectedRoute: токен отсутствует');
    return <Navigate to="/registration" replace />;
  }

  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) {
      console.log('ProtectedRoute: неверный формат токена');
      localStorage.removeItem('token');
      return <Navigate to="/registration" replace />;
    }
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    console.log('ProtectedRoute: payload', payload);

    if (!payload.exp) {
      console.log('ProtectedRoute: в токене нет exp');
      localStorage.removeItem('token');
      return <Navigate to="/registration" replace />;
    }

    if (Date.now() >= payload.exp * 1000) {
      console.log('ProtectedRoute: токен истёк');
      localStorage.removeItem('token');
      return <Navigate to="/registration" replace />;
    }
  } catch (err) {
    console.error('ProtectedRoute: ошибка при разборе токена', err);
    localStorage.removeItem('token');
    return <Navigate to="/registration" replace />;
  }

  return <Outlet />;
}
