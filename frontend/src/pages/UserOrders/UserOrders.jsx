import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Loader from '../../components/Loader/Loader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import api from '../../services/api';
import styles from './UserOrders.module.scss';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/me');
        if (res.data.sucesso) {
          setOrders(res.data.pedidos);
        }
      } catch (err) {
        console.error('Erro ao buscar pedidos do usuário:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getStatusClass = (status) => {
    const st = status ? status.toLowerCase() : 'pendente';
    if (st.includes('aprovado')) return styles['statusBadge--aprovado'];
    if (st.includes('enviado')) return styles['statusBadge--enviado'];
    if (st.includes('entregue')) return styles['statusBadge--entregue'];
    if (st.includes('cancelado')) return styles['statusBadge--cancelado'];
    return styles['statusBadge--pendente'];
  };

  return (
    <div className={`container ${styles.ordersPage}`}>
      <Breadcrumbs items={[{ label: 'Meus Pedidos & Rastreamento' }]} />

      <h1 className={styles.title}>
        <Package size={28} color="var(--accent-primary)" />
        Meus Pedidos Corporativos
      </h1>

      {loading ? (
        <Loader text="Buscando histórico de aquisições..." />
      ) : orders.length > 0 ? (
        <div className={styles.list}>
          {orders.map((ord) => (
            <div key={ord.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <strong>Pedido #{ord.id}</strong>
                  <span><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> {formatDate(ord.data_pedido)}</span>
                </div>

                <span className={`${styles.statusBadge} ${getStatusClass(ord.status)}`}>
                  {ord.status || 'PENDENTE'}
                </span>
              </div>

              <div className={styles.orderBody}>
                <div className={styles.address}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    <MapPin size={16} color="var(--accent-primary)" /> Destino Logístico
                  </div>
                  {ord.endereco_entrega || 'Endereço registrado na conta corporativa.'}
                </div>

                <div className={styles.totalCol}>
                  <span>Total da Encomenda</span>
                  <strong>{formatCurrency(ord.total)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.iconBox}>
            <ShoppingBag size={36} />
          </div>
          <h2>Nenhum pedido corporativo encontrado</h2>
          <p>Você ainda não realizou nenhuma aquisição em nosso e-commerce de alta tecnologia.</p>
          <Link to="/loja" className="btn btn--primary" style={{ padding: '0.85rem 2rem' }}>
            Explorar Catálogo <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
