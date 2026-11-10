const ClientModel = require('../models/Client.model');

const getAllClients = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const result = await ClientModel.findAll({
      q,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });

    return res.status(200).json({
      sucesso: true,
      clientes: result.clients,
      paginacao: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await ClientModel.findById(id);
    if (!client) {
      return res.status(404).json({ sucesso: false, mensagem: 'Cliente não encontrado.' });
    }
    return res.status(200).json({
      sucesso: true,
      cliente: client
    });
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affected = await ClientModel.update(id, req.body);
    if (affected === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Cliente não encontrado para alteração.' });
    }
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Dados do cliente atualizados com sucesso!'
    });
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affected = await ClientModel.delete(id);
    if (affected === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Cliente não encontrado.' });
    }
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Conta de cliente inativada/removida com sucesso do sistema.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
};
