import React, { useState } from "react"
import "./Avatar.css"

const Avatar = ({ name }) => {
    const [avatar, setAvatar] = useState(null)
    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatar(URL.createObjectURL(file))
        }
    }
    return (
        <div className="profile-avatar">
            {avatar ? (
                <img src={avatar} alt="avatar" className="avatar-img" />
            ) : (
                <div className="avatar-placeholder">{name[0]}</div>
            )}
            <label className="avatar-upload-label">
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="avatar-upload-input" />
                <span className="avatar-upload-icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="11" fill="#fff"/>
                        <path d="M11 6v10M6 11h10" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </span>
            </label>
        </div>
    )
}

export default Avatar 