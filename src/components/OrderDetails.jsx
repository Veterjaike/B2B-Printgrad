import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const axiosInstance = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/moderator/orders/${id}`);
        setOrder(res.data.order);
      } catch (e) {
        setError('Ошибка при загрузке заявки');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.patch(`/api/moderator/orders/${id}`, order);
      alert('Заявка сохранена');
      navigate('/'); // вернуться на панель модератора
    } catch (e) {
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Заявка не найдена</p>;

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h1>Детали заявки #{order.id}</h1>
      <label>
        Заголовок:
        <input name="title" value={order.title || ''} onChange={handleChange} />
      </label>
      <label>
        Категория:
        <input name="category" value={order.category || ''} onChange={handleChange} />
      </label>
      <label>
        Бюджет:
        <input name="budget" value={order.budget || ''} onChange={handleChange} />
      </label>
      <label>
        Статус модерации:
        <select name="moderation_status" value={order.moderation_status || ''} onChange={handleChange}>
          <option value="pending">Ожидает</option>
          <option value="approved">Одобрена</option>
          <option value="rejected">Отклонена</option>
        </select>
      </label>
      {/* Добавь другие поля заявки по необходимости */}
      <div style={{ marginTop: 20 }}>
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Сохраняем...' : 'Сохранить'}
        </button>{' '}
        <button onClick={() => navigate(-1)}>Назад</button>
      </div>
    </div>
  );
};

export default OrderDetails;
