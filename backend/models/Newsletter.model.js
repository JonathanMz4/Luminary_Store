const { query } = require('../config/db');

class NewsletterModel {
  static async findAll() {
    const sql = `SELECT * FROM newsletter ORDER BY id DESC`;
    return await query(sql);
  }

  static async create({ nome, email, telefone, origem = 'footer' }) {
    // Checa se já existe
    const existing = await query(`SELECT id FROM newsletter WHERE email = ? LIMIT 1`, [email]);
    if (existing.length > 0) {
      // Atualizar para ativo e atualizar dados caso tenha mudado
      const sql = `UPDATE newsletter SET nome = ?, telefone = COALESCE(?, telefone), ativo = TRUE WHERE email = ?`;
      await query(sql, [nome || 'Lead Reativado', telefone || null, email]);
      return existing[0].id;
    }

    const sql = `INSERT INTO newsletter (nome, email, telefone, origem) VALUES (?, ?, ?, ?)`;
    const result = await query(sql, [nome || 'Visitante', email, telefone || null, origem]);
    return result.insertId;
  }

  static async delete(id) {
    const sql = `DELETE FROM newsletter WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows;
  }
}

module.exports = NewsletterModel;
