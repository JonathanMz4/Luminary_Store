import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Sun, Moon, Search, User, Menu, X, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlist } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menus ao navegar
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSearchResults([]);
    setSearchQuery('');
  }, [location.pathname]);

  // Busca instantânea (Autocomplete)
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await api.get(`/products?q=${encodeURIComponent(searchQuery)}&limit=5`);
        if (response.data.sucesso) {
          setSearchResults(response.data.produtos);
        }
      } catch (err) {
        console.error('Erro na busca instantânea:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/loja?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults([]);
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.nav}`}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>L</div>
          <span className={styles.logoText}><span>Luminary</span> Store</span>
        </Link>

        {/* Menu Principal */}
        <nav className={styles.menu}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
            Início
          </NavLink>
          <NavLink to="/sobre" className={({ isActive }) => (isActive ? styles.active : '')}>
            Sobre Nós
          </NavLink>
          <NavLink to="/loja" className={({ isActive }) => (isActive ? styles.active : '')}>
            Catálogo
          </NavLink>
          <NavLink to="/contato" className={({ isActive }) => (isActive ? styles.active : '')}>
            Contato
          </NavLink>
        </nav>

        {/* Busca Instantânea */}
        <div className={styles.searchContainer} ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Buscar produtos premium..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className={styles.searchIcon} size={18} />
          </form>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map((prod) => (
                <Link
                  key={prod.id}
                  to={`/produto/${prod.slug || prod.id}`}
                  className={styles.searchResultItem}
                >
                  <img src={prod.imagem_principal || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'} alt={prod.nome} />
                  <div className={styles.itemInfo}>
                    <strong>{prod.nome}</strong>
                    <span>{formatCurrency(prod.preco)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Ações (Tema, Wishlist, Carrinho, Usuário) */}
        <div className={styles.actions}>
          {/* Theme Toggle */}
          <button
            type="button"
            className={styles.actionBtn}
            onClick={toggleTheme}
            title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
            aria-label="Alternar Tema"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Wishlist */}
          <Link to="/favoritos" className={styles.actionBtn} title="Lista de Desejos" aria-label="Lista de Desejos">
            <Heart size={20} className={wishlist.length > 0 ? styles.heartActive : ''} />
            {wishlist.length > 0 && <span className={styles.badgeCount}>{wishlist.length}</span>}
          </Link>

          {/* Carrinho */}
          <Link to="/carrinho" className={styles.actionBtn} title="Carrinho de Compras" aria-label="Carrinho">
            <ShoppingBag size={20} />
            {totalItemsCount > 0 && <span className={styles.badgeCount}>{totalItemsCount}</span>}
          </Link>

          {/* User Account / Admin (Hidden on Mobile) */}
          <div className={`${styles.userMenu} ${styles.hideMobile}`}>
            {isAuthenticated ? (
              <button
                type="button"
                className={styles.userBtn}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <User size={18} />
                <span>{user?.nome?.split(' ')[0] || 'Usuário'}</span>
                <ChevronDown size={14} />
              </button>
            ) : (
              <Link to="/login" className="btn btn--primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <User size={16} /> Entrar
              </Link>
            )}

            {/* Dropdown do Usuário */}
            {userDropdownOpen && isAuthenticated && (
              <div className={styles.dropdown}>
                {isAdmin && (
                  <Link to="/admin">
                    <Shield size={16} color="var(--accent-primary)" />
                    <strong>Painel Admin</strong>
                  </Link>
                )}
                <Link to="/pedidos">
                  <ShoppingBag size={16} />
                  <span>Meus Pedidos</span>
                </Link>
                <Link to="/perfil">
                  <User size={16} />
                  <span>Meu Perfil</span>
                </Link>
                <div className={styles.divider} />
                <button type="button" onClick={logout} style={{ color: 'var(--color-error)' }}>
                  <LogOut size={16} />
                  <span>Sair da Conta</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.mobileToggle}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu Mobile"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Lateral */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar produtos..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className={styles.searchIcon} size={18} />
          </form>
          <Link to="/">Início</Link>
          <Link to="/sobre">Sobre Nós</Link>
          <Link to="/loja">Catálogo</Link>
          <Link to="/contato">Contato</Link>
          
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
          
          {!isAuthenticated ? (
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Entrar / Login</Link>
          ) : (
            <>
              <Link to="/perfil">Meu Perfil</Link>
              <Link to="/pedidos">Meus Pedidos</Link>
              {isAdmin && <Link to="/admin" style={{ color: 'var(--accent-primary)' }}>Painel Admin</Link>}
              <button type="button" onClick={logout} style={{ color: 'var(--color-error)', background: 'transparent', border: 'none', padding: '0.5rem 0', fontSize: '1.25rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer' }}>
                Sair da Conta
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
