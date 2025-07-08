import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Для редактирования пользователя
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ full_name: '', inn: '', role: '' });
  const [savingUser, setSavingUser] = useState(false);

  const token = localStorage.getItem('token');
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Загрузка пользователей
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get('/api/moderator/users/pending');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Загрузка заявок
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axiosInstance.get('/api/moderator/orders/pending');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, []);

  const approveUser = async (id) => {
    try {
      await axiosInstance.patch(`/api/moderator/users/${id}/approve`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const approveOrder = async (id) => {
    try {
      await axiosInstance.patch(`/api/moderator/orders/${id}/approve`);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // Открыть модалку редактирования с данными пользователя
  const openEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name || '',
      inn: user.inn || '',
      role: user.role || '',
    });
  };

  // Обработка изменений в форме редактирования
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Сохранение изменений пользователя
  const saveUserChanges = async () => {
    if (!editingUser) return;
    setSavingUser(true);
    try {
      const res = await axiosInstance.patch(`/api/moderator/users/${editingUser.id}`, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении данных пользователя');
    } finally {
      setSavingUser(false);
    }
  };

  // Закрыть модальное окно
  const closeEditModal = () => {
    setEditingUser(null);
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Панель модератора</h1>

      {/* Пользователи */}
      <section className="admin-section">
        <h2 className="admin-subtitle">Пользователи, ожидающие одобрения</h2>
        {loadingUsers ? (
          <p>Загрузка пользователей...</p>
        ) : users.length === 0 ? (
          <p>Нет пользователей на модерации</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>ФИО</th>
                <th>ИНН</th>
                <th>Роль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.full_name}</td>
                  <td>{user.inn || '-'}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="approve-btn" onClick={() => approveUser(user.id)}>Одобрить</button>{' '}
                    <button className="edit-btn" onClick={() => openEditUser(user)}>Редактировать</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Заявки */}
      <section className="admin-section">
        <h2 className="admin-subtitle">Заявки на одобрение</h2>
        {loadingOrders ? (
          <p>Загрузка заявок...</p>
        ) : orders.length === 0 ? (
          <p>Нет заявок на модерации</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Заголовок</th>
                <th>Категория</th>
                <th>Бюджет</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.title}</td>
                  <td>{order.category}</td>
                  <td>{order.budget}</td>
                  <td>{order.moderation_status}</td>
                  <td>
                    <button
                      className="approve-btn"
                      onClick={() => approveOrder(order.id)}
                    >
                      Одобрить
                    </button>{' '}
                    <button
                      className="edit-btn"
                      onClick={() => window.location.href = `/orders/${order.id}`}
                    >
                      Подробнее/редактировать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Модальное окно редактирования пользователя */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Редактировать пользователя</h3>
            <label>
              ФИО:
              <input
                name="full_name"
                value={editForm.full_name}
                onChange={handleEditChange}
              />
            </label>
            <label>
              ИНН:
              <input
                name="inn"
                value={editForm.inn}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Роль:
              <select name="role" value={editForm.role} onChange={handleEditChange}>
                <option value="заказчик">Заказчик</option>
                <option value="исполнитель">Исполнитель</option>
                <option value="moderator">Модератор</option>
                <option value="admin">Администратор</option>
              </select>
            </label>
            <div className="modal-buttons">
              <button onClick={saveUserChanges} disabled={savingUser}>
                {savingUser ? 'Сохраняем...' : 'Сохранить'}
              </button>
              <button onClick={closeEditModal}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
