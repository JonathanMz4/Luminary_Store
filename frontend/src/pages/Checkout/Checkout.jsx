import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, User, MapPin, ShieldCheck, CheckCircle2, QrCode, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Modal from '../../components/Modal/Modal';
import { formatCurrency, formatCep, formatPhone } from '../../utils/formatters';
import api from '../../services/api';
import styles from './Checkout.module.scss';

const Checkout = () => {
  const { cart, subtotal, discount, freight, total, clearCart, coupon } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: 'SP',
    metodo_pagamento: 'pix',
    numero_cartao: '',
    validade_cartao: '',
    cvv_cartao: '',
    nome_cartao: ''
  });

  const [loadingCep, setLoadingCep] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome || prev.nome,
        email: user.email || prev.email,
        telefone: user.telefone || prev.telefone
      }));
    }
  }, [user]);

  if (cart.length === 0 && !successOrder) {
    return (
      <div className={`container ${styles.checkoutPage}`} style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Não há itens para processar no Checkout</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>Adicione produtos de nosso catálogo corporativo antes de iniciar o pagamento.</p>
        <Link to="/loja" className="btn btn--primary"><ArrowLeft size={16} /> Ir para a Loja</Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'cep') val = formatCep(value);
    if (name === 'telefone') val = formatPhone(value);
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  // Simular busca de CEP automática ao preencher 8 ou 9 caracteres (ex: 01001-000)
  const handleCepBlur = () => {
    const clean = formData.cep.replace(/\D/g, '');
    if (clean.length === 8) {
      setLoadingCep(true);
      setTimeout(() => {
        // Mock ou ViaCEP real
        if (clean === '01001000') {
          setFormData(prev => ({
            ...prev,
            rua: 'Praça da Sé',
            bairro: 'Sé',
            cidade: 'São Paulo',
            estado: 'SP'
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            rua: 'Avenida das Nações Unidas, 12901',
            bairro: 'Brooklin Novo',
            cidade: 'São Paulo',
            estado: 'SP'
          }));
        }
        setLoadingCep(false);
      }, 500);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    // Validação básica
    if (!formData.rua || !formData.numero || !formData.cep) {
      setErrorMsg('Por favor, preencha o endereço completo para entrega.');
      setSubmitting(false);
      return;
    }

    try {
      const enderecoFormatado = `${formData.rua}, ${formData.numero} ${formData.complemento ? `(${formData.complemento})` : ''} - ${formData.bairro}, ${formData.cidade}/${formData.estado} - CEP: ${formData.cep}`;
      
      const payload = {
        cliente_nome: formData.nome,
        cliente_email: formData.email,
        cliente_telefone: formData.telefone,
        endereco_entrega: enderecoFormatado,
        metodo_pagamento: formData.metodo_pagamento,
        cupom_aplicado: coupon ? coupon.code : null,
        valor_frete: freight,
        desconto: discount,
        itens: cart.map(i => ({
          produto_id: i.id,
          quantidade: i.quantidade,
          preco_unitario: i.preco
        }))
      };

      const res = await api.post('/orders', payload);
      if (res.data.sucesso) {
        setSuccessOrder(res.data.pedido);
        clearCart();
        // Efeito Confetti de celebração
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.mensagem || 'Erro ao processar pedido no servidor. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const finalTotalCalc = formData.metodo_pagamento === 'pix' ? total * 0.95 : total; // 5% desconto extra no PIX

  return (
    <div className={`container ${styles.checkoutPage}`}>
      <Breadcrumbs items={[{ label: 'Carrinho', path: '/carrinho' }, { label: 'Checkout & Pagamento' }]} />

      <h1 style={{ fontSize: '2.25rem' }}>Finalização de Pedido Corporativo</h1>

      <form onSubmit={handleSubmitOrder} className={styles.grid}>
        {/* Formulário Principal */}
        <div className={styles.formCol}>
          {/* Dados Pessoais */}
          <div className={styles.sectionBox}>
            <h3>
              <User size={20} color="var(--accent-primary)" />
              1. Identificação do Comprador
            </h3>
            <div className={styles.fieldsGrid}>
              <div className={styles.field}>
                <label>Nome Completo / Razão Social *</label>
                <input
                  type="text"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Ana Silva / Luminary Enterprise"
                />
              </div>
              <div className={styles.field}>
                <label>E-mail Corporativo *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="compras@suaempresa.com"
                />
              </div>
              <div className={styles.field}>
                <label>Telefone / WhatsApp *</label>
                <input
                  type="text"
                  name="telefone"
                  required
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div className={styles.sectionBox}>
            <h3>
              <MapPin size={20} color="var(--accent-primary)" />
              2. Endereço de Entrega Expresso {loadingCep && <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>(Buscando CEP...)</span>}
            </h3>
            <div className={styles.fieldsGrid}>
              <div className={styles.field}>
                <label>CEP *</label>
                <input
                  type="text"
                  name="cep"
                  required
                  maxLength={9}
                  value={formData.cep}
                  onChange={handleInputChange}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                />
              </div>
              <div className={styles.field}>
                <label>Estado (UF) *</label>
                <input type="text" name="estado" required value={formData.estado} onChange={handleInputChange} maxLength={2} />
              </div>
              <div className={`${styles.field} ${styles['fieldsGrid--full']}`}>
                <label>Logradouro / Avenida / Rua *</label>
                <input type="text" name="rua" required value={formData.rua} onChange={handleInputChange} placeholder="Ex: Av. Engenheiro Luís Carlos Berrini" />
              </div>
              <div className={styles.field}>
                <label>Número *</label>
                <input type="text" name="numero" required value={formData.numero} onChange={handleInputChange} placeholder="1234 - Andar 15" />
              </div>
              <div className={styles.field}>
                <label>Complemento</label>
                <input type="text" name="complemento" value={formData.complemento} onChange={handleInputChange} placeholder="Sala 1502 / Torre A" />
              </div>
              <div className={styles.field}>
                <label>Bairro *</label>
                <input type="text" name="bairro" required value={formData.bairro} onChange={handleInputChange} placeholder="Centro Empresarial" />
              </div>
              <div className={styles.field}>
                <label>Cidade *</label>
                <input type="text" name="cidade" required value={formData.cidade} onChange={handleInputChange} placeholder="São Paulo" />
              </div>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className={styles.sectionBox}>
            <h3>
              <CreditCard size={20} color="var(--accent-primary)" />
              3. Modalidade de Pagamento Corporativo
            </h3>
            <div className={styles.paymentOptions}>
              {/* PIX */}
              <label className={formData.metodo_pagamento === 'pix' ? styles.selected : ''}>
                <div className={styles.info}>
                  <QrCode size={24} color="#10b981" />
                  <div>
                    <strong>PIX Instantâneo (5% de Desconto Adicional)</strong>
                    <span>Aprovação na hora via QR Code com desconto cumulativo.</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="metodo_pagamento"
                  value="pix"
                  checked={formData.metodo_pagamento === 'pix'}
                  onChange={handleInputChange}
                />
              </label>

              {/* Cartão de Crédito */}
              <label className={formData.metodo_pagamento === 'cartao_credito' ? styles.selected : ''}>
                <div className={styles.info}>
                  <CreditCard size={24} color="#6366f1" />
                  <div>
                    <strong>Cartão de Crédito Corporativo / Pessoal</strong>
                    <span>Parcelamento em até 12x sem juros no cartão Visa, Mastercard ou Amex.</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="metodo_pagamento"
                  value="cartao_credito"
                  checked={formData.metodo_pagamento === 'cartao_credito'}
                  onChange={handleInputChange}
                />
              </label>

              {/* Boleto Bancário */}
              <label className={formData.metodo_pagamento === 'boleto' ? styles.selected : ''}>
                <div className={styles.info}>
                  <FileText size={24} color="#f59e0b" />
                  <div>
                    <strong>Boleto Bancário Enterprise / faturamento</strong>
                    <span>Vencimento em 3 dias úteis. Compensação em até 48 horas.</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="metodo_pagamento"
                  value="boleto"
                  checked={formData.metodo_pagamento === 'boleto'}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            {/* Campos Cartão se selecionado */}
            {formData.metodo_pagamento === 'cartao_credito' && (
              <div className={styles.fieldsGrid} style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div className={`${styles.field} ${styles['fieldsGrid--full']}`}>
                  <label>Número do Cartão de Crédito</label>
                  <input type="text" placeholder="4532 •••• •••• ••••" maxLength={19} />
                </div>
                <div className={styles.field}>
                  <label>Validade (MM/AA)</label>
                  <input type="text" placeholder="12/28" maxLength={5} />
                </div>
                <div className={styles.field}>
                  <label>CVV (Código de Segurança)</label>
                  <input type="text" placeholder="123" maxLength={4} />
                </div>
                <div className={`${styles.field} ${styles['fieldsGrid--full']}`}>
                  <label>Nome Impresso no Cartão</label>
                  <input type="text" placeholder="ANA SILVA ENTERPRISE" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumo e Botão de Finalização */}
        <aside className={styles.summaryCol}>
          <h3>Resumo da Encomenda</h3>

          <div className={styles.cartList}>
            {cart.map((item) => (
              <div key={item.id} className={styles.item}>
                <span><strong>{item.quantidade}x</strong> {item.nome}</span>
                <span>{formatCurrency(parseFloat(item.preco) * item.quantidade)}</span>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.row}>
              <span>Subtotal dos Produtos</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {coupon && (
              <div className={styles.row} style={{ color: 'var(--color-success)' }}>
                <span>Cupom ({coupon.code})</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className={styles.row}>
              <span>Frete Logístico</span>
              <span>{freight === 0 ? <strong style={{ color: 'var(--color-success)' }}>Grátis</strong> : formatCurrency(freight)}</span>
            </div>
            {formData.metodo_pagamento === 'pix' && (
              <div className={styles.row} style={{ color: '#10b981', fontWeight: 600 }}>
                <span>Desconto PIX (-5%)</span>
                <span>-{formatCurrency(total * 0.05)}</span>
              </div>
            )}
            <div className={`${styles.row} ${styles['row--total']}`}>
              <span>Total a Pagar</span>
              <span>{formatCurrency(finalTotalCalc)}</span>
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting}
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
          >
            {submitting ? 'Processando Pagamento...' : 'Confirmar Pedido & Pagar'} <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="var(--color-success)" />
            <span>Ambiente certificado LGPD e PCI-DSS</span>
          </div>
        </aside>
      </form>

      {/* Modal de Sucesso */}
      <Modal
        isOpen={!!successOrder}
        onClose={() => {
          setSuccessOrder(null);
          navigate('/pedidos');
        }}
        title="🎉 Encomenda Registrada com Sucesso!"
      >
        {successOrder && (
          <div className={styles.successModal}>
            <div className={styles.iconBox}>
              <CheckCircle2 size={44} />
            </div>
            <h2>Obrigado por confiar na Luminary Store!</h2>
            <p>
              Seu pedido corporativo foi emitido em nossos sistemas com status <strong>Aguardando Pagamento / Processamento</strong>. Um e-mail com a Nota Fiscal e o rastreamento logístico será enviado para <strong>{successOrder.cliente_email}</strong>.
            </p>
            <div className={styles.orderCard}>
              <div><strong>Número do Pedido:</strong> #{successOrder.id || Math.floor(1000 + Math.random() * 9000)}</div>
              <div><strong>Valor Total:</strong> {formatCurrency(successOrder.total || finalTotalCalc)}</div>
              <div><strong>Status Logístico:</strong> PENDENTE</div>
              <div><strong>Endereço Destino:</strong> {successOrder.endereco_entrega}</div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
              <Link to="/pedidos" className="btn btn--primary" style={{ flex: 1 }}>
                Acompanhar Meus Pedidos
              </Link>
              <Link to="/" className="btn btn--outline" style={{ flex: 1 }}>
                Voltar ao Início
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Checkout;
