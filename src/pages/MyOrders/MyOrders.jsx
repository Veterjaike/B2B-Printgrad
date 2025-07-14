import React, { useEffect, useState } from 'react';
import MyOrdersList from '../../components/MyOrders/MyOrdersList';
import styles from './MyOrders.module.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        const res = await fetch('https://b2b.printgrad.ru/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Ошибка загрузки заказов');

        const data = await res.json();
        const ordersArray = Array.isArray(data) ? data : data.orders;
        setOrders(ordersArray);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить заказы');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className={styles.wrapper}>
      {error && <div className={styles.error}>{error}</div>}
      {isLoading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : (
        <MyOrdersList orders={orders} />
      )}
    </div>
  );
};

export default MyOrdersPage;
