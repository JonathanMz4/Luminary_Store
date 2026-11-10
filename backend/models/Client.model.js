const { query } = require('../config/db');

class ClientModel {
  static async findAll({ q = '', page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const params = [];
    let whereSQL = '';

    if (q) {
      whereSQL = 'WHERE c.nome LIKE ? OR c.email LIKE ? OR c.telefone LIKE ?';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    const countSQL = `SELECT COUNT(*) as total FROM clientes c ${whereSQL}`;
    const countRows = await query(countSQL, params);
    const totalItems = countRows[0] ? countRows[0].total : 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const sql = `
      SELECT c.*, u.status as status_conta, u.ultimo_login,
             (SELECT COUNT(*) FROM pedidos p WHERE p.cliente_id = c.id) as total_pedidos,
             (SELECT COALESCE(SUM(p.total), 0) FROM pedidos p WHERE p.cliente_id = c.id AND p.status != 'Cancelado') as total_gasto
      FROM clientes c
      LEFT JOIN usuarios u ON c.usuario_id = u.id
      ${whereSQL}
      ORDER BY c.id DESC
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, parseInt(limit, 10), parseInt(offset, 10)];
    const clients = await query(sql, queryParams);

    return {
      clients,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page, 10),
        limit: parseInt(limit, 10)
      }
    };
  }

  static async findById(id) {
    const sql = `
      SELECT c.*, u.status as status_conta, u.role
      FROM clientes c
      LEFT JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.id = ?
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  static async findByUserId(userId) {
    const sql = `SELECT * FROM clientes WHERE usuario_id = ? LIMIT 1`;
    const rows = await query(sql, [userId]);
    return rows[0] || null;
  }

  static async create({ usuario_id = null, nome, email, telefone, cpf, data_nascimento, cep, logradouro, numero, bairro, cidade, estado }) {
    const sql = `
      INSERT INTO clientes (
        usuario_id, nome, email, telefone, cpf, data_nascimento,
        cep, logradouro, numero, bairro, cidade, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      usuario_id || null, nome, email, telefone || null, cpf || null, data_nascimento || null,
      cep || null, logradouro || null, numero || null, bairro || null, cidade || null, estado || null
    ];
    const result = await query(sql, params);
    return result.insertId;
  }

  static async update(id, data) {
    const fields = [];
    const params = [];
    const allowKeys = ['nome', 'email', 'telefone', 'cpf', 'data_nascimento', 'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];

    allowKeys.forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    });

    if (fields.length === 0) return 0;
    const sql = `UPDATE clientes SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);
    const result = await query(sql, params);
    return result.affectedRows;
  }

  static async delete(id) {
    // Busca usuario_id para remover o login associado
    const cli = await this.findById(id);
    if (cli && cli.usuario_id) {
      await query(`DELETE FROM usuarios WHERE id = ?`, [cli.usuario_id]);
    }
    const sql = `DELETE FROM clientes WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows;
  }
}

module.exports = ClientModel;
