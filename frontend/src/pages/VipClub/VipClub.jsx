import React, { useState, useEffect } from 'react';
import { Sparkles, Award, Zap, Shield, Send, CheckCircle2 } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import api from '../../services/api';
import styles from './VipClub.module.scss';

const VipClub = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !nome) return;

    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const res = await api.post('/newsletter', {
        email,
        nome,
        origem: 'pagina_vip_club'
      });
      if (res.data.sucesso) {
        setSuccessMsg('Bem-vindo à elite corporativa! Seu código de 20% de desconto é: VIP20. Use no carrinho em sua primeira encomenda.');
        setNome('');
        setEmail('');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.mensagem || 'Erro ao inscrever-se no clube VIP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.vipPage}`}>
      <Breadcrumbs items={[{ label: 'Luminary VIP Club & Leads Corporativos' }]} />

      <div className={styles.hero}>
        <img src="/images/vip_banner.png" alt="VIP Background" className={styles.bg} />
        <div className={styles.content}>
          <span className="badge badge--primary" style={{ width: 'fit-content', background: 'rgba(99, 102, 241, 0.25)', color: '#818cf8' }}>
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} /> ACESSO CORPORATIVO EXCLUSIVO
          </span>
          <h1>
            O Ápice da Vantagem no <span>Luminary VIP Club</span>
          </h1>
          <p>
            Projetado para CTOs, diretores de arte, desenvolvedores seniores e empresas que realizam aquisições contínuas de tecnologia de alta performance.
          </p>
        </div>
      </div>

      <section>
        <div className="section-header">
          <h2>Benefícios do Acesso VIP</h2>
          <p>Diferenciais reais que impactam o orçamento da sua corporação e a velocidade da entrega.</p>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <Award size={24} />
            </div>
            <h3>Cupom VIP20 de Boas-Vindas</h3>
            <p>Receba imediatamente 20% de desconto em todo o catálogo corporativo na sua primeira aquisição como membro logado.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconBox}>
              <Zap size={24} />
            </div>
            <h3>Acesso Antecipado a Protótipos</h3>
            <p>Nossos membros recebem convites exclusivos para adquirir lotes de lançamento de teclados mecânicos 8K e áudio antes da abertura ao público.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconBox}>
              <Shield size={24} />
            </div>
            <h3>Garantia On-Site Dedicada</h3>
            <p>Em caso de falha, nosso time técnico efetua o atendimento e a substituição do seu setup diretamente em seu escritório ou estúdio em SP.</p>
          </div>
        </div>
      </section>

      <div className={styles.formBox}>
        <h2>Solicitar Credenciamento VIP</h2>
        <p>Preencha os dados abaixo para receber sua credencial corporativa em seu e-mail.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Seu Nome ou Razão Social *"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Seu E-mail Corporativo *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {successMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'left' }}>
              <CheckCircle2 size={24} style={{ flexShrink: 0 }} /> <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '0.8rem', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <button type="submit" className="btn btn--primary" disabled={loading}>
            <Send size={18} /> {loading ? 'Validando Acesso...' : 'Desbloquear Acesso VIP Agora'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VipClub;
