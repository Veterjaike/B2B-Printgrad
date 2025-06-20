import React from "react"
import './MainService.css'

export default function MainService() {
    return (
        <div className="main-content">
            <div className="container">

                <div className="main-content__left">
                    <h1 className="main-content__left-heading"> Надежный сервис <br /> для поиска
                        <span className="main-content__left-heading-color"> исполнителей</span><br />и <br />
                        <span className="main-content__left-heading-color"> заказчиков</span></h1>
                    <p className="main-content__left-text">Мы широкопрофильная компания<br /> на рынке сервисных ИТ-услуг</p>
                    <div className="main-content__left-wrapper">
                        <a className="main-content__left-wrapper-link btn"
                            href="http://95.31.48.48/profile">Присоединиться</a>
                    </div>
                </div>
                <div className="main-content__right">
                    <img className="main-content__right-img" src="/images/pgMain.png"
                        alt="Люди" width={'600px'} height={'400px'} />
                </div>
            </div>
        </div>
    )
}