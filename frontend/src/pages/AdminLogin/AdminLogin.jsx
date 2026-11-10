import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLogin.module.scss';

const AdminLogin = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario || !senha) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminLogin(usuario, senha);
      if (res.sucesso) {
        navigate('/admin');
      } else {
        setError(res.mensagem || 'Credenciais administrativas incorretas.');
      }
    } catch (err) {
      setError(err.response?.data?.mensagem || 'Erro ao conectar com servidor administrativo.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className={styles.adminPage}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.iconShield}>
            <Shield size={28} />
          </div>
          <h2>Portal Administrativo</h2>
          <p>Acesso restrito à gestão corporativa da Luminary Store</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="adminUser">Usuário Corporativo</label>
            <input
              id="adminUser"
              type="text"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ex: admin"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="adminPass">Senha de Segurança</label>
            <input
              id="adminPass"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className="btn btn--primary" disabled={loading}>
            <Lock size={18} /> {loading ? 'Autenticando...' : 'Acessar Painel de Controle'}
          </button>
        </form>


        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <ArrowLeft size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Voltar à Loja Virtual
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
