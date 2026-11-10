import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para anexar Token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luminary_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Opcional: Limpar sessão se token expirar
      console.warn('⚠️ [API]: Token expirado ou não autorizado.');
    }
    return Promise.reject(error);
  }
);

import { categories, products } from './mockData';

// Modo Netlify Standalone: Mock de Respostas da API
api.defaults.adapter = async (config) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const url = config.url || '';
      const method = config.method ? config.method.toUpperCase() : 'GET';
      const urlObj = new URL(url, config.baseURL || 'http://localhost');
      
      // Mock /categories
      if (url.includes('/categories') && method === 'GET') {
        return resolve({ data: { sucesso: true, categorias: categories }, status: 200, statusText: 'OK', headers: {}, config });
      }

      // Mock /products
      if (url.includes('/products') && method === 'GET') {
        const isDestaque = urlObj.searchParams.get('destaque');
        const q = urlObj.searchParams.get('q');
        let filtered = [...products];

        if (isDestaque === '1') filtered = filtered.filter(p => p.destaque === 1);
        if (q) filtered = filtered.filter(p => p.nome.toLowerCase().includes(q.toLowerCase()));

        return resolve({ 
          data: { sucesso: true, produtos: filtered, total: filtered.length, paginas: 1 }, 
          status: 200, statusText: 'OK', headers: {}, config 
        });
      }

      // Mock Login Admin & User
      if (url.includes('/admin/login') || url.includes('/login')) {
        return resolve({
          data: { sucesso: true, token: 'mock_token_netlify', usuario: { nome: 'Admin Demo', role: 'admin' } },
          status: 200, statusText: 'OK', headers: {}, config
        });
      }

      // Fallback Universal (Sucesso Simulado)
      return resolve({ data: { sucesso: true, mensagem: 'Ação simulada (Modo Netlify Standalone)' }, status: 200, statusText: 'OK', headers: {}, config });
    }, 400);
  });
};

export default api;
