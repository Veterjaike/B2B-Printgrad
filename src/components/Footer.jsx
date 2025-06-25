import React from "react";
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <div className="footer">
            <div className="container">
                <div className="footer__left">
                    <span className="footer__left-logo">Группа</span>
                    <span className="footer__left-logo">Компаний</span>
                    <span className="footer__left-logo">Принтград</span>
                    <span className="footer__left-text">© ООО «Управляющая ИТ Компания», 2025
                        ИНН 4824058567, ОГРН 1124823011653</span>
                </div>
                <div className="footer__right">
                    <Link className='footer__nav-link' to="/" >Главная</Link>
                    <Link className='footer__nav-link' to="/orders" >Все заказы</Link>
                    <Link className='footer__nav-link' to="/myOrders" >Мои заказы</Link>
                    <Link className='footer__nav-link' to="/profile">Профиль</Link>
                </div>
            </div>
        </div>
    );
}

export default Footer;