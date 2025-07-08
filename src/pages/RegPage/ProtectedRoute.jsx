import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function base64UrlDecode(str) {
  // Заменяем base64url на base64
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Добавляем паддинги, если нужно
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/registration" replace />;
  }

  // Проверяем структуру JWT
  const parts = token.split('.');
  if (parts.length !== 3) {
    localStorage.removeItem('token');
    return <Navigate to="/registration" replace />;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(parts[1]));
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
