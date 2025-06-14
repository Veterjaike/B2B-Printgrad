// App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Tasks from './pages/Tasks.jsx';
import About from './pages/About.jsx';
import Registration from './pages/Registration.jsx';
import Login from './pages/Login.jsx';
import './App.css'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <header className="header">
        <div className="container">
          <div className="header__inner">
            <Link className="header__logo" to="/">Принтград-work</Link>
            <div className="header__inner-wrapper">
              <ul className="header__nav">
                <li className="header__nav-item"><Link className="header__nav-item-link" to="/tasks">Просмотреть задачи</Link></li>
                <li className="header__nav-item"><Link className="header__nav-item-link" to="/about">О нас</Link></li>
                <li className="header__nav-item"><Link className="header__nav-item-link" to="/login">Войти в кабинет</Link></li>
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
