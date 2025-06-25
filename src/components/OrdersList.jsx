import React from 'react';
import './OrdersList.css';

const OrdersList = ({ orders, activeCategories }) => {
  const filteredOrders = activeCategories.length > 0
    ? orders.filter(order => activeCategories.includes(order.category))
    : orders;

  return (
    <div className="orders-list">
      <div className="orders-list-header">
        <h2 className="orders-list-title">Список заказов</h2>
        <div className="orders-list-count">
          {filteredOrders.length} из {orders.length}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="orders-list-empty">
          {activeCategories.length > 0 
            ? 'Нет заказов по выбранным фильтрам' 
            : 'Нет доступных заказов'}
        </div>
      ) : (
        <div className="orders-list-container">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ order }) => (
  <div className="order-card">
    <div className="order-card-header">
      <h3 className="order-card-title">{order.title}</h3>
      <span className="order-card-id">№{order.id}</span>
    </div>
    
    <div className="order-card-category">{order.category}</div>
    
    <div className="order-card-details">
      <div className="order-card-date">
        <span>Дата:</span>
        {new Date(order.date).toLocaleDateString()}
      </div>
      <div className="order-card-status">
        <span>Статус:</span>
        <span className={`status-${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>
      <div className="order-card-price">
        <span>Сумма:</span>
        {order.price.toLocaleString()} ₽
      </div>
    </div>
  </div>
);

export default OrdersList;