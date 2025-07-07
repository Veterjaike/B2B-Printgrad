import React, { useState, useEffect, useCallback } from 'react';
import OrdersList from '../../components/OrdersList';
import './Orders.css';

function OrdersFilter({ selectedCategories, onFilterChange, selectedRegion, onRegionChange, regions }) {
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

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            onFilterChange(selectedCategories.filter(c => c !== category));
        } else {
            onFilterChange([...selectedCategories, category]);
        }
    };

    return (
        <div className="orders-filter">
            <div className="filter-group categories-filter">
                <label>Категории:</label>
                <div className="categories-list">
                    {categories.map(cat => (
                        <label key={cat} className="category-item">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat)}
                                onChange={() => toggleCategory(cat)}
                            />
                            {cat}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-group region-filter">
                <label htmlFor="region-select">Регион:</label>
                <select
                    id="region-select"
                    value={selectedRegion || ''}
                    onChange={e => onRegionChange(e.target.value)}
                >
                    <option value="">Все регионы</option>
                    {regions.map(region => (
                        <option key={region} value={region}>
                            {region}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

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

                if (selectedCategories.length > 0) {
                    selectedCategories.forEach(cat => params.append('categories', cat));
                }
                if (selectedRegion && selectedRegion.trim() !== '') {
                    params.append('region', selectedRegion.trim());
                }

                const token = localStorage.getItem('token');

                const response = await fetch(`https://b2b.printgrad.ru/api/orders?${params.toString()}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка сервера: ${response.status}`);
                }

                const data = await response.json();

                if (isActive) {
                    setOrders(data.orders || data);
                }
            } catch (err) {
                if (isActive) {
                    setError('Ошибка загрузки данных. Попробуйте позже.');
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
    }, [selectedCategories, selectedRegion]);

    return (
        <div className="orders">
            <div className="container orders-container">
                <div className="orders-filter-container">
                    <OrdersFilter
                        selectedCategories={selectedCategories}
                        onFilterChange={handleFilterChange}
                        selectedRegion={selectedRegion}
                        onRegionChange={handleRegionChange}
                        regions={regions}
                    />
                </div>

                <div className="orders-list-container">
                    {error ? (
                        <div className="orders-error">{error}</div>
                    ) : isLoading ? (
                        <div className="orders-loading">Загрузка заказов...</div>
                    ) : (
                        <OrdersList orders={orders} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
