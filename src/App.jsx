import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './pages/RegPage/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Header from './components/Header';
import { ChatProvider } from './components/Chat/ChatContext';
import './App.css';
import { Home, Profile } from './pages';
import Footer from './components/Footer';
import Orders from './pages/Orders/Orders';
import RegPage from './pages/RegPage/RegPage';
import MyOrders from './pages/MyOrders/MyOrders';
import CreateOrder from './pages/CreateOrder/CreateOrder';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import OrderDetails from './components/OrderDetails';

function App() {
  const location = useLocation();
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => setFade(true), 50);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <ChatProvider>
      <Header />
      <main className={`page-transition ${fade ? 'fade-in' : 'fade-out'}`}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />

          {/* 🔐 Общие защищённые маршруты */}
          <Route element={<ProtectedRoute />}>
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="myorders" element={<MyOrders />} />
            <Route path="create-order" element={<CreateOrder />} />
            <Route path="orders/:id" element={<OrderDetails />} />
          </Route>

          {/* 🔐 Только для admin/moderator */}
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminPanel />} />
          </Route>

          <Route path="registration" element={<RegPage />} />
        </Routes>
      </main>
      <Footer />
    </ChatProvider>
  );
}

export default App;
