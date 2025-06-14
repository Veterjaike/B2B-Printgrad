// App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Tasks from './pages/Tasks.jsx';
import About from './pages/About.jsx';
import Registration from './pages/Registration.jsx';
import Login from './pages/Login.jsx';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <header class="header">
        <div class="container">
          <div class="header__inner">
            <Link className="header__logo" to="/">Принтград</Link>
            <div class="header__inner-wrapper">
              <ul class="header__nav">
                <li class="header__naw-item"><Link className="header__naw-item-link" to="/tasks">Просмотреть задачи</Link></li>
                <li class="header__naw-item"><Link className="header__naw-item-link" to="/about">О нас</Link></li>
                <li class="header__naw-item"><Link className="header__naw-item-link" to="/login">Войти в кабинет</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
