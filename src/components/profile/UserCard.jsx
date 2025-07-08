import React from 'react';
import './UserCard.css';
import { useNavigate } from 'react-router-dom';

export default function UserCard({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/registration');
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  if (!user) return <p>Нет данных пользователя</p>;

  const isAdminOrModerator = user.role === 'admin' || user.role === 'moderator';

  return (
    <div className="user-card">
      <h3>Профиль пользователя</h3>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Имя:</strong> {user.full_name || 'Не указано'}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>ИНН:</strong> {user.inn || 'Не указан'}</p>
      <p><strong>Роль:</strong> {user.role || 'Не указана'}</p>
      
      <div className="buttons-row">
        <button className="logout-btn" onClick={handleLogout}>
          Выйти
        </button>

        {isAdminOrModerator && (
          <button className="admin-panel-btn" onClick={handleAdminPanel}>
            Админ панель
          </button>
        )}
      </div>
    </div>
  );
}
