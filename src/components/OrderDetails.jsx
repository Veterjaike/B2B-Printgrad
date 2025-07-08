import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./OrderDetails.css"
import axios from 'axios';

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
      navigate(-1);
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

  // Форматируем дату
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : '-';

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#fff' }}>
      <h1>Заявка #{order.id}</h1>

      {/* Поля заявки */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Заголовок */}
        <label>
          Заголовок:
          {canEdit ? (
            <input
              type="text"
              name="title"
              value={order.title || ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{order.title || '-'}</p>
          )}
        </label>

        {/* Категория */}
        <label>
          Категория:
          {canEdit ? (
            <input
              type="text"
              name="category"
              value={order.category || ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{order.category || '-'}</p>
          )}
        </label>

        {/* Описание */}
        <label style={{ gridColumn: '1 / -1' }}>
          Описание:
          {canEdit ? (
            <textarea
              name="description"
              value={order.description || ''}
              onChange={handleChange}
              rows={4}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{order.description || '-'}</p>
          )}
        </label>

        {/* Бюджет */}
        <label>
          Бюджет:
          {canEdit ? (
            <input
              type="number"
              name="budget"
              value={order.budget || ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{order.budget !== undefined ? order.budget + ' ₽' : '-'}</p>
          )}
        </label>

        {/* Дедлайн */}
        <label>
          Дедлайн:
          {canEdit ? (
            <input
              type="date"
              name="deadline"
              value={order.deadline ? order.deadline.split('T')[0] : ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{formatDate(order.deadline)}</p>
          )}
        </label>

        {/* Регион */}
        <label>
          Регион:
          {canEdit ? (
            <input
              type="text"
              name="region"
              value={order.region || ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{order.region || '-'}</p>
          )}
        </label>

        {/* Город */}
        <label>
          Город:
          {canEdit ? (
            <input
              type="text"
              name="city"
              value={order.city || ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{order.city || '-'}</p>
          )}
        </label>

        {/* Формат */}
        <label>
          Формат:
          {canEdit ? (
            <input
              type="text"
              name="format"
              value={order.format || ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{order.format || '-'}</p>
          )}
        </label>

        {/* Тип */}
        <label>
          Тип:
          {canEdit ? (
            <input
              type="text"
              name="type"
              value={order.type || ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{order.type || '-'}</p>
          )}
        </label>

        {/* Оплата */}
        <label>
          Оплата:
          {canEdit ? (
            <input
              type="text"
              name="payment"
              value={order.payment || ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{order.payment || '-'}</p>
          )}
        </label>

        {/* Статус */}
        <label>
          Статус заявки:
          {canEdit ? (
            <input
              type="text"
              name="status"
              value={order.status || ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          ) : (
            <p>{order.status || '-'}</p>
          )}
        </label>

        {/* Статус модерации */}
        <label>
          Статус модерации:
          {canEdit ? (
            <select
              name="moderation_status"
              value={order.moderation_status || ''}
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              <option value="pending">Ожидает</option>
              <option value="approved">Одобрена</option>
              <option value="rejected">Отклонена</option>
            </select>
          ) : (
            <p>{order.moderation_status || '-'}</p>
          )}
        </label>
      </div>

      {/* Кнопки управления */}
      <div style={{ marginTop: 30 }}>
        {canEdit && (
          <button onClick={handleSave} disabled={saving} style={{ marginRight: 10 }}>
            {saving ? 'Сохраняем...' : 'Сохранить'}
          </button>
        )}

        {canRespond && !canEdit && (
          <button onClick={handleRespond} style={{ marginRight: 10 }}>
            Откликнуться
          </button>
        )}

        <button onClick={() => navigate(-1)}>Закрыть</button>
      </div>
    </div>
  );
};

export default OrderDetails;
