import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import './App.css';
import { Home, Profile } from './pages';

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
          <Route path="profile" element={<Profile />} />

        </Routes>
      </main>
    </>
  );
}

export default App;
