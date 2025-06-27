import React, { useState } from 'react';
import './Forms.css'; // Общие стили для форм

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    inn: '',
    role: 'executor' // По умолчанию "исполнитель"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }
    // Обработка регистрации
    console.log('Register data:', formData);
  };

  return (
    <div className="form-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-login">Логин</label>
          <input
            type="text"
            id="reg-login"
            name="login"
            value={formData.login}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-password">Пароль</label>
          <input
            type="password"
            id="reg-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-confirm-password">Подтверждение пароля</label>
          <input
            type="password"
            id="reg-confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-fullname">ФИО</label>
          <input
            type="text"
            id="reg-fullname"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="reg-inn">ИНН ИП или ООО</label>
          <input
            type="text"
            id="reg-inn"
            name="inn"
            value={formData.inn}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Роль</label>
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
        
        <button type="submit" className="submit-btn">Зарегистрироваться</button>
      </form>
    </div>
  );
};