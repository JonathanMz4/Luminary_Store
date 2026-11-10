const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Acesso negado. Token de autenticação não fornecido ou formato inválido.'
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'super_secret_luminary_enterprise_key_2026';

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, email, role, nome }
    next();
  } catch (error) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Token expirado ou inválido. Realize login novamente no sistema.'
    });
  }
};

module.exports = verifyToken;
