import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [editRequests, setEditRequests] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingEditRequests, setLoadingEditRequests] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ full_name: '', inn: '', role: '' });
  const [savingUser, setSavingUser] = useState(false);

  const token = localStorage.getItem('token');
  const axiosInstance = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  // Загрузка пользователей
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get('/api/moderator/users/pending');
      setUsers(res.data.users || []);
      setFilteredUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Фильтрация пользователей по id
  useEffect(() => {
    if (userSearch.trim() === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.id.toString().includes(userSearch.trim())
        )
      );
    }
  }, [userSearch, users]);

  // Остальной код загрузки orders и editRequests без изменений
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

  const fetchEditRequests = async () => {
    setLoadingEditRequests(true);
    try {
      const res = await axiosInstance.get('/api/moderator/orders/edit-requests');
      setEditRequests(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setEditRequests([]);
    } finally {
      setLoadingEditRequests(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchEditRequests();
  }, []);

  const approveUser = async (id) => {
    try {
      await axiosInstance.patch(`/api/moderator/users/${id}/approve`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) return;
    try {
      await axiosInstance.delete(`/api/moderator/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении пользователя');
    }
  };

  const approveOrder = async (id) => {
    try {
      await axiosInstance.patch(`/api/moderator/orders/${id}/approve`);
      fetchOrders();
      fetchEditRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name || '',
      inn: user.inn || '',
      role: user.role || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveUserChanges = async () => {
    if (!editingUser) return;
    setSavingUser(true);
    try {
      await axiosInstance.patch(`/api/moderator/users/${editingUser.id}`, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении данных пользователя');
    } finally {
      setSavingUser(false);
    }
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Панель модератора</h1>

      {/* Пользователи */}
      <section className="admin-section">
        <h2 className="admin-subtitle">Пользователи, ожидающие одобрения</h2>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="userSearch">Поиск по ID: </label>
          <input
            type="text"
            id="userSearch"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Введите ID пользователя"
          />
        </div>

        {loadingUsers ? (
          <p>Загрузка пользователей...</p>
        ) : filteredUsers.length === 0 ? (
          <p>Пользователи не найдены</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>ФИО</th>
                <th>ИНН</th>
                <th>Роль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.full_name}</td>
                  <td>{user.inn || '-'}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="approve-btn" onClick={() => approveUser(user.id)}>
                      Одобрить
                    </button>{' '}
                    <button className="edit-btn" onClick={() => openEditUser(user)}>
                      Редактировать
                    </button>{' '}
                    <button className="delete-btn" onClick={() => deleteUser(user.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Остальная часть кода (Заявки, запросы на редактирование) без изменений */}
      {/* ... */}

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
