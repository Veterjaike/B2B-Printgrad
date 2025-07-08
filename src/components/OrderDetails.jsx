import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderDetails.css';

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
        setError(null);
      } catch (e) {
        setError('Ошибка при загрузке заявки');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.patch(`/api/moderator/orders/${id}`, order);
      alert('Заявка сохранена');
      navigate(-1);
    } catch (e) {
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="loading">Загрузка...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p className="error">Заявка не найдена</p>;

  return (
    <div className="order-details">
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
        Описание:
        <textarea name="description" value={order.description || ''} onChange={handleChange} />
      </label>

      <label>
        Бюджет:
        <input name="budget" value={order.budget || ''} onChange={handleChange} />
      </label>

      <label>
        Дедлайн:
        <input
          type="date"
          name="deadline"
          value={order.deadline ? order.deadline.substring(0, 10) : ''}
          onChange={handleChange}
        />
      </label>

      <label>
        Регион:
        <input name="region" value={order.region || ''} onChange={handleChange} />
      </label>

      <label>
        Город:
        <input name="city" value={order.city || ''} onChange={handleChange} />
      </label>

      <label>
        Формат:
        <input name="format" value={order.format || ''} onChange={handleChange} />
      </label>

      <label>
        Тип:
        <input name="type" value={order.type || ''} onChange={handleChange} />
      </label>

      <label>
        Оплата:
        <input name="payment" value={order.payment || ''} onChange={handleChange} />
      </label>

      <label>
        Статус:
        <input name="status" value={order.status || ''} onChange={handleChange} />
      </label>

      <label>
        Статус модерации:
        <select
          name="moderation_status"
          value={order.moderation_status || ''}
          onChange={handleChange}
        >
          <option value="pending">Ожидает</option>
          <option value="approved">Одобрена</option>
          <option value="rejected">Отклонена</option>
        </select>
      </label>

      <div className="buttons">
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Сохраняем...' : 'Сохранить'}
        </button>
        <button onClick={() => navigate(-1)}>Назад</button>
      </div>
    </div>
  );
};

export default OrderDetails;
