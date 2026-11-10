const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Acesso não autorizado. Autenticação corporativa necessária.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      sucesso: false,
      mensagem: 'Permissão corporativa insuficiente. Área restrita a Administradores.'
    });
  }

  next();
};

module.exports = verifyAdmin;
