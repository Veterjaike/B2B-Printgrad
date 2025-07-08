import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderDetails.css';

const DADATA_TOKEN = '5e46733e57b90c869ea439c02ecfb79dda4e6d3e';

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

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [regionSuggestions, setRegionSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showRegionSuggestions, setShowRegionSuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const regionRef = useRef(null);
  const cityRef = useRef(null);

  const token = localStorage.getItem('token');

  const getUserRole = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  const userRole = getUserRole();
  const canEdit = userRole === 'admin' || userRole === 'moderator';
  const canRespond = userRole === 'исполнитель';

  const axiosInstance = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const endpoint = canEdit
          ? `/api/moderator/orders/${id}`
          : `/api/orders/${id}`;
        const res = await axiosInstance.get(endpoint);
        setOrder(res.data.order);
      } catch {
        setError('Ошибка при загрузке заявки');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (regionRef.current && !regionRef.current.contains(e.target)) {
        setShowRegionSuggestions(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setShowCitySuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query, type) => {
    if (!query) {
      type === 'region' ? setRegionSuggestions([]) : setCitySuggestions([]);
      return;
    }

    try {
      const res = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Token ' + DADATA_TOKEN,
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (type === 'region') {
        const regionsSet = new Set();
        const regions = data.suggestions
          .map(i => i.data.region)
          .filter(r => r && !regionsSet.has(r) && regionsSet.add(r));
        setRegionSuggestions(regions);
      } else {
        const filtered = data.suggestions.filter(i => {
          const reg = i.data.region;
          const city = i.data.city || i.data.settlement;
          if (!city) return false;
          if (order.region === 'Москва') return reg === 'Москва' || city === 'Москва';
          return reg === order.region;
        });
        const citiesSet = new Set();
        const cities = filtered
          .map(i => i.data.city || i.data.settlement)
          .filter(c => c && !citiesSet.has(c) && citiesSet.add(c));
        setCitySuggestions(cities);
      }
    } catch (err) {
      console.error('Ошибка Dadata:', err);
    }
  };

  const handleChange = (e) => {
    if (!canEdit) return;
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
    if (name === 'region') {
      setShowRegionSuggestions(true);
      fetchSuggestions(value, 'region');
      setOrder((prev) => ({ ...prev, city: '' }));
    } else if (name === 'city') {
      setShowCitySuggestions(true);
      fetchSuggestions(value, 'city');
    }
  };

  const handleRegionSelect = (region) => {
    setOrder((prev) => ({ ...prev, region, city: '' }));
    setRegionSuggestions([]);
    setShowRegionSuggestions(false);
  };

  const handleCitySelect = (city) => {
    setOrder((prev) => ({ ...prev, city }));
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.patch(`/api/moderator/orders/${id}`, order);
      alert('Заявка сохранена');
      navigate('/admin');
    } catch (e) {
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const handleRespond = async () => {
    try {
      await axiosInstance.post(`/api/orders/${id}/respond`);
      alert('Отклик отправлен');
    } catch {
      alert('Ошибка при отклике');
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>Заявка не найдена</p>;

  return (
    <div className="order-details-container">
      <h1>Заявка #{order.id}</h1>
      <div className="order-details-grid">
        <label>
          Заголовок:
          <input type="text" name="title" value={order.title || ''} onChange={handleChange} disabled={!canEdit} />
        </label>

        <label>
          Категория:
          <select name="category" value={order.category || ''} onChange={handleChange} disabled={!canEdit}>
            <option value="">Выберите категорию</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </label>

        <label>
          Бюджет:
          <input type="number" name="budget" value={order.budget || ''} onChange={handleChange} disabled={!canEdit} />
        </label>

        <label>
          Статус модерации:
          <select name="moderation_status" value={order.moderation_status || ''} onChange={handleChange} disabled={!canEdit}>
            <option value="pending">Ожидает</option>
            <option value="approved">Одобрена</option>
            <option value="rejected">Отклонена</option>
          </select>
        </label>

        <label>
          Описание:
          <textarea name="description" rows={4} value={order.description || ''} onChange={handleChange} disabled={!canEdit} />
        </label>

        <label>
          Дедлайн:
          <input type="date" name="deadline" value={order.deadline?.slice(0, 10) || ''} onChange={handleChange} disabled={!canEdit} />
        </label>

        <div className="autocomplete" ref={regionRef}>
          <label>Регион:
            <input type="text" name="region" value={order.region || ''} onChange={handleChange} onFocus={() => setShowRegionSuggestions(true)} disabled={!canEdit} />
          </label>
          {showRegionSuggestions && regionSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {regionSuggestions.map(region => (
                <li key={region} onClick={() => handleRegionSelect(region)}>{region}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="autocomplete" ref={cityRef}>
          <label>Город:
            <input type="text" name="city" value={order.city || ''} onChange={handleChange} onFocus={() => setShowCitySuggestions(true)} disabled={!canEdit || !order.region} placeholder={order.region ? '' : 'Сначала выберите регион'} />
          </label>
          {showCitySuggestions && citySuggestions.length > 0 && (
            <ul className="suggestions-list">
              {citySuggestions.map(city => (
                <li key={city} onClick={() => handleCitySelect(city)}>{city}</li>
              ))}
            </ul>
          )}
        </div>

        <label>
          Формат:
          <select name="format" value={order.format || ''} onChange={handleChange} disabled={!canEdit}>
            <option value="">Выберите формат</option>
            <option value="Удаленно">Удаленно</option>
            <option value="На месте">На месте</option>
          </select>
        </label>

        <label>
          Тип:
          <select name="type" value={order.type || ''} onChange={handleChange} disabled={!canEdit}>
            <option value="">Выберите тип</option>
            <option value="Разовая">Разовая</option>
            <option value="Долгосрочная">Долгосрочная</option>
          </select>
        </label>

        <label>
          Оплата:
          <select name="payment" value={order.payment || ''} onChange={handleChange} disabled={!canEdit}>
            <option value="">Выберите способ оплаты</option>
            <option value="Безналичный">Безналичный</option>
            <option value="Наличный">Наличный</option>
          </select>
        </label>
      </div>

      <div className="order-details-buttons">
        {canEdit && (
          <>
            <button onClick={handleSave} disabled={saving}>{saving ? 'Сохраняем...' : 'Сохранить'}</button>
            <button onClick={() => navigate(-1)}>Закрыть</button>
          </>
        )}
        {!canEdit && canRespond && (
          <>
            <button onClick={handleRespond}>Откликнуться</button>
            <button onClick={() => navigate(-1)}>Закрыть</button>
          </>
        )}
        {!canEdit && !canRespond && <button onClick={() => navigate(-1)}>Закрыть</button>}
      </div>
    </div>
  );
};

export default OrderDetails;
