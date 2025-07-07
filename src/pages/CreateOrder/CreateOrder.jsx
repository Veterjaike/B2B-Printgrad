import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateOrder.css';

const DADATA_TOKEN = '5e46733e57b90c869ea439c02ecfb79dda4e6d3e';

export default function CreateOrder() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    budget: '',
    deadline: '',
    region: '',
    city: '',
    format: '',
    type: '',
    payment: '',
  });

  const [regionSuggestions, setRegionSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);

  const [showRegionSuggestions, setShowRegionSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Хук для закрытия подсказок по клику вне поля
  const regionRef = useRef(null);
  const cityRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setShowRegionSuggestions(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCitySuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query, type) => {
    if (!query) {
      if (type === 'region') setRegionSuggestions([]);
      else if (type === 'city') setCitySuggestions([]);
      return;
    }

    try {
      const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Token ' + DADATA_TOKEN,
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();

      if (type === 'region') {
        // Отфильтруем уникальные регионы из подсказок
        const regionsSet = new Set();
        const regions = data.suggestions
          .map(item => item.data.region)
          .filter(r => r && !regionsSet.has(r) && regionsSet.add(r));
        setRegionSuggestions(regions);
      } else if (type === 'city') {
        // Фильтруем города, учитывая Москву:
        const cityItems = data.suggestions.filter(item => {
          if (!(item.data.city || item.data.settlement)) return false;

          if (formData.region === "Москва") {
            return item.data.region === "Москва" || item.data.city === "Москва";
          } else {
            return item.data.region === formData.region;
          }
        });

        // Уникальные города
        const citiesSet = new Set();
        const cities = cityItems
          .map(item => item.data.city || item.data.settlement)
          .filter(c => c && !citiesSet.has(c) && citiesSet.add(c));
        setCitySuggestions(cities);
      }
    } catch (error) {
      console.error('Ошибка при получении подсказок:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');

    if (name === 'region') {
      setShowRegionSuggestions(true);
      fetchSuggestions(value, 'region');
      // При смене региона очищаем город
      setFormData(prev => ({ ...prev, city: '' }));
      setCitySuggestions([]);
    } else if (name === 'city') {
      setShowCitySuggestions(true);
      fetchSuggestions(value, 'city');
    }
  };

  const handleRegionSelect = (region) => {
    setFormData(prev => ({ ...prev, region, city: '' }));
    setRegionSuggestions([]);
    setShowRegionSuggestions(false);
    setCitySuggestions([]);
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({ ...prev, city }));
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Категория обязательна';
    if (!formData.title) newErrors.title = 'Название обязательно';
    if (!formData.description) newErrors.description = 'Описание обязательно';
    if (!formData.budget || isNaN(formData.budget)) newErrors.budget = 'Бюджет обязателен и должен быть числом';
    if (!formData.deadline) newErrors.deadline = 'Срок обязателен';
    if (!formData.region) newErrors.region = 'Регион обязателен';
    if (!formData.city) newErrors.city = 'Город обязателен';
    if (!formData.format) newErrors.format = 'Формат обязателен';
    if (!formData.type) newErrors.type = 'Тип обязателен';
    if (!formData.payment) newErrors.payment = 'Способ оплаты обязателен';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://b2b.printgrad.ru/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        setServerError(error.error || 'Ошибка при создании заявки');
        setIsLoading(false);
        return;
      }
      navigate('/myorders');
    } catch {
      setServerError('Ошибка сети. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`create-order-container ${visible ? 'visible' : ''}`}>
      <h2>Создать заявку</h2>
      <form className="create-order-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Категория*</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'error' : ''}
          >
            <option value="">Выберите категорию</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label>Название*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Описание*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            rows={4}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Бюджет (₽)*</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className={errors.budget ? 'error' : ''}
            min="0"
          />
          {errors.budget && <span className="error-message">{errors.budget}</span>}
        </div>

        <div className="form-group">
          <label>Срок выполнения*</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className={errors.deadline ? 'error' : ''}
          />
          {errors.deadline && <span className="error-message">{errors.deadline}</span>}
        </div>

        <div className="form-group autocomplete" ref={regionRef}>
          <label>Регион*</label>
          <input
            type="text"
            name="region"
            autoComplete="off"
            value={formData.region}
            onChange={handleChange}
            className={errors.region ? 'error' : ''}
            onFocus={() => setShowRegionSuggestions(true)}
          />
          {showRegionSuggestions && regionSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {regionSuggestions.map((region) => (
                <li key={region} onClick={() => handleRegionSelect(region)}>
                  {region}
                </li>
              ))}
            </ul>
          )}
          {errors.region && <span className="error-message">{errors.region}</span>}
        </div>

        <div className="form-group autocomplete" ref={cityRef}>
          <label>Город*</label>
          <input
            type="text"
            name="city"
            autoComplete="off"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? 'error' : ''}
            onFocus={() => setShowCitySuggestions(true)}
            disabled={!formData.region}
            placeholder={formData.region ? '' : 'Выберите регион сначала'}
          />
          {showCitySuggestions && citySuggestions.length > 0 && (
            <ul className="suggestions-list">
              {citySuggestions.map((city) => (
                <li key={city} onClick={() => handleCitySelect(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label>Формат*</label>
          <select
            name="format"
            value={formData.format}
            onChange={handleChange}
            className={errors.format ? 'error' : ''}
          >
            <option value="">Выберите формат</option>
            <option value="Удаленно">Удаленно</option>
            <option value="На месте">На месте</option>
          </select>
          {errors.format && <span className="error-message">{errors.format}</span>}
        </div>

        <div className="form-group">
          <label>Тип*</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={errors.type ? 'error' : ''}
          >
            <option value="">Выберите тип</option>
            <option value="Разовая">Разовая</option>
            <option value="Долгосрочная">Долгосрочная</option>
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label>Оплата*</label>
          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
            className={errors.payment ? 'error' : ''}
          >
            <option value="">Выберите способ оплаты</option>
            <option value="Безналичный">Безналичный</option>
            <option value="Наличный">Наличный</option>
          </select>
          {errors.payment && <span className="error-message">{errors.payment}</span>}
        </div>

        {serverError && <div className="server-error">{serverError}</div>}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="loading-spinner"></span>
          ) : (
            'Создать заявку'
          )}
        </button>
      </form>
    </div>
  );
}
