import React from "react"
import "./OrdersBlock.css"

const OrdersBlock = ({ count }) => (
    <div className="profile-orders-block">
        Мои заказы <span className="orders-count">- {count}</span>
    </div>
)

export default OrdersBlock 