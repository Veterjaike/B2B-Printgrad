import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Получаем токен из localStorage
  const token = localStorage.getItem('token');

  // Настраиваем axios с заголовком Authorization
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get('/api/moderator/users/pending');
      setUsers(res.data.users || []);  // защита от undefined
    } catch (err) {
      console.error(err);
      setUsers([]); // на случай ошибки
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axiosInstance.get('/api/moderator/orders/pending');
      setOrders(res.data.orders || []);  // защита от undefined
    } catch (err) {
      console.error(err);
      setOrders([]); // на случай ошибки
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
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Панель модератора</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Пользователи, ожидающие одобрения</h2>
        {loadingUsers ? (
          <p>Загрузка пользователей...</p>
        ) : !users || users.length === 0 ? (
          <p>Нет пользователей на модерации</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Email</th>
                <th className="border p-2">ФИО</th>
                <th className="border p-2">Роль</th>
                <th className="border p-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.full_name}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => approveUser(user.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Одобрить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Заявки на одобрение</h2>
        {loadingOrders ? (
          <p>Загрузка заявок...</p>
        ) : !orders || orders.length === 0 ? (
          <p>Нет заявок на модерации</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Заголовок</th>
                <th className="border p-2">Категория</th>
                <th className="border p-2">Бюджет</th>
                <th className="border p-2">Статус модерации</th>
                <th className="border p-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="border p-2">{order.title}</td>
                  <td className="border p-2">{order.category}</td>
                  <td className="border p-2">{order.budget}</td>
                  <td className="border p-2">{order.moderation_status}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => approveOrder(order.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
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
