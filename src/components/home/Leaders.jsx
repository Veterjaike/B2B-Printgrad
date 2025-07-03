import React from "react";
import "./Leaders.css";

const Leaders = () => {
    return (
        <div className="leaders">
            <div className="leaders-container">
                <h2 className="leaders-title">Наша аудитория — Лидеры Перемен</h2>

                <div className="leaders-grid">
                    <div className="leader-card card-one">
                        <h3 className="leader-category">Эксперты и консультанты:</h3>
                        <p className="leader-description">
                            Желающие делиться своим опытом, находить новые проекты и расширять сеть контактов.
                        </p>
                    </div>

                    <div className="leader-card card-two">
                        <h3 className="leader-category">Руководители и топ-менеджеры:</h3>
                        <p className="leader-description">
                            Ищущие новые подходы, решения для своих компаний и возможности для личного роста.
                        </p>
                    </div>

                    <div className="leader-card card-three">
                        <h3 className="leader-category">Предприниматели и владельцы бизнеса:</h3>
                        <p className="leader-description">
                            Стремящиеся к инновациям, масштабированию и адаптации своего дела к вызовам рынка.
                        </p>
                    </div>

                    <div className="leader-card all-who-card">
                        <h3 className="leader-category">Все, кто:</h3>
                        <ul className="who-list">
                            <li>Заинтересован в цифровой трансформации и инновациях.</li>
                            <li>Стремится к непрерывному развитию и обучению.</li>
                            <li>Ценит качественный нетворкинг и обмен знаниями.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaders;