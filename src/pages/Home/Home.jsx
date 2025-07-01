import React from "react"
import MainService from "../../components/home/MainService";
import ZaBiznes from "../../components/home/ZaBiznes";
import Portnair from "../../components/Portnair"
import HomeBanner from "../../components/home/HomeBanner"

export const Home = () => {
    return (
        <div className="home-content">
            <MainService />
            {/* <HomeBanner /> */}
            {/* <Portnair /> */}
            <ZaBiznes />
        </div>
    )
};

Home.displayName = "Home"
export default Home