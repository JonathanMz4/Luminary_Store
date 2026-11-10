import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { formatCurrency, formatCep } from '../../utils/formatters';
import styles from './Cart.module.scss';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    simulateFreight,
    coupon,
    freight,
    freightCep,
    subtotal,
    discount,
    total
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [cepInput, setCepInput] = useState(freightCep || '');
  const [freightMsg, setFreightMsg] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res);
  };

  const handleSimulateFreight = (e) => {
    e.preventDefault();
    if (!cepInput) return;
    const res = simulateFreight(cepInput);
    setCepInput(formatCep(cepInput));
    setFreightMsg(res);
  };

  if (cart.length === 0) {
    return (
      <div className={`container ${styles.cartPage}`}>
        <Breadcrumbs items={[{ label: 'Carrinho de Compras' }]} />
        <div className={styles.emptyState}>
          <div className={styles.iconBox}>
            <ShoppingBag size={40} />
          </div>
          <h2>Seu Carrinho Corporativo Está Vazio</h2>
          <p>Você ainda não selecionou nenhum hardware ou acessório. Explore nosso catálogo e encontre equipamentos de grau estúdio.</p>
          <Link to="/loja" className="btn btn--primary" style={{ padding: '0.85rem 2rem' }}>
            <ArrowLeft size={18} /> Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.cartPage}`}>
      <Breadcrumbs items={[{ label: 'Carrinho de Compras' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className={styles.title}>
          <ShoppingBag size={28} color="var(--accent-primary)" />
          Carrinho de Compras ({cart.length} itens)
        </h1>
        <button type="button" className="btn btn--ghost" onClick={clearCart} style={{ color: 'var(--color-error)' }}>
          <Trash2 size={16} /> Esvaziar Carrinho
        </button>
      </div>

      <div className={styles.grid}>
        {/* Lista de Itens */}
        <div className={styles.itemsList}>
          {cart.map((item) => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemInfo}>
                <img
                  src={item.imagem_principal || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                  alt={item.nome}
                />
                <div>
                  <Link to={`/produto/${item.slug || item.id}`}>
                    <h4>{item.nome}</h4>
                  </Link>
                  <span>Preço Unitário: {formatCurrency(item.preco)}</span>
                </div>
              </div>

              <div className={styles.qtyBox}>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                  disabled={item.quantidade <= 1}
                >
                  <Minus size={16} />
                </button>
                <span>{item.quantidade}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                  disabled={item.estoque && item.quantidade >= item.estoque}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className={styles.priceCol}>
                <strong>{formatCurrency(parseFloat(item.preco) * item.quantidade)}</strong>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.id)}
                  title="Remover Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo do Pedido */}
        <div className={styles.summaryBox}>
          <h3>Resumo Corporativo</h3>

          {/* Cupom */}
          <div className={styles.formGroup}>
            <label htmlFor="couponInput">
              <Tag size={14} style={{ display: 'inline', marginRight: '4px' }} /> Cupom de Desconto
            </label>
            {coupon ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #10b981' }}>
                <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>Cupom {coupon.code} ({coupon.discountPercent}%)</span>
                <button type="button" onClick={removeCoupon} style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>Remover</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon}>
                <input
                  id="couponInput"
                  type="text"
                  placeholder="Ex: LUMINARY10 ou VIP20"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button type="submit" className="btn btn--secondary">Aplicar</button>
              </form>
            )}
            {couponMsg && (
              <span style={{ fontSize: '0.8rem', color: couponMsg.sucesso ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                {couponMsg.mensagem}
              </span>
            )}
          </div>

          {/* Frete */}
          <div className={styles.formGroup}>
            <label htmlFor="cepInput">
              <Truck size={14} style={{ display: 'inline', marginRight: '4px' }} /> Calcular Frete & Prazo
            </label>
            <form onSubmit={handleSimulateFreight}>
              <input
                id="cepInput"
                type="text"
                placeholder="Seu CEP (8 dígitos)"
                maxLength={9}
                value={cepInput}
                onChange={(e) => setCepInput(e.target.value)}
              />
              <button type="submit" className="btn btn--secondary">Simular</button>
            </form>
            {freightMsg && (
              <span style={{ fontSize: '0.8rem', color: freightMsg.sucesso ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
                {freightMsg.mensagem}
              </span>
            )}
          </div>

          {/* Totais */}
          <div className={styles.totalsList}>
            <div className={styles.row}>
              <span>Subtotal dos Itens</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {coupon && (
              <div className={styles.row} style={{ color: 'var(--color-success)' }}>
                <span>Desconto ({coupon.code})</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className={styles.row}>
              <span>Frete Logístico</span>
              <span>{freight === 0 ? <strong style={{ color: 'var(--color-success)' }}>Grátis</strong> : formatCurrency(freight)}</span>
            </div>
            <div className={`${styles.row} ${styles['row--total']}`}>
              <span>Total Estimado</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn--primary"
            onClick={() => navigate('/checkout')}
            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
          >
            Finalizar Pedido Corporativo <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="var(--color-success)" />
            <span>Transação 100% segura e criptografada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
