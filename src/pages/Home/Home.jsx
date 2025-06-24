import React from "react"
import MainService from "../../components/MainService"
import Portnair from "../../components/Portnair"

export const Home = () => {
    return (
        <div className="home-content">
            <MainService />
            <Portnair />
        </div>
    )
};

Home.displayName = "Home"
export default Home