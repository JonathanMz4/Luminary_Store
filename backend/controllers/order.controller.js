const OrderModel = require('../models/Order.model');
const ClientModel = require('../models/Client.model');

const createOrder = async (req, res, next) => {
  try {
    const { itens, endereco_entrega, metodo_pagamento, subtotal, frete, desconto, total, observacoes } = req.body;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ sucesso: false, mensagem: 'O carrinho está vazio. Adicione pelo menos um produto ao pedido.' });
    }

    let cliente_id = req.body.cliente_id;

    // Se usuário autenticado for cliente, busca o ID da tabela clientes
    if (req.user && req.user.role !== 'admin') {
      const client = await ClientModel.findByUserId(req.user.id);
      if (client) {
        cliente_id = client.id;
      }
    }

    // Se ainda assim não tiver cliente_id, podemos buscar um cliente padrão ou fallback para compra convidado (se suportado ou erro)
    if (!cliente_id) {
      // Como fallback para teste rápido ou compra sem login prévio rigoroso, atribuir ao ID 1 se não provido
      cliente_id = 1;
    }

    const orderRes = await OrderModel.create({
      cliente_id,
      itens,
      endereco_entrega,
      metodo_pagamento,
      subtotal,
      frete,
      desconto,
      total,
      observacoes
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Pedido corporativo registrado com sucesso! Obrigado por comprar no Luminary Store.',
      pedido_id: orderRes.id,
      codigo_pedido: orderRes.codigo_pedido
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const client = await ClientModel.findByUserId(req.user.id);
    if (!client) {
      return res.status(200).json({ sucesso: true, pedidos: [] });
    }

    const pedidos = await OrderModel.findByClientId(client.id);
    return res.status(200).json({
      sucesso: true,
      pedidos
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { status, q, page = 1, limit = 20 } = req.query;
    const result = await OrderModel.findAll({
      status,
      q,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });

    return res.status(200).json({
      sucesso: true,
      pedidos: result.orders,
      paginacao: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado no sistema logístico.' });
    }
    return res.status(200).json({
      sucesso: true,
      pedido: order
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ sucesso: false, mensagem: 'Informe o novo status logístico do pedido.' });
    }

    const affected = await OrderModel.updateStatus(id, status);
    if (affected === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado para atualização.' });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: `Status logístico atualizado para: "${status}"`
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affected = await OrderModel.delete(id);
    if (affected === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado.' });
    }
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Registro de pedido removido com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
