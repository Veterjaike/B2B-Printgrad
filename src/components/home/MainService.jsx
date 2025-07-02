import React from "react"
import './MainService.css'
import { useNavigate } from 'react-router-dom';

export default function MainService() {
    const navigate = useNavigate();

    return (
        <div className="main-content">
            <div className="main-content__wrapper">
                <div className="main-content__left">
                    <h1 className="main-content__left-heading">
                        Платформа <br /> объединяющая <br />
                        <span className="main-content__left-heading-color"> таланты и бизнес</span>
                    </h1>
                    <p className="main-content__left-text">Развивайте свой бизнес вместе с&nbsp;лидерами отрасли.<br />
                        Присоединяйтесь к&nbsp;нам и&nbsp;начните свой путь к&nbsp;<br />успеху уже сегодня!</p>
                </div>
                <div className="main-content__right">
                    <img className="main-content__right-img" src="/images/main-img2.webp" alt="Город и руки" width={800} height={600} />
                </div>
            </div>

            <button className="main-content__link"
                onClick={() => navigate('/profile')}>Начать Путь к Росту</button>

        </div>
    )
}