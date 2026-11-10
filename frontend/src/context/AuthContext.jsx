import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('luminary_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        if (response.data.sucesso) {
          setUser(response.data.usuario);
        } else {
          logout();
        }
      } catch (error) {
        console.error('❌ Falha ao carregar perfil do usuário:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    if (response.data.sucesso) {
      localStorage.setItem('luminary_token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.usuario);
      return { sucesso: true, mensagem: response.data.mensagem };
    }
    return { sucesso: false, mensagem: response.data.mensagem };
  };

  const adminLogin = async (usuario, senha) => {
    const response = await api.post('/auth/admin-login', { usuario, senha });
    if (response.data.sucesso) {
      localStorage.setItem('luminary_token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.usuario);
      return { sucesso: true, mensagem: response.data.mensagem };
    }
    return { sucesso: false, mensagem: response.data.mensagem };
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.sucesso) {
      localStorage.setItem('luminary_token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.usuario);
      return { sucesso: true, mensagem: response.data.mensagem };
    }
    return { sucesso: false, mensagem: response.data.mensagem };
  };

  const logout = () => {
    localStorage.removeItem('luminary_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        adminLogin,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
