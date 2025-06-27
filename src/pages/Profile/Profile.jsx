import React, { useState } from "react"
import users from "../../data/users"
import "./Profile.css"


export const Profile = () => {
    const currentUser = users[1]
    const [avatar, setAvatar] = useState(null)

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatar(URL.createObjectURL(file))
        }
    }

    return (
        <div className="profile-new-layout">
            <div className="profile-left">
                <div className="profile-usercard">
                    <div className="profile-avatar">
                        {avatar ? (
                            <img src={avatar} alt="avatar" className="avatar-img" />
                        ) : (
                            // Заглушка для фото
                            <div className="avatar-placeholder">{currentUser.name[0]}</div>
                        )}
                        <label className="avatar-upload-label">
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="avatar-upload-input" />
                            <span className="avatar-upload-icon">
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="11" r="11" fill="#fff" />
                                    <path d="M11 6v10M6 11h10" stroke="#888" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </span>
                        </label>
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
                <div className="profile-orders-block">Мои заказы <span className="orders-count">- 5</span></div>
                <div className="profile-market-block">Новое на бирже <span className="orders-count">- 12 проекта за сутки</span></div>
                <div className="profile-about-block">
                    <div className="about-title">О себе</div>
                    <hr className="about-divider" />
                    <div className="about-text">{currentUser.about}</div>
                </div>
            </div>
        </div>
    )
}

Profile.displayName = "Profile"
export default Profile