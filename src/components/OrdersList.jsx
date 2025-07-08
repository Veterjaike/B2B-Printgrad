import React from 'react';
import './OrdersList.css';
import { useNavigate } from 'react-router-dom';

const OrdersList = ({ orders }) => {
  return (
    <div className="orders-list">
      <div className="orders-list-header">
        <h2 className="orders-list-title">Список заказов</h2>
        <div className="orders-list-count">
          {orders.length} {orders.length === 1 ? 'заказ' : 'заказов'}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="orders-list-empty">Нет доступных заказов</div>
      ) : (
        <div className="orders-list-container">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const formatStatusClass = (status) => {
    if (!status) return 'status-не-указан';
    return 'status-' + status.toLowerCase().replace(/\s/g, '-').replace(/[()]/g, '');
  };

  const handleClick = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div className="order-card clickable" onClick={handleClick}>
      <div className="order-card-header">
        <h3 className="order-card-title">{order.title || 'Без названия'}</h3>
        <span className="order-card-id">№{order.id}</span>
      </div>

      <div className="order-card-details">
        <div><strong>Регион:</strong> {order.region || 'Не указан'}</div>
        <div><strong>Город:</strong> {order.city || 'Не указан'}</div>
        <div>
          <strong>Дата создания:</strong>{' '}
          {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Не указана'}
        </div>
        <div>
          <strong>Дедлайн:</strong>{' '}
          {order.deadline ? new Date(order.deadline).toLocaleDateString() : 'Не указан'}
        </div>
        <div>
          <strong>Бюджет:</strong>{' '}
          {order.budget !== undefined && order.budget !== null
            ? order.budget.toLocaleString() + ' ₽'
            : 'Не указан'}
        </div>
        <div>
          <strong>Статус:</strong>{' '}
          <span className={formatStatusClass(order.status)}>
            {order.status || 'Не указан'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
