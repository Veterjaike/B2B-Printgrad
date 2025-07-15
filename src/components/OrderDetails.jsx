import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './OrderDetails.module.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRespondModal, setShowRespondModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);

  const token = localStorage.getItem('token');

  // Исправленная функция для корректного декодирования base64url JWT payload
  const parseJWT = (token) => {
    if (!token) return null;
    try {
      let base64Url = token.split('.')[1];
      base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64Url.length % 4) base64Url += '=';
      const decodedPayload = atob(base64Url);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Ошибка парсинга JWT:', e);
      return null;
    }
  };

  const user = token ? parseJWT(token) : null;

  const axiosInstance = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const endpoint =
          user?.role === 'admin' || user?.role === 'moderator'
            ? `https://b2b.printgrad.ru/api/moderator/orders/${id}`
            : `https://b2b.printgrad.ru/api/orders/${id}`;
        const res = await axiosInstance.get(endpoint);
        setOrder(res.data.order);
      } catch {
        setError('Ошибка при загрузке заявки');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchOrder();
    }
  }, [id, token]);

  const handleRespond = () => {
    setShowRespondModal(true);
  };

  const handleSendResponse = async () => {
    if (!responseMessage.trim()) {
      alert('Введите сообщение');
      return;
    }
    setSendingResponse(true);
    try {
      await axiosInstance.post(`https://b2b.printgrad.ru/api/orders/${id}/respond`, {
        message: responseMessage,
      });
      alert('Отклик отправлен');
      setShowRespondModal(false);
      setResponseMessage('');
    } catch (e) {
      alert('Ошибка при отклике');
    } finally {
      setSendingResponse(false);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Заявка не найдена</p>;

  const isOwner = user?.id === order.user_id;
  const canEdit = user?.role === 'admin' || user?.role === 'moderator';
  // Кнопка "Откликнуться" видна, если роль исполнитель, пользователь не создатель и не админ/модератор
  const canRespond = user?.role === 'исполнитель' && !isOwner && !canEdit;

  return (
    <div className={styles.orderDetails_root}>
      <h1 className={styles.orderDetails_title}>Заявка #{order.id}</h1>
      <p><strong>Заголовок:</strong> {order.title}</p>
      <p><strong>Описание:</strong> {order.description}</p>
      <p><strong>Регион:</strong> {order.region}</p>
      <p><strong>Город:</strong> {order.city}</p>
      <p><strong>Бюджет:</strong> {order.budget?.toLocaleString()} ₽</p>
      <p><strong>Дедлайн:</strong> {order.deadline?.slice(0, 10)}</p>

      <div className={styles.orderDetails_buttons}>
        {canRespond && (
          <button
            className={styles.orderDetails_button}
            onClick={handleRespond}
          >
            Откликнуться
          </button>
        )}
        <button
          className={styles.orderDetails_button}
          onClick={() => navigate(-1)}
        >
          Назад
        </button>
      </div>

      {showRespondModal && (
        <div className={styles.orderDetails_modalOverlay}>
          <div className={styles.orderDetails_modalContent}>
            <h3 className={styles.orderDetails_modalTitle}>Отклик на заявку</h3>
            <textarea
              className={styles.orderDetails_modalTextarea}
              placeholder="Ваше сообщение заказчику"
              rows={4}
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              disabled={sendingResponse}
            />
            <div className={styles.orderDetails_modalButtons}>
              <button
                className={styles.orderDetails_modalButtonPrimary}
                onClick={handleSendResponse}
                disabled={sendingResponse}
              >
                {sendingResponse ? 'Отправляем...' : 'Отправить'}
              </button>
              <button
                className={styles.orderDetails_modalButtonSecondary}
                onClick={() => setShowRespondModal(false)}
                disabled={sendingResponse}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
