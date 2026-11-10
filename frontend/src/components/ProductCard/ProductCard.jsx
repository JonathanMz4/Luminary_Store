import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatters';
import styles from './ProductCard.module.scss';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const inWishlist = isInWishlist(product.id);

  const discountPercent = product.preco_antigo && parseFloat(product.preco_antigo) > parseFloat(product.preco)
    ? Math.round(((parseFloat(product.preco_antigo) - parseFloat(product.preco)) / parseFloat(product.preco_antigo)) * 100)
    : 0;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Imagem do Produto com Zoom no Hover */}
      <div className={styles.imageWrapper}>
        <Link to={`/produto/${product.slug || product.id}`}>
          <img
            src={product.imagem_principal || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'}
            alt={product.nome}
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className={styles.badges}>
          {product.destaque === 1 && <span className="badge badge--primary">Destaque</span>}
          {product.lancamento === 1 && <span className="badge badge--success">Novo</span>}
          {discountPercent > 0 && <span className="badge badge--error">-{discountPercent}%</span>}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`${styles.wishlistBtn} ${inWishlist ? styles['wishlistBtn--active'] : ''}`}
          onClick={() => toggleWishlist(product)}
          title={inWishlist ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
          aria-label="Lista de Desejos"
        >
          <Heart size={18} fill={inWishlist ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Conteúdo */}
      <div className={styles.content}>
        <span className={styles.category}>{product.categoria_nome || 'Áudio & Tech'}</span>
        
        <Link to={`/produto/${product.slug || product.id}`}>
          <h3 className={styles.title}>{product.nome}</h3>
        </Link>

        <p className={styles.shortDesc}>
          {product.descricao_curta || 'Design ergonômico em alumínio usinado com alta fidelidade e conectividade otimizada.'}
        </p>

        {/* Preço */}
        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatCurrency(product.preco)}</span>
          {product.preco_antigo && parseFloat(product.preco_antigo) > parseFloat(product.preco) && (
            <span className={styles.oldPrice}>{formatCurrency(product.preco_antigo)}</span>
          )}
        </div>

        {/* Ações */}
        <div className={styles.actions}>
          <Link
            to={`/produto/${product.slug || product.id}`}
            className="btn btn--secondary"
            title="Ver Detalhes do Produto"
          >
            <Eye size={16} /> Ver
          </Link>

          <button
            type="button"
            className={`btn ${added ? 'btn--secondary' : 'btn--primary'}`}
            onClick={handleAddToCart}
            disabled={added || product.estoque <= 0}
            style={added ? { background: 'var(--color-success)', color: '#fff', borderColor: 'transparent' } : {}}
          >
            {added ? (
              <>
                <Check size={16} /> Adicionado
              </>
            ) : product.estoque <= 0 ? (
              'Esgotado'
            ) : (
              <>
                <ShoppingBag size={16} /> Comprar
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
