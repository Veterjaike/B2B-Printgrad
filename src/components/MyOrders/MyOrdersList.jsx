import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyOrdersList.module.css';

const MyOrdersList = ({ orders }) => {
  return (
    <div className={styles.myOrdersList}>
      <div className={styles.header}>
        <h2 className={styles.title}>Мои заказы</h2>
        <div className={styles.count}>
          {orders.length} {orders.length === 1 ? 'заказ' : 'заказов'}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>У вас нет заказов</div>
      ) : (
        <div className={styles.list}>
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

  const handleClick = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{order.title || 'Без названия'}</h3>
        <span className={styles.cardId}>№{order.id}</span>
      </div>

      <div className={styles.cardDetails}>
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
          {order.budget ? Number(order.budget).toLocaleString() + ' ₽' : 'Не указан'}
        </div>
        <div>
          <strong>Статус:</strong> {order.status || 'Не указан'}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersList;
