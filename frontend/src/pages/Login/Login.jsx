import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.scss';

const Login = () => {
  const [tab, setTab] = useState('login');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Register State
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regTelefone, setRegTelefone] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginSenha) return;
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await login(loginEmail, loginSenha);
      if (res.sucesso) {
        navigate('/loja');
      } else {
        setLoginError(res.mensagem || 'Credenciais inválidas.');
      }
    } catch (err) {
      setLoginError(err.response?.data?.mensagem || 'Erro ao conectar ao servidor.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regNome || !regEmail || !regSenha) return;
    setRegLoading(true);
    setRegError(null);
    try {
      const res = await register({
        nome: regNome,
        email: regEmail,
        senha: regSenha,
        telefone: regTelefone
      });
      if (res.sucesso) {
        navigate('/loja');
      } else {
        setRegError(res.mensagem || 'Erro ao cadastrar.');
      }
    } catch (err) {
      setRegError(err.response?.data?.mensagem || 'Erro ao registrar conta corporativa.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.box}>
        <div className={styles.brandHeader}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>L</div>
            <span>Luminary</span> Store
          </Link>
          <p>Acesso ao portal de aquisições de alta tecnologia</p>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={tab === 'login' ? styles.active : ''}
            onClick={() => { setTab('login'); setLoginError(null); }}
          >
            Entrar na Conta
          </button>
          <button
            type="button"
            className={tab === 'register' ? styles.active : ''}
            onClick={() => { setTab('register'); setRegError(null); }}
          >
            Criar Nova Conta
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>E-mail Corporativo / Pessoal</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="nome@empresa.com.br"
              />
            </div>
            <div className={styles.field}>
              <label>Senha de Acesso</label>
              <input
                type="password"
                required
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {loginError && <div className={styles.error}>{loginError}</div>}

            <button type="submit" className="btn btn--primary" disabled={loginLoading}>
              <LogIn size={18} /> {loginLoading ? 'Verificando...' : 'Entrar Agora'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Nome Completo / Empresa *</label>
              <input
                type="text"
                required
                value={regNome}
                onChange={(e) => setRegNome(e.target.value)}
                placeholder="Ana Silva Enterprise"
              />
            </div>
            <div className={styles.field}>
              <label>E-mail Corporativo *</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ana@empresa.com"
              />
            </div>
            <div className={styles.field}>
              <label>Senha Segura (Mínimo 6 caracteres) *</label>
              <input
                type="password"
                required
                minLength={6}
                value={regSenha}
                onChange={(e) => setRegSenha(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className={styles.field}>
              <label>Telefone / WhatsApp</label>
              <input
                type="text"
                value={regTelefone}
                onChange={(e) => setRegTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            {regError && <div className={styles.error}>{regError}</div>}

            <button type="submit" className="btn btn--primary" disabled={regLoading}>
              <UserPlus size={18} /> {regLoading ? 'Criando Conta...' : 'Concluir Cadastro'}
            </button>
          </form>
        )}

        <div className={styles.adminLink}>
          Área restrita à gerência e engenharia de sistemas?
          <Link to="/admin-login">
            Acessar Portal Admin <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
