const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const routes = require('./routes');
const { apiLimiter, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// Segurança: Helmet configurado para permitir o carregamento de imagens cross-origin do diretório /uploads
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Segurança: CORS para conexão segura entre o Frontend React e a API
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};
app.use(cors(corsOptions));

// Middlewares para processamento de JSON e Formulários
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir arquivos de imagem enviados (Multer uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Limite de Taxa de requisições (Rate Limiter)
app.use('/api', apiLimiter);

// Rotas principais da API REST
app.use('/api', routes);

// Rota 404 para endpoints não encontrados no backend
app.use('*', (req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: `Endpoint corporativo não encontrado: ${req.method} ${req.originalUrl}`,
    dica: 'Consulte a documentação em docs/API.md ou verifique se você inseriu o prefixo /api corretamente.'
  });
});

// Middleware Central de Tratamento de Erros
app.use(errorHandler);

module.exports = app;
