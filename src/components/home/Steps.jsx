import React, { useEffect, useRef, useState } from "react";
import "./Steps.css";
import BlockButton from "./BlockButton";

const StepBlock = ({ text, arrow, isVisible, delay, number }) => {
    return (
        <div className="steps__wrapper">
            <div className="steps__wrapper-circle">
                <span className="steps__number">{number}</span>
            </div>
            <span className="steps__wrapper-text">{text}</span>
            {arrow && (
                <img
                    className={`steps__wrapper-arrow ${arrow}`}
                    src={`/images/${arrow}.webp`}
                    alt="arrow"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                            ? 'translateX(-50%) scale(1)'
                            : 'translateX(-50%) scale(0.5)',
                        transition: `all 0.6s ease ${delay}ms`
                    }}
                    width={200}
                    height={70}
                />
            )}
        </div>
    );
};

const Steps = () => {
    const stepsRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        if (stepsRef.current) {
            observer.observe(stepsRef.current);
        }

        return () => {
            if (stepsRef.current) {
                observer.unobserve(stepsRef.current);
            }
        };
    }, []);

    return (
        <div className="steps" ref={stepsRef}>
            <div className="container">
                <StepBlock
                    text="Заполните профиль"
                    arrow="ArrowDown"
                    isVisible={isVisible}
                    delay={100}
                    number={1}
                />
                <StepBlock
                    text="Выберите проект"
                    arrow="ArrowUp"
                    isVisible={isVisible}
                    delay={300}
                    number={2}
                />
                <StepBlock
                    text="Пройдите отбор"
                    arrow="ArrowDown"
                    isVisible={isVisible}
                    delay={500}
                    number={3}
                />
                <StepBlock
                    text="Реализуйте проект"
                    arrow="ArrowUp"
                    isVisible={isVisible}
                    delay={700}
                    number={4}
                />
                <StepBlock
                    text="Получите вознаграждение"
                    arrow={null}
                    number={5}
                />
            </div>
            <BlockButton />
        </div>
    );
};

export default Steps;