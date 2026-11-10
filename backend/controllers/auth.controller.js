const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/User.model');
const ClientModel = require('../models/Client.model');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || 'cliente',
      nome: user.nome
    },
    process.env.JWT_SECRET || 'super_secret_luminary_enterprise_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Informe o e-mail (ou usuário) e a senha para autenticação.' });
    }

    const user = await UserModel.findByEmailOrUsername(email);
    if (!user) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas. Verifique seu e-mail ou senha.' });
    }

    if (user.status !== 'ativo') {
      return res.status(403).json({ sucesso: false, mensagem: 'Conta suspensa ou inativa no sistema.' });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas. Verifique seu e-mail ou senha.' });
    }

    const token = generateToken(user);
    const clientData = await ClientModel.findByUserId(user.id);

    return res.status(200).json({
      sucesso: true,
      mensagem: `Bem-vindo de volta, ${user.nome}!`,
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        cliente_id: clientData ? clientData.id : null,
        cargo: user.cargo || null,
        nivel_acesso: user.nivel_acesso || null
      }
    });
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Informe o usuário/email e a senha do painel corporativo.' });
    }

    const user = await UserModel.findByEmailOrUsername(usuario);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ sucesso: false, mensagem: 'Acesso restrito. Credenciais administrativas inválidas ou não autorizadas.' });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ sucesso: false, mensagem: 'Credenciais administrativas inválidas.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Sessão corporativa iniciada com sucesso.',
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: 'admin',
        cargo: user.cargo || 'Diretor Geral de Operações',
        nivel_acesso: user.nivel_acesso || 'super_admin'
      }
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { nome, email, senha, telefone, cpf, data_nascimento, cep, logradouro, numero, bairro, cidade, estado } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Nome, e-mail e senha são obrigatórios.' });
    }

    const existingUser = await UserModel.findByEmailOrUsername(email);
    if (existingUser) {
      return res.status(409).json({ sucesso: false, mensagem: 'Este e-mail já está cadastrado em nossa plataforma.' });
    }

    const userId = await UserModel.create({ nome, email, senha, role: 'cliente' });
    const clientId = await ClientModel.create({
      usuario_id: userId,
      nome,
      email,
      telefone: telefone || null,
      cpf: cpf || null,
      data_nascimento: data_nascimento || null,
      cep: cep || null,
      logradouro: logradouro || null,
      numero: numero || null,
      bairro: bairro || null,
      cidade: cidade || null,
      estado: estado || null
    });

    const token = generateToken({ id: userId, email, role: 'cliente', nome });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Sua conta corporativa foi criada com sucesso!',
      token,
      usuario: {
        id: userId,
        cliente_id: clientId,
        nome,
        email,
        role: 'cliente'
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
    }
    const clientData = await ClientModel.findByUserId(user.id);

    return res.status(200).json({
      sucesso: true,
      usuario: {
        ...user,
        cliente_id: clientData ? clientData.id : null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  adminLogin,
  register,
  getMe
};
