import React from "react"
import MainService from "../../components/MainService"
import Portnair from "../../components/Portnair"
import HomeBanner from "../../components/home/HomeBanner"

export const Home = () => {
    return (
        <div className="home-content">
            <MainService />
            <HomeBanner />
            <Portnair />
        </div>
    )
};

Home.displayName = "Home"
export default Home