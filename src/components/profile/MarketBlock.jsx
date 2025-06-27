import React from "react"
import "./MarketBlock.css"

const MarketBlock = ({ count }) => (
    <div className="profile-market-block">
        Новое на бирже <span className="orders-count">- {count} проекта за сутки</span>
    </div>
)

export default MarketBlock 