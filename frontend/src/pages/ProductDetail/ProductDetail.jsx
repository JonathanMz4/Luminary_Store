import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Truck, ShieldCheck, Check, Plus, Minus, ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ProductCard from '../../components/ProductCard/ProductCard';
import Loader from '../../components/Loader/Loader';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency, formatCep } from '../../utils/formatters';
import api from '../../services/api';
import styles from './ProductDetail.module.scss';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('desc');
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  // Frete simulação no card
  const [cep, setCep] = useState('');
  const [freightResult, setFreightResult] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.sucesso) {
          const prod = res.data.produto;
          setProduct(prod);
          setSelectedImage(prod.imagem_principal);

          // Buscar produtos relacionados da mesma categoria
          if (prod.categoria_slug) {
            const relRes = await api.get(`/products?categoria=${prod.categoria_slug}&limit=4`);
            if (relRes.data.sucesso) {
              setRelated(relRes.data.produtos.filter(p => p.id !== prod.id));
            }
          }
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes do produto:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return <div className="container"><Loader text="Carregando especificações de grau estúdio..." /></div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Produto não encontrado</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>O item corporativo que você tentou acessar não existe ou foi arquivado.</p>
        <Link to="/loja" className="btn btn--primary"><ArrowLeft size={16} /> Voltar ao Catálogo</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const imagesList = [product.imagem_principal, ...(product.imagens_adicionais || [])].filter(Boolean);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/carrinho');
  };

  const handleSimulateFreight = (e) => {
    e.preventDefault();
    const clean = cep.replace(/\D/g, '');
    if (clean.length < 8) {
      setFreightResult({ error: true, text: 'Digite um CEP válido com 8 dígitos.' });
      return;
    }
    setCep(formatCep(cep));
    const last = parseInt(clean[7], 10) || 0;
    if (parseFloat(product.preco) >= 999) {
      setFreightResult({ error: false, text: '🎉 Frete Grátis Expresso — Prazo corporativo: 2 a 3 dias úteis.' });
    } else {
      const val = 14.90 + (last * 1.5);
      setFreightResult({ error: false, text: `Frete SEDEX Simulado: R$ ${val.toFixed(2)} — Prazo: 3 a 5 dias úteis.` });
    }
  };

  return (
    <div className={`container ${styles.detailPage}`}>
      <Breadcrumbs
        items={[
          { label: 'Catálogo', path: '/loja' },
          { label: product.categoria_nome || 'Equipamentos', path: `/loja?categoria=${product.categoria_slug || ''}` },
          { label: product.nome }
        ]}
      />

      <div className={styles.mainSection}>
        {/* Galeria de Imagens */}
        <div className={styles.gallery}>
          {imagesList.length > 1 && (
            <div className={styles.thumbnails}>
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={selectedImage === imgUrl ? styles.active : ''}
                  onClick={() => setSelectedImage(imgUrl)}
                >
                  <img src={imgUrl} alt={`${product.nome} - miniatura ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}

          <div className={styles.mainImageWrapper}>
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
              alt={product.nome}
            />
            <button
              type="button"
              className={`${styles.wishlistFloat} ${inWishlist ? styles['wishlistFloat--active'] : ''}`}
              onClick={() => toggleWishlist(product)}
              title={inWishlist ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
            >
              <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} />
            </button>
          </div>
        </div>

        {/* Informações de Compra */}
        <div className={styles.info}>
          <div>
            <span className={styles.categoryBadge}>{product.categoria_nome || 'Áudio & Tech Enterprise'}</span>
            <h1>{product.nome}</h1>
          </div>

          <div className={styles.priceBox}>
            <span className={styles.currentPrice}>{formatCurrency(product.preco)}</span>
            {product.preco_antigo && parseFloat(product.preco_antigo) > parseFloat(product.preco) && (
              <span className={styles.oldPrice}>{formatCurrency(product.preco_antigo)}</span>
            )}
          </div>

          <p className={styles.shortDesc}>
            {product.descricao_curta || 'Construção ultra-robusta com tolerância zero para falhas na operação diária. Conectividade de ponta com baixa latência e acabamento em alumínio anodizado.'}
          </p>

          <div className={`${styles.stockStatus} ${product.estoque > 0 ? styles['stockStatus--in'] : styles['stockStatus--out']}`}>
            <Check size={18} />
            <span>{product.estoque > 0 ? `Estoque Disponível (${product.estoque} unidades no centro logístico)` : 'Produto Temporariamente Esgotado'}</span>
          </div>

          {/* Controles de Quantidade e Comprar */}
          {product.estoque > 0 && (
            <div className={styles.actionControls}>
              <div className={styles.qtySelector}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.estoque, quantity + 1))}
                  disabled={quantity >= product.estoque}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className={styles.buttonsGroup}>
                <button
                  type="button"
                  className={`btn ${addedToast ? 'btn--secondary' : 'btn--outline'}`}
                  onClick={handleAddToCart}
                  style={addedToast ? { background: 'var(--color-success)', color: '#fff', borderColor: 'transparent' } : {}}
                >
                  {addedToast ? <><Check size={16} /> Adicionado</> : <><ShoppingBag size={16} /> Adicionar</>}
                </button>

                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleBuyNow}
                >
                  Comprar Agora
                </button>
              </div>
            </div>
          )}

          {/* Simulação de Frete Rápido */}
          <div className={styles.freightBox}>
            <h4>
              <Truck size={18} color="var(--accent-primary)" />
              Simular Prazo de Entrega Corporativo
            </h4>
            <form onSubmit={handleSimulateFreight}>
              <input
                type="text"
                placeholder="Seu CEP (apenas números)"
                maxLength={9}
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
              <button type="submit" className="btn btn--secondary">Calcular</button>
            </form>
            {freightResult && (
              <span style={{ fontSize: '0.85rem', color: freightResult.error ? 'var(--color-error)' : 'var(--color-success)', fontWeight: 600 }}>
                {freightResult.text}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Garantia Pro 2 Anos</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><Truck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Troca Expressa sem Custo</span>
          </div>
        </div>
      </div>

      {/* Especificações e Descrição Completa */}
      <div className={styles.tabsSection}>
        <div className={styles.tabButtons}>
          <button
            type="button"
            className={activeTab === 'desc' ? styles.active : ''}
            onClick={() => setActiveTab('desc')}
          >
            Descrição Detalhada
          </button>
          <button
            type="button"
            className={activeTab === 'specs' ? styles.active : ''}
            onClick={() => setActiveTab('specs')}
          >
            Especificações Técnicas
          </button>
        </div>

        {activeTab === 'desc' ? (
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p>{product.descricao_completa || product.descricao_curta || 'Este equipamento representa o ápice da engenharia moderna na Luminary Store. Desenvolvido em colaboração com especialistas de TI, estúdios de design e engenheiros acústicos, oferece estabilidade ininterrupta mesmo sob cargas severas de trabalho corporativo.'}</p>
          </div>
        ) : (
          <table className={styles.specsTable}>
            <tbody>
              {product.especificacoes && Object.keys(product.especificacoes).length > 0 ? (
                Object.entries(product.especificacoes).map(([key, val], idx) => (
                  <tr key={idx}>
                    <th>{key}</th>
                    <td>{typeof val === 'object' ? JSON.stringify(val) : String(val)}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr><th>Material do Chassi</th><td>Alumínio Anodizado & Liga de Titânio</td></tr>
                  <tr><th>Conectividade</th><td>USB-C Thunderbolt 4 / Bluetooth 5.3 Low Energy</td></tr>
                  <tr><th>Compatibilidade</th><td>macOS, Windows 11, Linux Enterprise, iPadOS</td></tr>
                  <tr><th>Garantia no Brasil</th><td>24 Meses com Atendimento On-Site / Troca Expressa</td></tr>
                </>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Produtos Relacionados */}
      {related.length > 0 && (
        <section>
          <div className="section-header" style={{ textAlign: 'left', margin: '0 0 2rem 0' }}>
            <h2>Você Também Pode Gostar</h2>
            <p>Outras soluções compatíveis com o seu setup corporativo.</p>
          </div>
          <div className="grid-catalog">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
