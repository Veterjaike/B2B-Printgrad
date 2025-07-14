import React, { useState, useEffect, useCallback } from 'react';
import OrdersList from '../../components/Orders/OrdersList';
import OrdersFilter from '../../components/Orders/OrdersFilter';
import styles from './Orders.module.css';

const Orders = () => {
  const [selectedCategories, setSelectedCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('ordersFilter_selectedCategories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedRegion, setSelectedRegion] = useState(() => {
    return localStorage.getItem('ordersFilter_selectedRegion') || '';
  });

  const [regions, setRegions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFilterChange = useCallback((categories) => {
    setSelectedCategories(categories);
    try {
      localStorage.setItem('ordersFilter_selectedCategories', JSON.stringify(categories));
    } catch (e) {
      console.error('Ошибка сохранения категорий в localStorage:', e);
    }
  }, []);

  const handleRegionChange = useCallback((region) => {
    setSelectedRegion(region);
    try {
      localStorage.setItem('ordersFilter_selectedRegion', region);
    } catch (e) {
      console.error('Ошибка сохранения региона в localStorage:', e);
    }
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://b2b.printgrad.ru/api/orders/regions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Ошибка загрузки регионов');
        const data = await res.json();
        setRegions(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    let isActive = true;

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        selectedCategories.forEach(cat => params.append('categories', cat));
        if (selectedRegion?.trim()) {
          params.append('region', selectedRegion.trim());
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`https://b2b.printgrad.ru/api/orders?${params.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        const data = await response.json();
        if (isActive) setOrders(data.orders || data);
      } catch (err) {
        if (isActive) {
          setError('Ошибка загрузки данных. Попробуйте позже.');
          console.error(err);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchOrders();
    return () => {
      isActive = false;
    };
  }, [selectedCategories, selectedRegion]);

  return (
    <div className={styles.orders}>
      <div className={styles.ordersContainer}>
        <div className={styles.ordersFilterContainer}>
          <OrdersFilter
            selectedCategories={selectedCategories}
            onFilterChange={handleFilterChange}
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
            regions={regions}
          />
        </div>

        <div className={styles.ordersListContainer}>
          {error ? (
            <div className={styles.ordersError}>{error}</div>
          ) : isLoading ? (
            <div className={styles.ordersLoading}>Загрузка заказов...</div>
          ) : (
            <OrdersList orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
