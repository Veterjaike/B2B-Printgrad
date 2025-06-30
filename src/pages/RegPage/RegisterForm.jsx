import React, { useState, useEffect } from 'react';
import './Forms.css';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    inn: '',
    role: 'executor'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [innStatus, setInnStatus] = useState('idle'); // idle, checking, valid, invalid

  // Проверка ИНН на бэкенде
  const checkInnBackend = async (inn) => {
    if (!inn || (inn.length !== 10 && inn.length !== 12)) {
      setInnStatus('invalid');
      setErrors(prev => ({ ...prev, inn: 'ИНН должен содержать 10 или 12 цифр' }));
      return;
    }

    setInnStatus('checking');
    setErrors(prev => ({ ...prev, inn: '' }));

    try {
      const res = await fetch('/api/check-inn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inn }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setInnStatus('valid');
      } else {
        setInnStatus('invalid');
        setErrors(prev => ({ ...prev, inn: data.message || 'ИНН не прошел проверку' }));
      }
    } catch {
      setInnStatus('invalid');
      setErrors(prev => ({ ...prev, inn: 'Ошибка проверки ИНН' }));
    }
  };

  useEffect(() => {
    if (formData.inn.length === 10 || formData.inn.length === 12) {
      const timer = setTimeout(() => {
        checkInnBackend(formData.inn);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setInnStatus('idle');
      setErrors(prev => ({ ...prev, inn: '' }));
    }
  }, [formData.inn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = name === 'inn' ? value.replace(/\D/g, '') : value;
    setFormData(prev => ({ ...prev, [name]: val }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'inn') {
      setInnStatus('idle');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка регистрации');
      }
      window.location.href = '/dashboard';
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Пароль*</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            required
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Подтверждение пароля*</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            required
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label>ФИО*</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? 'error' : ''}
            required
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label>ИНН*</label>
          <input
            type="text"
            name="inn"
            value={formData.inn}
            onChange={handleChange}
            maxLength={12}
            className={errors.inn ? 'error' : ''}
            required
          />
          {innStatus === 'checking' && <div className="inn-status checking">Проверка ИНН...</div>}
          {innStatus === 'valid' && <div className="inn-status valid">✔ ИНН валиден</div>}
          {innStatus === 'invalid' && <div className="inn-status invalid">✖ {errors.inn}</div>}
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
          disabled={isLoading || innStatus !== 'valid'}
          className="submit-btn"
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};
