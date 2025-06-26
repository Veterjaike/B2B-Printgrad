import React from "react";
import Marquee from "react-fast-marquee";
import "./Portnair.css"

const partners = [
    { src: "/images/logoPart/chizik.webp", alt: "chizik" },
    { src: "/images/logoPart/henderson.webp", alt: "henderson" },
    { src: "/images/logoPart/korzinka.webp", alt: "korzinka" },
    { src: "/images/logoPart/molvest.webp", alt: "molvest" },
    { src: "/images/logoPart/nahodka.webp", alt: "nahodka" },
    { src: "/images/logoPart/perekrestok.webp", alt: "perekrestok" },
    { src: "/images/logoPart/pyaterochka.webp", alt: "pyaterochka" },
    { src: "/images/logoPart/svetofor.webp", alt: "svetofor" },
    { src: "/images/logoPart/verny.webp", alt: "verny" },
    { src: "/images/logoPart/vkusvill.webp", alt: "vkusvill" },
];

export default function Portnair() {
    return (
        <div className="portairs">
            <div className="container">
                <h2 className="portnairs__text">Наши партнеры</h2>
                <Marquee pauseOnHover={true} gradient={false} speed={30} className="portnairs__list portnairs__list--infinite">
                    {partners.map((p, idx) => (
                        <img
                            className="portnairs__list-item-img"
                            src={p.src}
                            alt={p.alt}
                            width="320"
                            height="227"
                            key={idx}
                            style={{ marginRight: 32 }}
                        />
                    ))}
                </Marquee>
            </div>
        </div>
    )
};