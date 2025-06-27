import React from "react"
import "./AboutBlock.css"

const AboutBlock = ({ about }) => (
    <div className="profile-about-block">
        <div className="about-title">О себе</div>
        <hr className="about-divider" />
        <div className="about-text">{about}</div>
    </div>
)

export default AboutBlock 