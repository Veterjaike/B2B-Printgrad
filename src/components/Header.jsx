import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Header() {
  const token = localStorage.getItem('token'); // Замени, если у тебя другой ключ для токена
  const user = token ? parseJwt(token) : null;

  return (
    <header className='header'>
      <div className="container">
        <div className="header__left">
          <a className="header__left-link" href='/'>
            <img
              className="header__left-link-image"
              src="/images/logoZabiznes.png"
              alt="logo"
              width={200}
              height={68}
            />
          </a>
          <nav className='header__nav'>
            <Link className='header__nav-link btn' to="/" >Главная</Link>
            <Link className='header__nav-link btn' to="/orders" >Все заказы</Link>
            <Link className='header__nav-link btn' to="/myorders" >Мои заказы</Link>
          </nav>
        </div>

        <div className="header__right">
          {user?.role === 'заказчик' && (
            <Link className='header__nav-create-link btn' to="/create-order">
              Создать заказ
            </Link>
          )}
          <Link className='header__nav-link btn' to="/profile">Профиль</Link>
        </div>
      </div>
    </header>
  );
}
