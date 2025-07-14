import React from 'react';
import styles from './OrdersFilter.module.css';

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

const OrdersFilter = ({ selectedCategories, onFilterChange, selectedRegion, onRegionChange, regions }) => {
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      onFilterChange(selectedCategories.filter(c => c !== category));
    } else {
      onFilterChange([...selectedCategories, category]);
    }
  };

  return (
    <div className={styles.ordersFilter}>
      <div className={`${styles.filterGroup} ${styles.categoriesFilter}`}>
        <span className={styles.categoryFilterHeading}>Категории:</span>
        <div className={styles.categoriesList}>
          {categories.map(cat => (
            <label key={cat} className={styles.categoryItem}>
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

      <div className={`${styles.filterGroup} ${styles.regionFilter}`}>
        <label htmlFor="region-select">Регион:</label>
        <select
          id="region-select"
          value={selectedRegion || ''}
          onChange={e => onRegionChange(e.target.value)}
          className={styles.regionSelect}
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
};

export default OrdersFilter;
