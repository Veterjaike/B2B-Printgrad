import React, { useEffect } from "react";
import './OrdersFilter.css';

const STORAGE_KEY = 'ordersFilter_selectedCategories';

const OrdersFilter = ({ selectedCategories = [], onFilterChange }) => {
    const categories = [
        "Серверы и серверные ОС",
        "Автоматизированные рабочие места и программное обеспечение",
        "Сетевая инфраструктура",
        "Оргтехника",
        "Контрольно-кассовая техника",
        "Весовое оборудование",
        "Торговое оборудование",
        "Система видеонаблюдения",
        "Системы мониторинга"
    ];

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && onFilterChange) {
            onFilterChange(JSON.parse(saved));
        }
    }, [onFilterChange]);

    const handleCategoryChange = (category) => {
        const newSelected = selectedCategories.includes(category)
            ? selectedCategories.filter(item => item !== category)
            : [...selectedCategories, category];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSelected));

        if (onFilterChange) {
            onFilterChange(newSelected);
        }
    };

    return (
        <div className="orders-filter">
            <h3 className="orders-filter-title">Фильтр по категориям</h3>
            <ul className="orders-filter-list">
                {categories.map((category, index) => (
                    <li key={index} className="orders-filter-list-item">
                        <label className="orders-filter-label">
                            <input
                                type="checkbox"
                                className="orders-filter-checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            <span className="orders-filter-text">{category}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersFilter;