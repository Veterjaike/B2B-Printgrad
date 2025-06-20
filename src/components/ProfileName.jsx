import React from "react";
import users from "../data/users";
import "./ProfileName.css"

export default function Profile() {
    const currentUser = users[1]; // как будто залогинился первый

    return (
        <div className="profile-name">
            <div className="container">
                <h1 className="profile-name__heading">Мой профиль</h1>
                <div className="profile-name__wrapper">
                    <p className="profile-name__user"><strong>Имя:</strong> {currentUser.name}</p>
                    <p className="profile-name__user"><strong>Email:</strong> {currentUser.email}</p>
                    <p className="profile-name__user"><strong>Роль:</strong> {currentUser.role}</p>
                </div>
            </div>
        </div>
    );
}
