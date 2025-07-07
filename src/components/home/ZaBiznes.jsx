import React from "react";
import "./Zabiznes.css"

const ZaBiznes = () => {
    return (
        <div className="zabiznes">
            <div className="container">
                <div className="zabiznes__left">
                    <h2 className="zabiznes__left-heading">Что такое<br /> Za Бизнес?</h2>
                    <p className="zabiznes__left-text">Za&nbsp;Бизнес&nbsp;&mdash;
                        динамичное сообщество высококвалифицированных экспертов,
                        руководителей и&nbsp;лидеров мнений.</p>
                </div>
                <div className="zabiznes__right">
                    <div className="zabiznes__right-wrapper">
                        <img className="zabiznes__right-icon" src="/images/main-icon1.png" alt="icon" width={40} height={40} />
                        <h3 className="zabiznes__right-wrapper-heading">
                            Проверенные компании
                        </h3>
                        <p className="zabiznes__right-wrapper-text">
                            Уверенность в&nbsp;заказчике. Компании проходят юридическую
                            проверку перед публикацией заказа
                        </p>
                    </div>
                    <div className="zabiznes__right-wrapper">
                        <img className="zabiznes__right-icon" src="/images/main-icon2.png" alt="icon" width={40} height={40} />
                        <h3 className="zabiznes__right-wrapper-heading">
                            Доступ к уникальной экспертизе
                        </h3>
                        <p className="zabiznes__right-wrapper-text">
                            Общение с&nbsp;ведущими специалистами и&nbsp;лидерами рынка
                        </p>
                    </div>
                    <div className="zabiznes__right-wrapper">
                        <img className="zabiznes__right-icon" src="/images/main-icon3.png" alt="icon" width={40} height={40} />
                        <h3 className="zabiznes__right-wrapper-heading">
                            Множество направлений
                        </h3>
                        <p className="zabiznes__right-wrapper-text">
                            Находи проекты под свои навыки
                        </p>
                    </div>
                    <div className="zabiznes__right-wrapper">
                        <img className="zabiznes__right-icon" src="/images/main-icon4.png" alt="icon" width={40} height={40} />
                        <h3 className="zabiznes__right-wrapper-heading">
                            Видимость и признание
                        </h3>
                        <p className="zabiznes__right-wrapper-text">
                            Повышение личного и&nbsp;корпоративного бренда
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default ZaBiznes;