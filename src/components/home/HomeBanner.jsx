import React, { useEffect, useRef, useState } from "react"
import "./HomeBanner.css"

const animatedPhrases = [
  "перейти на новый уровень сервиса",
  "преумножить уровень доходов",
  "достичь успеха в развитии бизнеса"
]

const TypingEffect = () => {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [blink, setBlink] = useState(true)
  const typingSpeed = isDeleting ? 30 : 70
  const pauseAfterTyping = 1200
  const pauseAfterDeleting = 400

  useEffect(() => {
    let timeout
    if (!isDeleting && displayed.length < animatedPhrases[index].length) {
      timeout = setTimeout(() => {
        setDisplayed(animatedPhrases[index].slice(0, displayed.length + 1))
      }, typingSpeed)
    } else if (!isDeleting && displayed.length === animatedPhrases[index].length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseAfterTyping)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(animatedPhrases[index].slice(0, displayed.length - 1))
      }, typingSpeed)
    } else if (isDeleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setIndex((index + 1) % animatedPhrases.length)
      }, pauseAfterDeleting)
    }
    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, index])

  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink(b => !b), 500)
    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <span className="typing-effect">
      {displayed}
      <span className={`typing-cursor${blink ? " typing-cursor--blink" : ""}`}>|</span>
    </span>
  )
}

const HomeBanner = () => (
  <div className="home-banner">
    <div className="home-banner-bg" />
    <div className="home-banner-content">
      <div>
        <h1 className="home-banner-title">
          Ведущая компания на<br />рынке сервисных ИТ - <br />услуг
        </h1>
        <div className="home-banner-subtitle">
          Комплексное обслуживание ИТ-инфраструктуры. Помогаем своим <br />
          <span className="home-banner-clients">клиентам <div className="home-banner-typing-row"><TypingEffect /></div></span>
        </div>
      </div>
    </div>
  </div>
)

export default HomeBanner 