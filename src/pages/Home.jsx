import React from "react"
import '../components/Header.css'
import MainService from "../components/MainService"
import Portnair from "../components/Portnair"

export default function Home() {
    return (
        <div className="home-content">
            <MainService />
            <Portnair />
        </div>
    )
};