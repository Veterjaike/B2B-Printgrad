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

  // Получаем роль пользователя из токена
  const getUserRole = () => {
    const token = localStorage.getItem('token');
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

  const token = localStorage.getItem('token');
  const axiosInstance = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/orders/${id}`);
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
    if (!canEdit) return; // защита на случай, если поле вдруг активное
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.patch(`/api/orders/${id}`, order);
      alert('Заявка сохранена');
      navigate('/'); // например, вернуться на панель модератора
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

      {/* Если можно редактировать — показываем input, иначе просто текст */}
      <label>
        Заголовок:
        {canEdit ? (
          <input name="title" value={order.title || ''} onChange={handleChange} />
        ) : (
          <p>{order.title || '-'}</p>
        )}
      </label>

      <label>
        Категория:
        {canEdit ? (
          <input name="category" value={order.category || ''} onChange={handleChange} />
        ) : (
          <p>{order.category || '-'}</p>
        )}
      </label>

      <label>
        Бюджет:
        {canEdit ? (
          <input name="budget" value={order.budget || ''} onChange={handleChange} />
        ) : (
          <p>{order.budget !== undefined ? order.budget : '-'}</p>
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

      {/* Добавь остальные поля по аналогии */}

      {canEdit && (
        <div style={{ marginTop: 20 }}>
          <button onClick={handleSave} disabled={saving}>
            {saving ? 'Сохраняем...' : 'Сохранить'}
          </button>{' '}
          <button onClick={() => navigate(-1)}>Назад</button>
        </div>
      )}

      {!canEdit && (
        <div style={{ marginTop: 20 }}>
          <button onClick={() => navigate(-1)}>Назад</button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
