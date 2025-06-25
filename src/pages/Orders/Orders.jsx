import React, { useState, useEffect, useCallback } from 'react';
import OrdersFilter from "../../components/OrdersFilter";
import OrdersList from '../../components/OrdersList';
import './Orders.css';

const Orders = () => {
    const [selectedCategories, setSelectedCategories] = useState(() => {
        try {
            const saved = localStorage.getItem('ordersFilter_selectedCategories');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleFilterChange = useCallback((categories) => {
        setSelectedCategories(categories);
        try {
            localStorage.setItem('ordersFilter_selectedCategories', JSON.stringify(categories));
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    }, []);

    useEffect(() => {
        let isActive = true;

        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);

                await new Promise(resolve => setTimeout(resolve, 500));

                const mockOrders = [
                    {
                        id: 1,
                        title: 'Установить кассу',
                        category: 'Контрольно-кассовая техника',
                        date: '2023-10-15',
                        status: 'Открыта',
                        price: 12000
                    },
                    {
                        id: 2,
                        title: 'Переустановить ПО на сервере Dell',
                        category: 'Серверы и серверные ОС',
                        date: '2023-11-02',
                        status: 'В работе',
                        price: 4000
                    },
                    {
                        id: 3,
                        title: 'Установка видеонаблюдения',
                        category: 'Система видеонаблюдения',
                        date: '2023-11-02',
                        status: 'Открыта',
                        price: 9000
                    },
                    {
                        id: 4,
                        title: 'Поверка весов',
                        category: 'Весовое оборудование',
                        date: '2023-11-02',
                        status: 'Открыта',
                        price: 2000
                    }
                ];

                if (isActive) {
                    setOrders(mockOrders);
                }
            } catch (err) {
                if (isActive) {
                    setError('Ошибка загрузки данных');
                    console.error(err);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        fetchOrders();

        return () => {
            isActive = false;
        };
    }, []);

    return (
        <div className="orders">
            <div className="container orders-container">
                <div className="orders-filter-container">
                    <OrdersFilter
                        selectedCategories={selectedCategories}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                <div className="orders-list-container">
                    {error ? (
                        <div className="orders-error">{error}</div>
                    ) : isLoading ? (
                        <div className="orders-loading">Загрузка заказов...</div>
                    ) : (
                        <OrdersList
                            orders={orders}
                            activeCategories={selectedCategories}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;