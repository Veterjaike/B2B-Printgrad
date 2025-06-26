import React from "react"
import "./UserCard.css"

const UserCard = ({ user, children }) => (
    <div className="profile-usercard">
        {children}
        <div className="profile-company">{user.company}</div>
        <div className="profile-status">{user.status}</div>
    </div>
)

export default UserCard 