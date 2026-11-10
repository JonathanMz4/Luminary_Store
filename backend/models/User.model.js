const { query } = require('../config/db');
const bcrypt = require('bcrypt');

class UserModel {
  static async findByEmailOrUsername(identifier) {
    const sql = `
      SELECT u.*, a.cargo, a.nivel_acesso 
      FROM usuarios u 
      LEFT JOIN admins a ON u.id = a.usuario_id 
      WHERE u.email = ? OR u.nome = ?
      LIMIT 1
    `;
    const rows = await query(sql, [identifier, identifier]);
    return rows[0] || null;
  }

  static async findById(id) {
    const sql = `
      SELECT u.id, u.nome, u.email, u.role, u.avatar, u.status, u.criado_em, c.telefone, c.cpf, c.cidade, c.estado
      FROM usuarios u
      LEFT JOIN clientes c ON u.id = c.usuario_id
      WHERE u.id = ?
    `;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  static async create({ nome, email, senha, role = 'cliente' }) {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const sql = `INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`;
    const result = await query(sql, [nome, email, hashedPassword, role]);
    return result.insertId;
  }

  static async verifyAdminAccount() {
    try {
      const adminExist = await query(`SELECT * FROM usuarios WHERE email = 'admin' OR nome = 'admin' LIMIT 1`);
      if (adminExist.length === 0) {
        console.log('⚡ [Boot]: Criando usuário admin corporativo padrão...');
        const hashed = await bcrypt.hash('123456', 10);
        const res = await query(
          `INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`,
          ['admin', 'admin@luminarystore.com', hashed, 'admin']
        );
        const userId = res.insertId;
        await query(
          `INSERT INTO admins (usuario_id, usuario, email, senha, nome_completo, cargo, nivel_acesso) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [userId, 'admin', 'admin@luminarystore.com', hashed, 'Administrador Luminary', 'Diretor Geral de Operações', 'super_admin']
        );
        console.log('✅ [Boot]: Admin criado com sucesso (admin / 123456)');
      } else {
        // Garantir que a senha está sincronizada para '123456'
        const usr = adminExist[0];
        const match = await bcrypt.compare('123456', usr.senha);
        if (!match) {
          const hashed = await bcrypt.hash('123456', 10);
          await query(`UPDATE usuarios SET senha = ?, role = 'admin' WHERE id = ?`, [hashed, usr.id]);
          await query(`UPDATE admins SET senha = ? WHERE usuario_id = ?`, [hashed, usr.id]);
          console.log('🔄 [Boot]: Senha do administrador sincronizada com sucesso!');
        }
      }
    } catch (err) {
      console.warn('⚠️ [Boot Aviso]: Falha ao checar/criar admin padrão:', err.message);
    }
  }
}

module.exports = UserModel;
