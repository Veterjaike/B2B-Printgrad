import React from 'react';
import LoginForm from './LoginForm';
import { RegisterForm } from './RegisterForm';
import './RegPage.css';

const RegPage = () => {
    return (
        <div className="reg-page">
            <h2 className='reg-page__heding'>Вы не вошли в систему</h2>
            <p className='reg-page__text'>Войдите или зарегистрируйтесть</p>
            <div className="forms-container">
                <LoginForm />
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegPage;