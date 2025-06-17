import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'

export default function Header() {
    return (
        <header className='header'>
            <div className="container">
                <div className="header__logo">
                    <a className="header__logo-text" href='/'>Принтград B2B</a>
                </div>
                <nav className='header__nav'>
                    <Link className='header__nav-link btn' to="/" >Главная</Link>
                    <Link className='header__nav-link btn' to="/orders" >Заказы</Link>
                    <Link className='header__nav-link btn' to="/orders" >Мой календарь</Link>
                    <Link className='header__nav-link btn' to="/profile">Профиль</Link>
                </nav>
            </div>
        </header>
    );
}