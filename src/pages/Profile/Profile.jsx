import React, { useState } from "react"
import users from "../../data/users"
import "./Profile.css"
import Avatar from "../../components/profile/Avatar"
import UserCard from "../../components/profile/UserCard"
import OrdersBlock from "../../components/profile/OrdersBlock"
import MarketBlock from "../../components/profile/MarketBlock"
import AboutBlock from "../../components/profile/AboutBlock"
import ChatBlock from "../../components/profile/ChatBlock"


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
            {/* Левая колонка */}
            <div className="profile-left">
                <UserCard user={currentUser}>
                    <Avatar name={currentUser.name} />
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