import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Core UI Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp/FloatingWhatsApp';
import CookiesBanner from './components/CookiesBanner/CookiesBanner';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

// Pages
import Home from './pages/Home/Home';
import Store from './pages/Store/Store';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import UserOrders from './pages/UserOrders/UserOrders';
import WishlistPage from './pages/WishlistPage/WishlistPage';

// 404 Fallback Component
const NotFound = () => (
  <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AlertTriangle size={40} />
    </div>
    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Página 404 Não Encontrada</h1>
    <p style={{ color: 'var(--text-secondary)', maxWidth: '450px' }}>O endereço que você tentou acessar não está disponível ou foi movido para outro setor logístico.</p>
    <Link to="/" className="btn btn--primary" style={{ padding: '0.85rem 2.25rem' }}>
      <ArrowLeft size={18} /> Voltar à Página Inicial
    </Link>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <ScrollToTop />
              <div className="app-layout">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/loja" element={<Store />} />
                    <Route path="/produto/:slug" element={<ProductDetail />} />
                    <Route path="/carrinho" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/contato" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/pedidos" element={<UserOrders />} />
                    <Route path="/favoritos" element={<WishlistPage />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </main>
                <Footer />
                <FloatingWhatsApp />
                <CookiesBanner />
              </div>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
