import React from "react";
import "./Portnair.css"

export default function Portnair() {
    return (
        <div className="portairs">
            <div className="container">
                <h2 className="portnairs__text">Наши партнеры</h2>
                <ul className="portnairs__list">
                    <li className="portnairs__list-item">
                        <img className="portnairs__list-item-img" src="/src/images/logoPart/chizik.webp" alt="chizik" width={'320'} height={'227'} />
                    </li>
                    <li className="portnairs__list-item">
                        <img className="portnairs__list-item-img" src="/src/images/logoPart/henderson.webp" alt="henderson" width={'320'} height={'227'} />
                    </li>
                    <li className="portnairs__list-item">
                        <img className="portnairs__list-item-img" src="/src/images/logoPart/korzinka.webp" alt="korzinka" width={'320'} height={'227'} />
                    </li>
                    <li className="portnairs__list-item">
                        <img className="portnairs__list-item-img" src="/src/images/logoPart/molvest.webp" alt="molvest" width={'320'} height={'227'} />
                    </li>
                    <li className="portnairs__list-item">
                        <img className="portnairs__list-item-img" src="/src/images/logoPart/nahodka.webp" alt="nahodka" width={'320'} height={'227'} />
                    </li>
                    <li className="portnairs__list-item">
                        <img className="portnairs__list-item-img" src="/src/images/logoPart/perekrestok.webp" alt="perekrestok" width={'320'} height={'227'} />
                    </li>
                    <li className="portnairs__list-item">
                        <img className="portnairs__list-item-img" src="/src/images/logoPart/pyaterochka.webp" alt="pyaterochka" width={'320'} height={'227'} />
                    </li>
                    <li className="portnairs__list-item">
                        <img className="portnairs__list-item-img" src="/src/images/logoPart/svetofor.webp" alt="svetofor" width={'320'} height={'227'} />
                    </li>
                    <li className="portnairs__list-item">
                        <img className="portnairs__list-item-img" src="/src/images/logoPart/verny.webp" alt="verny" width={'320'} height={'227'} />
                    </li>
                    <li className="portnairs__list-item">
                        <img className="portnairs__list-item-img" src="/src/images/logoPart/vkusvill.webp" alt="vkusvill" width={'320'} height={'227'} />
                    </li>
                </ul>
            </div>
        </div>
    )
};