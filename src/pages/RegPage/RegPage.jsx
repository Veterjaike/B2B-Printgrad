import React from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import './RegPage.css';

const RegPage = () => {
    return (
        <div className="reg-page">
            <h1>Добро пожаловать!</h1>
            <div className="forms-container">
                <LoginForm />
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegPage;