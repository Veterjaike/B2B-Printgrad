import React, { useState, useEffect } from 'react';
import './Forms.css';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    inn: '',
    role: 'исполнитель',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [innStatus, setInnStatus] = useState('idle'); // idle, checking, valid, invalid

  // Проверка ИНН через бекенд
  const checkInnBackend = async (inn) => {
    if (!(inn.length === 10 || inn.length === 12)) {
      setInnStatus('invalid');
      setErrors(prev => ({ ...prev, inn: 'ИНН должен содержать 10 или 12 цифр' }));
      return;
    }

    setInnStatus('checking');
    setErrors(prev => ({ ...prev, inn: '' }));

    try {
      const res = await fetch('https://b2b.printgrad.ru/api/check-inn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inn }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setInnStatus('valid');
        setErrors(prev => ({ ...prev, inn: '' }));
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

    if (serverError) {
      setServerError('');
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
    } else {
      const words = formData.fullName.trim().split(/\s+/);
      if (words.length !== 3) {
        newErrors.fullName = 'ФИО должно содержать ровно 3 слова';
      }
    }

    if (!formData.inn) {
      newErrors.inn = 'ИНН обязательно';
    } else if (innStatus !== 'valid') {
      newErrors.inn = 'ИНН не прошел проверку';
    }

    if (!formData.role) {
      newErrors.role = 'Роль обязательна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setServerError('');

    try {
      const res = await fetch('https://b2b.printgrad.ru/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        setServerError(error.message || 'Ошибка регистрации');
        setIsLoading(false);
        return;
      }

      window.location.href = '/dashboard';
    } catch (error) {
      setServerError('Ошибка сети. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            required
            autoComplete="email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль*</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            required
            autoComplete="new-password"
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Подтверждение пароля*</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            required
            autoComplete="new-password"
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="fullName">ФИО*</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? 'error' : ''}
            required
            autoComplete="name"
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="inn">ИНН*</label>
          <input
            type="text"
            id="inn"
            name="inn"
            value={formData.inn}
            onChange={handleChange}
            maxLength={12}
            className={errors.inn ? 'error' : ''}
            required
            autoComplete="off"
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
                value="исполнитель"
                checked={formData.role === 'исполнитель'}
                onChange={handleChange}
              />
              Исполнитель
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="заказчик"
                checked={formData.role === 'заказчик'}
                onChange={handleChange}
              />
              Заказчик
            </label>
          </div>
          {errors.role && <span className="error-message">{errors.role}</span>}
        </div>

        {serverError && <div className="server-error">{serverError}</div>}

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
