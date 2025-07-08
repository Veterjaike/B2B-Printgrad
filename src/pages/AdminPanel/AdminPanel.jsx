import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css'; // Подключаем обычный CSS

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const token = localStorage.getItem('token');
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Панель модератора</h1>

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
                <th>Роль</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.full_name}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="approve-btn" onClick={() => approveUser(user.id)}>
                      Одобрить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

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
                    <button className="approve-btn" onClick={() => approveOrder(order.id)}>
                      Одобрить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
