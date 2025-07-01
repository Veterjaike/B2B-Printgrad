import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'

export default function Header() {
    return (
        <header className='header'>
            <div className="container">
                <div className="header__left">
                    <a className="header__left-link" href='/'>
                        <img className="header__left-link-image" src="/images/logoZabiznes.png"
                            alt="logo" width={200} height={68} />
                    </a>
                    <nav className='header__nav'>
                        <Link className='header__nav-link btn' to="/" >Главная</Link>
                        <Link className='header__nav-link btn' to="/orders" >Все заказы</Link>
                        <Link className='header__nav-link btn' to="/myorders" >Мои заказы</Link>

                    </nav>
                </div>
                <Link className='header__nav-link btn' to="/profile">Профиль</Link>
            </div>
        </header>
    );
}