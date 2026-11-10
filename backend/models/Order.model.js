const { query } = require('../config/db');
const ProductModel = require('./Product.model');

class OrderModel {
  static async findAll({ status = '', q = '', page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const params = [];
    let whereClauses = [];

    if (status && status !== 'all') {
      whereClauses.push('p.status = ?');
      params.push(status);
    }

    if (q) {
      whereClauses.push('(p.codigo_pedido LIKE ? OR c.nome LIKE ? OR c.email LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSQL = `SELECT COUNT(*) as total FROM pedidos p LEFT JOIN clientes c ON p.cliente_id = c.id ${whereSQL}`;
    const countRows = await query(countSQL, params);
    const totalItems = countRows[0] ? countRows[0].total : 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const sql = `
      SELECT p.*, c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone
      FROM pedidos p
      LEFT JOIN clientes c ON p.cliente_id = c.id
      ${whereSQL}
      ORDER BY p.id DESC
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, parseInt(limit, 10), parseInt(offset, 10)];
    const orders = await query(sql, queryParams);

    const formattedOrders = orders.map(o => ({
      ...o,
      endereco_entrega: typeof o.endereco_entrega === 'string' ? JSON.parse(o.endereco_entrega || '{}') : (o.endereco_entrega || {})
    }));

    return {
      orders: formattedOrders,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page, 10),
        limit: parseInt(limit, 10)
      }
    };
  }

  static async findByClientId(clientId) {
    const sql = `
      SELECT p.*,
        (SELECT COUNT(*) FROM pedido_itens pi WHERE pi.pedido_id = p.id) as total_itens
      FROM pedidos p
      WHERE p.cliente_id = ?
      ORDER BY p.id DESC
    `;
    const orders = await query(sql, [clientId]);
    return orders.map(o => ({
      ...o,
      endereco_entrega: typeof o.endereco_entrega === 'string' ? JSON.parse(o.endereco_entrega || '{}') : (o.endereco_entrega || {})
    }));
  }

  static async findById(id) {
    const sql = `
      SELECT p.*, c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone, c.cpf as cliente_cpf
      FROM pedidos p
      LEFT JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = ?
    `;
    const rows = await query(sql, [id]);
    if (!rows[0]) return null;
    const order = rows[0];

    const itemsSQL = `SELECT * FROM pedido_itens WHERE pedido_id = ?`;
    const items = await query(itemsSQL, [id]);

    return {
      ...order,
      endereco_entrega: typeof order.endereco_entrega === 'string' ? JSON.parse(order.endereco_entrega || '{}') : (order.endereco_entrega || {}),
      itens: items
    };
  }

  static async create({ cliente_id, itens = [], endereco_entrega, metodo_pagamento = 'pix', subtotal, frete = 0, desconto = 0, total, observacoes = '' }) {
    const codigo_pedido = `LUM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 89 + 10)}`;
    const sql = `
      INSERT INTO pedidos (
        codigo_pedido, cliente_id, status, metodo_pagamento, status_pagamento,
        subtotal, frete, desconto, total, endereco_entrega, observacoes
      ) VALUES (?, ?, 'Pendente', ?, 'Aguardando', ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      codigo_pedido,
      cliente_id,
      metodo_pagamento,
      subtotal,
      frete,
      desconto,
      total,
      JSON.stringify(endereco_entrega || {}),
      observacoes || null
    ];
    const result = await query(sql, params);
    const orderId = result.insertId;

    // Inserir os itens e decrementar estoque
    for (const item of itens) {
      const itemSQL = `
        INSERT INTO pedido_itens (pedido_id, produto_id, nome_produto, preco_unitario, quantidade, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await query(itemSQL, [
        orderId,
        item.produto_id || item.id,
        item.nome || item.nome_produto || 'Produto sem nome',
        item.preco || item.preco_unitario || 0,
        item.quantidade || 1,
        (item.preco || 0) * (item.quantidade || 1)
      ]);

      // Atualizar estoque e contagem de vendas
      if (item.produto_id || item.id) {
        await ProductModel.decrementStock(item.produto_id || item.id, item.quantidade || 1);
      }
    }

    return { id: orderId, codigo_pedido };
  }

  static async updateStatus(id, status) {
    const sql = `UPDATE pedidos SET status = ?, status_pagamento = IF(? = 'Entregue', 'Aprovado', status_pagamento) WHERE id = ?`;
    const result = await query(sql, [status, status, id]);
    return result.affectedRows;
  }

  static async delete(id) {
    const sql = `DELETE FROM pedidos WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows;
  }
}

module.exports = OrderModel;
