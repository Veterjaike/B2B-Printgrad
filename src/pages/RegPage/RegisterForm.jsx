import React, { useState, useEffect } from 'react';
import './Forms.css';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    inn: '',
    role: 'executor',
    companyName: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [innStatus, setInnStatus] = useState('idle'); // 'idle', 'checking', 'valid', 'invalid'

  // Ключ Dadata (лучше хранить в .env)
  const DADATA_API_KEY = 'process.env.NEXT_PUBLIC_DADATA_API_KEY';
  const DADATA_TIMEOUT = 1000;

  // Проверка ИНН через Dadata
  const checkInnWithDadata = async (inn) => {
    if (!inn || inn.length < 10) return;

    setInnStatus('checking');

    try {
      const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${process.env.NEXT_PUBLIC_DADATA_API_KEY}`
        },
        body: JSON.stringify({ query: inn })
      });

      if (!response.ok) throw new Error('Ошибка проверки ИНН');

      const data = await response.json();
      const suggestion = data.suggestions?.[0];

      if (suggestion) {
        const companyName = suggestion.data.name?.full || suggestion.value;
        setFormData(prev => ({
          ...prev,
          companyName
        }));
        setInnStatus('valid');
      } else {
        setInnStatus('invalid');
        setErrors(prev => ({ ...prev, inn: 'ИНН не найден в реестре' }));
      }
    } catch (error) {
      console.error('Dadata error:', error);
      setInnStatus('invalid');
      setErrors(prev => ({ ...prev, inn: 'Ошибка проверки ИНН' }));
    }
  };

  // Задержка для запроса (дебаунс)
  useEffect(() => {
    if (formData.inn.length >= 10) {
      const timer = setTimeout(() => {
        checkInnWithDadata(formData.inn);
      }, DADATA_TIMEOUT);

      return () => clearTimeout(timer);
    } else {
      setInnStatus('idle');
      setFormData(prev => ({ ...prev, companyName: '' }));
    }
  }, [formData.inn]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Для поля ИНН - только цифры
    if (name === 'inn') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
        companyName: ''
      }));
      setInnStatus('idle');
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!formData.fullName) {
      newErrors.fullName = 'ФИО обязательно';
    }

    if (!formData.inn) {
      newErrors.inn = 'ИНН обязательно';
    } else if (!/^\d{10,12}$/.test(formData.inn)) {
      newErrors.inn = 'ИНН должен содержать 10 или 12 цифр';
    } else if (innStatus !== 'valid') {
      newErrors.inn = 'ИНН не прошел проверку';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          inn: formData.inn,
          role: formData.role,
          companyName: formData.companyName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
      }

      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Произошла ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-email">Email*</label>
          <input
            type="email"
            id="reg-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Пароль*</label>
          <input
            type="password"
            id="reg-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm-password">Подтверждение пароля*</label>
          <input
            type="password"
            id="reg-confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reg-fullname">ФИО*</label>
          <input
            type="text"
            id="reg-fullname"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="reg-inn">ИНН ИП или ООО*</label>
          <input
            type="text"
            id="reg-inn"
            name="inn"
            value={formData.inn}
            onChange={handleChange}
            required
            className={errors.inn ? 'error' : ''}
            maxLength={12}
            placeholder="10 или 12 цифр"
          />
          {innStatus === 'checking' && (
            <div className="inn-status checking">Проверка ИНН...</div>
          )}
          {innStatus === 'valid' && formData.companyName && (
            <div className="inn-status valid">
              ✔ {formData.companyName}
            </div>
          )}
          {innStatus === 'invalid' && (
            <div className="inn-status invalid">✖ ИНН не найден</div>
          )}
          {errors.inn && <span className="error-message">{errors.inn}</span>}
        </div>

        <div className="form-group">
          <label>Роль*</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="executor"
                checked={formData.role === 'executor'}
                onChange={handleChange}
              />
              Исполнитель
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="customer"
                checked={formData.role === 'customer'}
                onChange={handleChange}
              />
              Заказчик
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading || innStatus === 'checking'}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};