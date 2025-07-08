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

  const getUserRole = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  const userRole = getUserRole();
  const canEdit = userRole === 'admin' || userRole === 'moderator';
  const canRespond = userRole === 'исполнитель';

  const axiosInstance = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const endpoint = canEdit
          ? `/api/moderator/orders/${id}`
          : `/api/orders/${id}`;
        const res = await axiosInstance.get(endpoint);
        setOrder(res.data.order);
      } catch (e) {
        setError('Ошибка при загрузке заявки');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, canEdit]);

  const handleChange = (e) => {
    if (!canEdit) return;
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.patch(`/api/moderator/orders/${id}`, order);
      alert('Заявка сохранена');
      navigate('/admin'); // вернуться в панель
    } catch (e) {
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const handleRespond = async () => {
    try {
      await axiosInstance.post(`/api/orders/${id}/respond`);
      alert('Отклик отправлен');
    } catch (e) {
      alert('Ошибка при отклике');
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Заявка не найдена</p>;

  return (
    <div className="order-details-container">
      <h1>Заявка #{order.id}</h1>

      <div className="order-details-grid">
        <label>
          Заголовок:
          {canEdit ? (
            <input
              type="text"
              name="title"
              value={order.title || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{order.title || '-'}</p>
          )}
        </label>

        <label>
          Категория:
          {canEdit ? (
            <input
              type="text"
              name="category"
              value={order.category || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{order.category || '-'}</p>
          )}
        </label>

        <label>
          Бюджет:
          {canEdit ? (
            <input
              type="number"
              name="budget"
              value={order.budget || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{order.budget !== undefined ? order.budget + ' ₽' : '-'}</p>
          )}
        </label>

        <label>
          Статус модерации:
          {canEdit ? (
            <select
              name="moderation_status"
              value={order.moderation_status || ''}
              onChange={handleChange}
            >
              <option value="pending">Ожидает</option>
              <option value="approved">Одобрена</option>
              <option value="rejected">Отклонена</option>
            </select>
          ) : (
            <p>{order.moderation_status || '-'}</p>
          )}
        </label>

        <label>
          Описание:
          {canEdit ? (
            <textarea
              name="description"
              value={order.description || ''}
              onChange={handleChange}
              className="full-width"
              rows={4}
            />
          ) : (
            <p className="full-width">{order.description || '-'}</p>
          )}
        </label>

        <label>
          Дедлайн:
          {canEdit ? (
            <input
              type="date"
              name="deadline"
              value={order.deadline ? order.deadline.slice(0, 10) : ''}
              onChange={handleChange}
            />
          ) : (
            <p>{order.deadline ? new Date(order.deadline).toLocaleDateString() : '-'}</p>
          )}
        </label>

        <label>
          Регион:
          {canEdit ? (
            <input
              type="text"
              name="region"
              value={order.region || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{order.region || '-'}</p>
          )}
        </label>

        <label>
          Город:
          {canEdit ? (
            <input
              type="text"
              name="city"
              value={order.city || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{order.city || '-'}</p>
          )}
        </label>

        <label>
          Формат:
          {canEdit ? (
            <input
              type="text"
              name="format"
              value={order.format || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{order.format || '-'}</p>
          )}
        </label>

        <label>
          Тип:
          {canEdit ? (
            <input
              type="text"
              name="type"
              value={order.type || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{order.type || '-'}</p>
          )}
        </label>

        <label>
          Оплата:
          {canEdit ? (
            <input
              type="text"
              name="payment"
              value={order.payment || ''}
              onChange={handleChange}
            />
          ) : (
            <p>{order.payment || '-'}</p>
          )}
        </label>
      </div>

      <div className="order-details-buttons">
        {canEdit && (
          <>
            <button onClick={handleSave} disabled={saving}>
              {saving ? 'Сохраняем...' : 'Сохранить'}
            </button>{' '}
            <button onClick={() => navigate(-1)}>Закрыть</button>
          </>
        )}

        {!canEdit && canRespond && (
          <>
            <button onClick={handleRespond}>Откликнуться</button>{' '}
            <button onClick={() => navigate(-1)}>Закрыть</button>
          </>
        )}

        {!canEdit && !canRespond && (
          <button onClick={() => navigate(-1)}>Закрыть</button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
