import React from "react";
import { useNavigate } from 'react-router-dom';
import "./Horizons.css"

const Horizons = () => {
    const navigate = useNavigate();
    return (
        <div className="horizons">
            <div className="container">
                <div className="horizons__wrapper">
                    <h2 className="horizons__heading-up">Откройте новые горизонты
                        с&nbsp;платформой&nbsp;<br /><b>Za бизнес</b></h2>
                    <p className="horizons__text">Za&nbsp;бизнес&nbsp;&mdash; это инновационная платформа, соединяющая компании и&nbsp;специалистов по&nbsp;всей России. Мы&nbsp;помогаем вам находить решения для роста и&nbsp;развития вашего бизнеса.
                        Не&nbsp;упустите свой шанс!Станьте частью ведущего сообщества экспертов и&nbsp;руководителей.
                        Вносите свой вклад в&nbsp;трансформацию бизнеса.
                        Расширяйте свои возможности и&nbsp;горизонты.</p>
                    <h3 className="horizons__heding-down">Не упустите свой шанс!</h3>
                    <p className="horizons__text">Станьте частью ведущего сообщества экспертов и&nbsp;руководителей.
                        Вносите свой вклад в&nbsp;трансформацию бизнеса.
                        Расширяйте свои возможности и&nbsp;горизонты.</p>
                    <button className="main-content__link horizons-btn"
                        onClick={() => navigate('/profile')}>Начать</button>
                </div>
            </div>
        </div>
    );
}

export default Horizons;