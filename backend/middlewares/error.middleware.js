const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // Limite generoso para desenvolvimento/testes interativos
  message: {
    sucesso: false,
    mensagem: 'Muitas requisições enviadas a partir deste IP. Aguarde alguns minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const errorHandler = (err, req, res, next) => {
  console.error('❌ [Erro da Aplicação]:', err.stack || err.message);

  const status = err.status || 500;
  const message = err.message || 'Erro interno no servidor corporativo.';

  res.status(status).json({
    sucesso: false,
    mensagem: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  apiLimiter,
  errorHandler
};
