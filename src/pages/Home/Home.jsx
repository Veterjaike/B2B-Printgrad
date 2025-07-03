import React from "react"
import MainService from "../../components/home/MainService";
import ZaBiznes from "../../components/home/ZaBiznes";
import Steps from "../../components/home/Steps";
import Leaders from "../../components/home/Leaders";
import Horizons from "../../components/home/Horizons";

export const Home = () => {
    return (
        <div className="home-content">
            <MainService />
            <ZaBiznes />
            <Steps />
            <Leaders />
            <Horizons />
        </div>
    )
};

Home.displayName = "Home"
export default Home
