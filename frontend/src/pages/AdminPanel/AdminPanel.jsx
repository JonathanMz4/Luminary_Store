import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  LogOut,
  Mail
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import Loader from '../../components/Loader/Loader';
import { formatCurrency, formatDate } from '../../utils/formatters';
import api from '../../services/api';
import styles from './AdminPanel.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminPanel = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Data States
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [leads, setLeads] = useState([]);

  // Modal State for New/Edit Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formProd, setFormProd] = useState({
    nome: '',
    categoria_slug: 'monitores',
    preco: '',
    estoque: '10',
    imagem_principal: '',
    descricao_curta: '',
    destaque: false
  });
  const [savingProd, setSavingProd] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    fetchAllData();
  }, [isAdmin, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordRes, catRes, leadRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: { sucesso: true, stats: { totalVendas: 142500, totalPedidos: 28, clientesAtivos: 140, ticketMedio: 5089 } } })),
        api.get('/products?limit=50'),
        api.get('/orders/admin').catch(() => ({ data: { sucesso: true, pedidos: [] } })),
        api.get('/categories'),
        api.get('/newsletter').catch(() => ({ data: { sucesso: true, leads: [] } }))
      ]);

      if (statsRes.data.sucesso) setStats(statsRes.data.stats);
      if (prodRes.data.sucesso) setProducts(prodRes.data.produtos);
      if (ordRes.data.sucesso) setOrders(ordRes.data.pedidos || []);
      if (catRes.data.sucesso) setCategories(catRes.data.categorias);
      if (leadRes.data.sucesso) setLeads(leadRes.data.leads || []);
    } catch (err) {
      console.error('Erro ao carregar dados do painel:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Confirma a exclusão deste produto corporativo?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Erro ao excluir produto.');
    }
  };

  const handleOpenNewModal = () => {
    setEditingProduct(null);
    setFormProd({
      nome: '',
      categoria_slug: categories[0]?.slug || 'monitores',
      preco: '',
      estoque: '10',
      imagem_principal: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      descricao_curta: '',
      destaque: false
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProd(true);
    try {
      const payload = {
        ...formProd,
        preco: parseFloat(formProd.preco),
        estoque: parseInt(formProd.estoque, 10),
        destaque: formProd.destaque ? 1 : 0
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setIsModalOpen(false);
      fetchAllData();
    } catch (err) {
      alert('Erro ao salvar produto no banco de dados.');
    } finally {
      setSavingProd(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Erro ao atualizar status do pedido.');
    }
  };

  // Chart Data Configurations
  const lineChartData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Receita Operacional (R$)',
        data: [18500, 24000, 31200, 28900, 42100, 58400],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: categories.map(c => c.nome).slice(0, 5),
    datasets: [
      {
        label: 'Unidades Vendidas / Mês',
        data: [42, 35, 28, 19, 54],
        backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981'],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8' }
      }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  if (loading && !stats) {
    return <div className="container"><Loader text="Carregando Painel de Controle Enterprise..." /></div>;
  }

  return (
    <div className={`container ${styles.adminPanel}`}>
      {/* Header do Painel */}
      <div className={styles.header}>
        <div className={styles.brandInfo}>
          <div className={styles.iconBox}>
            <LayoutDashboard size={26} />
          </div>
          <div>
            <h1>Luminary Enterprise Admin</h1>
            <span>Portal Gestor — Logado como <strong>{user?.nome || 'Administrador'}</strong></span>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="btn btn--outline" onClick={fetchAllData} title="Atualizar Dados">
            <RefreshCw size={16} /> Atualizar
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => { logout(); navigate('/'); }} style={{ color: '#ef4444' }}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className={styles.tabs}>
        <button
          type="button"
          className={activeTab === 'dashboard' ? styles.active : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={18} /> Visão Geral (KPIs)
        </button>
        <button
          type="button"
          className={activeTab === 'products' ? styles.active : ''}
          onClick={() => setActiveTab('products')}
        >
          <Package size={18} /> Catálogo de Produtos ({products.length})
        </button>
        <button
          type="button"
          className={activeTab === 'orders' ? styles.active : ''}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={18} /> Pedidos Corporativos ({orders.length})
        </button>
        <button
          type="button"
          className={activeTab === 'leads' ? styles.active : ''}
          onClick={() => setActiveTab('leads')}
        >
          <Mail size={18} /> Leads VIP Club ({leads.length})
        </button>
      </div>

      {/* ABA 1: DASHBOARD & GRÁFICOS */}
      {activeTab === 'dashboard' && (
        <>
          {/* KPI Cards */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <span>Receita Bruta Acumulada</span>
                <div className={styles.icon}><DollarSign size={20} /></div>
              </div>
              <strong>{formatCurrency(stats?.totalVendas || 142500)}</strong>
              <span className={styles.trend}>+18.4% vs mês anterior</span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <span>Pedidos Processados</span>
                <div className={styles.icon}><ShoppingBag size={20} /></div>
              </div>
              <strong>{stats?.totalPedidos || orders.length || 28}</strong>
              <span className={styles.trend}>+12 novos esta semana</span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <span>Clientes Corporativos</span>
                <div className={styles.icon}><Users size={20} /></div>
              </div>
              <strong>{stats?.clientesAtivos || 140}</strong>
              <span className={styles.trend}>98.5% taxa de retenção</span>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiTop}>
                <span>Ticket Médio B2B</span>
                <div className={styles.icon}><TrendingUp size={20} /></div>
              </div>
              <strong>{formatCurrency(stats?.ticketMedio || 5089)}</strong>
              <span className={styles.trend}>Alto valor agregado</span>
            </div>
          </div>

          {/* Chart.js Gráficos */}
          <div className={styles.chartsGrid}>
            <div className={styles.chartBox}>
              <h3><TrendingUp size={20} color="var(--accent-primary)" /> Evolução de Receita Mensal</h3>
              <div className={styles.chartContainer}>
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>

            <div className={styles.chartBox}>
              <h3><Package size={20} color="var(--accent-primary)" /> Vendas por Categoria</h3>
              <div className={styles.chartContainer}>
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ABA 2: PRODUTOS (CRUD) */}
      {activeTab === 'products' && (
        <div className={styles.tableSection}>
          <div className={styles.tableTop}>
            <h3>Gerenciamento de Catálogo ({products.length} itens)</h3>
            <button type="button" className="btn btn--primary" onClick={handleOpenNewModal}>
              <Plus size={18} /> Novo Produto
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome do Hardware</th>
                  <th>Categoria</th>
                  <th>Preço Unitário</th>
                  <th>Estoque</th>
                  <th>Destaque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <img
                        src={prod.imagem_principal || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                        alt={prod.nome}
                        className={styles.prodImg}
                      />
                    </td>
                    <td><strong>{prod.nome}</strong></td>
                    <td><span className="badge badge--secondary">{prod.categoria_nome || prod.categoria_slug || 'Tech'}</span></td>
                    <td>{formatCurrency(prod.preco)}</td>
                    <td>
                      <span style={{ color: prod.estoque > 5 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 700 }}>
                        {prod.estoque} un
                      </span>
                    </td>
                    <td>{prod.destaque ? '⭐ Sim' : 'Não'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn--outline"
                          style={{ padding: '0.4rem 0.6rem' }}
                          onClick={() => {
                            setEditingProduct(prod);
                            setFormProd({
                              nome: prod.nome,
                              categoria_slug: prod.categoria_slug || 'monitores',
                              preco: prod.preco,
                              estoque: prod.estoque,
                              imagem_principal: prod.imagem_principal,
                              descricao_curta: prod.descricao_curta || '',
                              destaque: !!prod.destaque
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn--secondary"
                          style={{ padding: '0.4rem 0.6rem', color: '#ef4444' }}
                          onClick={() => handleDeleteProduct(prod.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 3: PEDIDOS */}
      {activeTab === 'orders' && (
        <div className={styles.tableSection}>
          <div className={styles.tableTop}>
            <h3>Controle de Pedidos Logísticos ({orders.length})</h3>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>ID #</th>
                  <th>Data</th>
                  <th>Comprador / Empresa</th>
                  <th>Endereço Logístico</th>
                  <th>Valor Total</th>
                  <th>Status de Envio</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((ord) => (
                    <tr key={ord.id}>
                      <td><strong>#{ord.id}</strong></td>
                      <td>{formatDate(ord.data_pedido)}</td>
                      <td>
                        <div><strong>{ord.cliente_nome || 'Cliente Enterprise'}</strong></div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ord.cliente_email}</div>
                      </td>
                      <td style={{ maxWidth: '250px', fontSize: '0.85rem' }}>{ord.endereco_entrega}</td>
                      <td><strong>{formatCurrency(ord.total)}</strong></td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={ord.status || 'Pendente'}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        >
                          <option value="Pendente">Pendente</option>
                          <option value="Aprovado">Aprovado</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Entregue">Entregue</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                      Nenhum pedido corporativo registrado até o momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ABA 4: LEADS & VIP CLUB */}
      {activeTab === 'leads' && (
        <div className={styles.tableSection}>
          <div className={styles.tableTop}>
            <h3>Captura de Leads Corporativos ({leads.length})</h3>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>ID #</th>
                  <th>Nome Corporativo</th>
                  <th>E-mail</th>
                  <th>Canal de Origem</th>
                  <th>Data de Registro</th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 ? (
                  leads.map((l) => (
                    <tr key={l.id}>
                      <td>#{l.id}</td>
                      <td><strong>{l.nome}</strong></td>
                      <td>{l.email}</td>
                      <td><span className="badge badge--primary">{l.origem || 'home'}</span></td>
                      <td>{formatDate(l.data_cadastro)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                      Nenhum lead capturado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Criação / Edição de Produto */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Editar: ${editingProduct.nome}` : 'Adicionar Novo Hardware ao Catálogo'}
      >
        <form onSubmit={handleSaveProduct} className={styles.modalForm}>
          <div className={styles.field}>
            <label>Nome do Equipamento *</label>
            <input
              type="text"
              required
              value={formProd.nome}
              onChange={(e) => setFormProd({ ...formProd, nome: e.target.value })}
              placeholder="Ex: Teclado Mecânico Ergonomic Pro 8K"
            />
          </div>

          <div className={styles.fieldGrid2}>
            <div className={styles.field}>
              <label>Categoria *</label>
              <select
                value={formProd.categoria_slug}
                onChange={(e) => setFormProd({ ...formProd, categoria_slug: e.target.value })}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Preço Unitário (R$) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formProd.preco}
                onChange={(e) => setFormProd({ ...formProd, preco: e.target.value })}
                placeholder="Ex: 1499.00"
              />
            </div>
          </div>

          <div className={styles.fieldGrid2}>
            <div className={styles.field}>
              <label>Estoque Logístico *</label>
              <input
                type="number"
                required
                value={formProd.estoque}
                onChange={(e) => setFormProd({ ...formProd, estoque: e.target.value })}
                placeholder="10"
              />
            </div>

            <div className={styles.field} style={{ justifyContent: 'center' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1.5rem' }}>
                <input
                  type="checkbox"
                  checked={formProd.destaque}
                  onChange={(e) => setFormProd({ ...formProd, destaque: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                Exibir na vitrine de destaques
              </label>
            </div>
          </div>

          <div className={styles.field}>
            <label>URL da Imagem Principal *</label>
            <input
              type="text"
              required
              value={formProd.imagem_principal}
              onChange={(e) => setFormProd({ ...formProd, imagem_principal: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className={styles.field}>
            <label>Descrição Curta / Especificações</label>
            <textarea
              value={formProd.descricao_curta}
              onChange={(e) => setFormProd({ ...formProd, descricao_curta: e.target.value })}
              placeholder="Resumo das características técnicas e vantagens..."
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn--outline" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={savingProd} style={{ flex: 1 }}>
              {savingProd ? 'Gravando...' : 'Salvar no Catálogo'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPanel;
