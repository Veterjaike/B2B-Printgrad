import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import './App.css';

function App() {
  const location = useLocation();
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main className={`page-transition ${fade ? 'fade-in' : 'fade-out'}`}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          {/* Добавь другие страницы здесь */}
        </Routes>
      </main>
    </>
  );
}

export default App;
