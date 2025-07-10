import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderDetails.css';

const categories = [
  'Серверы и серверные ОС',
  'Автоматизированные рабочие места и программное обеспечение',
  'Сетевая инфраструктура',
  'Оргтехника',
  'Контрольно-кассовая техника',
  'Весовое оборудование (включая поверку)',
  'Торговое оборудование',
  'Система видеонаблюдения',
  'Системы мониторинга',
];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [editRequestComment, setEditRequestComment] = useState('');
  const [sendingEditRequest, setSendingEditRequest] = useState(false);
  const [editRequestSent, setEditRequestSent] = useState(false);

  const [showRespondModal, setShowRespondModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);

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

  const getUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const userRole = getUserRole();
  const userId = getUserId();

  const canEdit = userRole === 'admin' || userRole === 'moderator';
  const canRespond = userRole === 'исполнитель';
  const isOwner = order?.user_id === userId;

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
        if (res.data.order.edit_request) {
          setEditRequestSent(true);
          setEditRequestComment(res.data.order.edit_reason || '');
        }
      } catch {
        setError('Ошибка при загрузке заявки');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

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
      navigate('/admin');
    } catch (e) {
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

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
      await axiosInstance.post(`/api/orders/${id}/respond`, { message: responseMessage });
      alert('Отклик отправлен');
      setShowRespondModal(false);
      setResponseMessage('');
    } catch (e) {
      alert('Ошибка при отклике');
    } finally {
      setSendingResponse(false);
    }
  };

  const handleSendEditRequest = async () => {
    if (!editRequestComment.trim()) return;
    setSendingEditRequest(true);
    try {
      await axiosInstance.post(`/api/orders/${id}/request-edit`, { edit_reason: editRequestComment });
      alert('Запрос на редактирование отправлен модератору');
      setEditRequestSent(true);
    } catch (e) {
      alert('Ошибка при отправке запроса');
    } finally {
      setSendingEditRequest(false);
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Заявка не найдена</p>;

  const RespondModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Откликнуться на заявку</h3>
        <textarea
          rows={4}
          placeholder="Введите сопроводительное сообщение"
          value={responseMessage}
          onChange={(e) => setResponseMessage(e.target.value)}
          disabled={sendingResponse}
        />
        <div className="modal-buttons">
          <button onClick={handleSendResponse} disabled={sendingResponse}>
            {sendingResponse ? 'Отправляем...' : 'Отправить'}
          </button>
          <button onClick={() => setShowRespondModal(false)} disabled={sendingResponse}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="order-details-container">
      <h1>Заявка #{order.id}</h1>

      {/* Заголовок */}
      <div className="order-details-card">
        <div className="order-details-label">Заголовок</div>
        {canEdit ? (
          <input
            type="text"
            name="title"
            value={order.title || ''}
            onChange={handleChange}
          />
        ) : (
          <div className="order-details-value">{order.title || '-'}</div>
        )}
      </div>

      {/* Бюджет */}
      <div className="order-details-card">
        <div className="order-details-label">Бюджет</div>
        {canEdit ? (
          <input
            type="number"
            name="budget"
            value={order.budget || ''}
            onChange={handleChange}
          />
        ) : (
          <div className="order-details-budget">
            {order.budget ? `${order.budget} ₽` : '-'}
          </div>
        )}
      </div>

      {/* Описание */}
      <div className="order-details-card">
        <div className="order-details-label">Описание</div>
        {canEdit ? (
          <textarea
            name="description"
            rows={6}
            value={order.description || ''}
            onChange={handleChange}
          />
        ) : (
          <div className="description-block">{order.description || '-'}</div>
        )}
      </div>

      {/* Запрос на редактирование (только если заказчик и еще не отправлен) */}
      {isOwner && !editRequestSent && (
        <div className="order-details-card">
          <div className="order-details-label" style={{ marginBottom: 8 }}>
            Запросить редактирование заявки
          </div>
          <textarea
            rows={3}
            placeholder="Комментарий к запросу"
            value={editRequestComment}
            onChange={(e) => setEditRequestComment(e.target.value)}
            disabled={sendingEditRequest}
          />
          <button
            onClick={handleSendEditRequest}
            disabled={sendingEditRequest || !editRequestComment.trim()}
            style={{ marginTop: 10 }}
          >
            {sendingEditRequest ? 'Отправляем...' : 'Отправить запрос'}
          </button>
        </div>
      )}

      {/* Информация о том, что запрос отправлен */}
      {editRequestSent && (
        <div
          className="order-details-card"
          style={{
            border: '2px solid #27ae60',
            backgroundColor: '#e6ffed',
            color: '#155724',
            fontWeight: '600',
            fontSize: '1rem',
          }}
        >
          Запрос на редактирование отправлен.<br />
          Комментарий: {editRequestComment}
        </div>
      )}

      {/* Кнопки управления */}
      <div className="order-details-buttons">
        {canEdit && (
          <>
            <button onClick={handleSave} disabled={saving}>
              {saving ? 'Сохраняем...' : 'Сохранить'}
            </button>
            <button onClick={() => navigate(-1)}>Закрыть</button>
          </>
        )}

        {!canEdit && canRespond && (
          <>
            <button onClick={handleRespond} disabled={sendingResponse}>
              Откликнуться
            </button>
            <button onClick={() => navigate(-1)}>Закрыть</button>
          </>
        )}

        {!canEdit && !canRespond && (
          <button onClick={() => navigate(-1)}>Закрыть</button>
        )}
      </div>

      {/* Модалка отклика */}
      {showRespondModal && <RespondModal />}
    </div>
  );
};

export default OrderDetails;
