import React from "react";
import "./BlockButton.css"
import { useNavigate } from 'react-router-dom';

const BlockButton = () => {
    const navigate = useNavigate();
    return (
        <div className="block-button">
            <span className="block-button__text">Легкий путь от регистрации до проекта</span>
            <button className="main-content__link block-button-btn"
                onClick={() => navigate('/profile')}>Начать Путь к Росту</button>
        </div>
    );
}

export default BlockButton;