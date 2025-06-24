import React from "react"
import users from "../../data/users"
import "./Profile.css"


export const Profile = () => {
    const currentUser = users[1] // теперь отображаем модератора

    return (
        <div className="profile-new-layout">
            {/* Левая колонка */}
            <div className="profile-left">
                <div className="profile-usercard">
                    <div className="profile-avatar">
                        {/* Заглушка для фото */}
                        <div className="avatar-placeholder">{currentUser.name[0]}</div>
                    </div>
                    <div className="profile-company">{currentUser.company}</div>
                    <div className="profile-status">{currentUser.status}</div>
                </div>
                <div className="profile-chat-block">
                    <div className="chat-title">Сообщения</div>
                    <hr className="chat-divider" />
                    {/* Пока пусто */}
                </div>
            </div>
            {/* Правая колонка */}
            <div className="profile-right">
                <div className="profile-orders-block">Мои заказы</div>
                <div className="profile-market-block">Новое на бирже</div>
                <div className="profile-about-block">
                    <div className="about-title">О себе</div>
                    <div className="about-text">{currentUser.about}</div>
                </div>
            </div>
        </div>
    )
}

Profile.displayName = "Profile"
export default Profile