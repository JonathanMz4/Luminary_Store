import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useWishlist } from '../../context/WishlistContext';
import styles from './WishlistPage.module.scss';

const WishlistPage = () => {
  const { wishlist, clearWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (wishlist.length === 0) {
    return (
      <div className={`container ${styles.wishlistPage}`}>
        <Breadcrumbs items={[{ label: 'Lista de Desejos' }]} />
        <div className={styles.emptyState}>
          <div className={styles.iconBox}>
            <Heart size={36} />
          </div>
          <h2>Sua Lista de Desejos Está Vazia</h2>
          <p>Você ainda não marcou nenhum produto como favorito. Explore nosso catálogo de alta performance e salve seus itens preferidos.</p>
          <Link to="/loja" className="btn btn--primary" style={{ padding: '0.85rem 2rem' }}>
            Explorar Catálogo <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.wishlistPage}`}>
      <Breadcrumbs items={[{ label: 'Lista de Desejos' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className={styles.title}>
          <Heart size={28} color="#ef4444" fill="#ef4444" />
          Meus Itens Favoritos ({wishlist.length})
        </h1>
        <button type="button" className="btn btn--ghost" onClick={clearWishlist} style={{ color: 'var(--color-error)' }}>
          <Trash2 size={16} /> Limpar Lista
        </button>
      </div>

      <div className="grid-catalog">
        {wishlist.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
