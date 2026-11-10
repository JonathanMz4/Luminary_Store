const NewsletterModel = require('../models/Newsletter.model');

const subscribe = async (req, res, next) => {
  try {
    const { nome, email, telefone, origem } = req.body;
    if (!email) {
      return res.status(400).json({ sucesso: false, mensagem: 'Por favor, informe seu melhor e-mail para continuar.' });
    }

    const leadId = await NewsletterModel.create({ nome, email, telefone, origem });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Inscrição confirmada com sucesso! Bem-vindo ao clube exclusivo Luminary VIP.',
      id: leadId
    });
  } catch (error) {
    next(error);
  }
};

const getAllLeads = async (req, res, next) => {
  try {
    const leads = await NewsletterModel.findAll();
    return res.status(200).json({
      sucesso: true,
      leads
    });
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affected = await NewsletterModel.delete(id);
    if (affected === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Lead não encontrado.' });
    }
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Lead removido da base de marketing.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribe,
  getAllLeads,
  deleteLead
};
