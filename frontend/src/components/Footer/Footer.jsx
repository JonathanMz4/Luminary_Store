import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, Youtube, Send, ShieldCheck, Lock, Award } from 'lucide-react';
import api from '../../services/api';
import styles from './Footer.module.scss';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMsg(null);
    try {
      const res = await api.post('/newsletter', { email, origem: 'footer' });
      if (res.data.sucesso) {
        setMsg({ type: 'success', text: res.data.mensagem });
        setEmail('');
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.mensagem || 'Erro ao inscrever-se.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.topSection}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>L</div>
              <span>Luminary</span> Store
            </Link>
            <p>
              Elevando o ecossistema tecnológico e de design corporativo. Produtos selecionados para performance imbatível e estética sublime.
            </p>
            <div className={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Links Navegação */}
          <div className={styles.linkCol}>
            <h4>Navegação</h4>
            <ul>
              <li><Link to="/">Início & Vitrine</Link></li>
              <li><Link to="/loja">Catálogo Completo</Link></li>
              <li><Link to="/sobre">Nossa História</Link></li>
              <li><Link to="/contato">Fale Conosco</Link></li>
            </ul>
          </div>

          {/* Institucional */}
          <div className={styles.linkCol}>
            <h4>Institucional</h4>
            <ul>
              <li><Link to="/privacidade">Política de Privacidade</Link></li>
              <li><Link to="/termos">Termos de Uso</Link></li>
              <li><Link to="/faq">Perguntas Frequentes</Link></li>
              <li><Link to="/login">Acesso Corporativo</Link></li>
              <li><Link to="/admin">Painel de Gestão</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletterCol}>
            <h4>Inscreva-se em Nossa Newsletter</h4>
            <p>Receba lançamentos exclusivos e ofertas para empresas antes de todo mundo.</p>
            <form onSubmit={handleSubscribe} className={styles.form}>
              <input
                type="email"
                placeholder="Seu melhor e-mail corporativo..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn--primary" disabled={loading}>
                <Send size={16} /> {loading ? 'Enviando...' : 'Inscrever-se'}
              </button>
            </form>
            {msg && (
              <span className={styles.successMsg} style={{ color: msg.type === 'error' ? 'var(--color-error)' : 'var(--color-success)' }}>
                {msg.text}
              </span>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottomSection}>
          <p>© 2026 Luminary Store Corporativo. Todos os direitos reservados.</p>
          <div className={styles.badges}>
            <span><ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} /> SSL 256-bit Certificado</span>
            <span><Lock size={14} style={{ display: 'inline', marginRight: '4px' }} /> Criptografia Bcrypt</span>
            <span><Award size={14} style={{ display: 'inline', marginRight: '4px' }} /> Garantia Pro</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
