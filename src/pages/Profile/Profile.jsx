import React, { useState, useEffect } from "react"
import "./Profile.css"
import Avatar from "../../components/profile/Avatar"
import UserCard from "../../components/profile/UserCard"
import OrdersBlock from "../../components/profile/OrdersBlock"
import MarketBlock from "../../components/profile/MarketBlock"
import AboutBlock from "../../components/profile/AboutBlock"
import ChatBlock from "../../components/profile/ChatBlock"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const Profile = () => {
    const [currentUser, setCurrentUser] = useState(null)
    const [avatar, setAvatar] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/registration")
            return
        }

        fetch("https://b2b.printgrad.ru/api/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Ошибка получения данных")
                return res.json()
            })
            .then(data => setCurrentUser(data))
            .catch(err => {
                console.error(err)
                toast.error("Не удалось загрузить профиль")
                navigate("/registration")
            })
    }, [navigate])

    const handleAvatarChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAvatar(URL.createObjectURL(file))
        }
    }

    if (!currentUser) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }



    return (
        <div className="profile-new-layout">
            {/* Левая колонка */}
            <div className="profile-left">
                <UserCard user={currentUser}>
                    <Avatar name={currentUser.full_name} avatar={avatar} onChange={handleAvatarChange} />
                </UserCard>
                <ChatBlock />
            </div>
            {/* Правая колонка */}
            <div className="profile-right">
                <OrdersBlock count={5} />
                <MarketBlock count={12} />
                <AboutBlock about={currentUser.about} />
            </div>
        </div>
    )
}

Profile.displayName = "Profile"
export default Profile
