const { query } = require('../config/db');

class CategoryModel {
  static async findAll() {
    const sql = `
      SELECT c.*, COUNT(p.id) as total_produtos 
      FROM categorias c 
      LEFT JOIN produtos p ON c.id = p.categoria_id AND p.ativo = TRUE 
      GROUP BY c.id 
      ORDER BY c.ordem ASC, c.nome ASC
    `;
    const rows = await query(sql);
    return rows;
  }

  static async findByIdOrSlug(identifier) {
    const isId = /^\d+$/.test(identifier);
    const sql = `SELECT * FROM categorias WHERE ${isId ? 'id = ?' : 'slug = ?'} LIMIT 1`;
    const rows = await query(sql, [identifier]);
    return rows[0] || null;
  }

  static async create({ nome, slug, descricao, icone = 'box', destaque = false, ordem = 0 }) {
    const sql = `INSERT INTO categorias (nome, slug, descricao, icone, destaque, ordem) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await query(sql, [nome, slug, descricao || null, icone, destaque ? 1 : 0, ordem]);
    return result.insertId;
  }

  static async update(id, { nome, slug, descricao, icone, destaque, ordem }) {
    const fields = [];
    const params = [];
    if (nome !== undefined) { fields.push('nome = ?'); params.push(nome); }
    if (slug !== undefined) { fields.push('slug = ?'); params.push(slug); }
    if (descricao !== undefined) { fields.push('descricao = ?'); params.push(descricao); }
    if (icone !== undefined) { fields.push('icone = ?'); params.push(icone); }
    if (destaque !== undefined) { fields.push('destaque = ?'); params.push(destaque ? 1 : 0); }
    if (ordem !== undefined) { fields.push('ordem = ?'); params.push(ordem); }

    if (fields.length === 0) return 0;
    const sql = `UPDATE categorias SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);
    const result = await query(sql, params);
    return result.affectedRows;
  }

  static async delete(id) {
    const sql = `DELETE FROM categorias WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows;
  }
}

module.exports = CategoryModel;
