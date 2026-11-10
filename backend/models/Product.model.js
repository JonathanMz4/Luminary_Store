const { query } = require('../config/db');

class ProductModel {
  static async findAll({ q = '', categoria = '', minPrice = 0, maxPrice = 999999, sort = 'newest', page = 1, limit = 12, destaque = null }) {
    const offset = (page - 1) * limit;
    const params = [];
    let whereClauses = ['p.ativo = TRUE'];

    if (q) {
      whereClauses.push('(p.nome LIKE ? OR p.descricao_curta LIKE ? OR p.descricao_detalhada LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (categoria && categoria !== 'all') {
      whereClauses.push('(c.slug = ? OR p.categoria_id = ?)');
      params.push(categoria, parseInt(categoria, 10) || 0);
    }

    if (minPrice > 0) {
      whereClauses.push('p.preco >= ?');
      params.push(parseFloat(minPrice));
    }

    if (maxPrice < 999999) {
      whereClauses.push('p.preco <= ?');
      params.push(parseFloat(maxPrice));
    }

    if (destaque !== null) {
      whereClauses.push('p.destaque = ?');
      params.push(destaque === 'true' || destaque === true ? 1 : 0);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    let orderSQL = 'ORDER BY p.id DESC';
    if (sort === 'preco_asc' || sort === 'price-asc') orderSQL = 'ORDER BY p.preco ASC';
    else if (sort === 'preco_desc' || sort === 'price-desc') orderSQL = 'ORDER BY p.preco DESC';
    else if (sort === 'relevancia' || sort === 'popularity') orderSQL = 'ORDER BY p.vendas DESC, p.avaliacao_media DESC';
    else if (sort === 'novos' || sort === 'newest') orderSQL = 'ORDER BY p.criado_em DESC';

    const countSQL = `SELECT COUNT(*) as total FROM produtos p LEFT JOIN categorias c ON p.categoria_id = c.id ${whereSQL}`;
    const countRows = await query(countSQL, params);
    const totalItems = countRows[0] ? countRows[0].total : 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const sql = `
      SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug 
      FROM produtos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      ${whereSQL} 
      ${orderSQL} 
      LIMIT ? OFFSET ?
    `;

    const queryParams = [...params, parseInt(limit, 10), parseInt(offset, 10)];
    const products = await query(sql, queryParams);

    // Formatar strings JSON do MySQL
    const formattedProducts = products.map(p => ({
      ...p,
      imagens_adicionais: typeof p.imagens_adicionais === 'string' ? JSON.parse(p.imagens_adicionais || '[]') : (p.imagens_adicionais || []),
      especificacoes: typeof p.especificacoes === 'string' ? JSON.parse(p.especificacoes || '{}') : (p.especificacoes || {})
    }));

    return {
      products: formattedProducts,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page, 10),
        limit: parseInt(limit, 10)
      }
    };
  }

  static async findByIdOrSlug(identifier) {
    const isId = /^\d+$/.test(identifier);
    const sql = `
      SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug 
      FROM produtos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      WHERE ${isId ? 'p.id = ?' : 'p.slug = ?'}
      LIMIT 1
    `;
    const rows = await query(sql, [identifier]);
    if (!rows[0]) return null;
    const p = rows[0];
    return {
      ...p,
      imagens_adicionais: typeof p.imagens_adicionais === 'string' ? JSON.parse(p.imagens_adicionais || '[]') : (p.imagens_adicionais || []),
      especificacoes: typeof p.especificacoes === 'string' ? JSON.parse(p.especificacoes || '{}') : (p.especificacoes || {})
    };
  }

  static async findRelated(categoria_id, exclude_id, limit = 4) {
    const sql = `
      SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug 
      FROM produtos p 
      LEFT JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.categoria_id = ? AND p.id != ? AND p.ativo = TRUE 
      LIMIT ?
    `;
    const rows = await query(sql, [categoria_id, exclude_id, parseInt(limit, 10)]);
    return rows.map(p => ({
      ...p,
      imagens_adicionais: typeof p.imagens_adicionais === 'string' ? JSON.parse(p.imagens_adicionais || '[]') : (p.imagens_adicionais || []),
      especificacoes: typeof p.especificacoes === 'string' ? JSON.parse(p.especificacoes || '{}') : (p.especificacoes || {})
    }));
  }

  static async create(data) {
    const sql = `
      INSERT INTO produtos (
        categoria_id, nome, slug, descricao_curta, descricao_detalhada,
        preco, preco_antigo, estoque, sku, imagem_principal,
        imagens_adicionais, especificacoes, destaque, lancamento, ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.categoria_id || 1,
      data.nome,
      data.slug,
      data.descricao_curta || null,
      data.descricao_detalhada || null,
      data.preco,
      data.preco_antigo || null,
      data.estoque || 0,
      data.sku || `SKU-${Date.now()}`,
      data.imagem_principal || null,
      JSON.stringify(data.imagens_adicionais || []),
      JSON.stringify(data.especificacoes || {}),
      data.destaque ? 1 : 0,
      data.lancamento ? 1 : 0,
      data.ativo !== undefined ? (data.ativo ? 1 : 0) : 1
    ];
    const result = await query(sql, params);
    return result.insertId;
  }

  static async update(id, data) {
    const fields = [];
    const params = [];

    const allowKeys = [
      'categoria_id', 'nome', 'slug', 'descricao_curta', 'descricao_detalhada',
      'preco', 'preco_antigo', 'estoque', 'sku', 'imagem_principal',
      'imagens_adicionais', 'especificacoes', 'destaque', 'lancamento', 'ativo'
    ];

    allowKeys.forEach(key => {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'imagens_adicionais' || key === 'especificacoes') {
          params.push(typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
        } else if (key === 'destaque' || key === 'lancamento' || key === 'ativo') {
          params.push(data[key] ? 1 : 0);
        } else {
          params.push(data[key]);
        }
      }
    });

    if (fields.length === 0) return 0;

    const sql = `UPDATE produtos SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);
    const result = await query(sql, params);
    return result.affectedRows;
  }

  static async delete(id) {
    // Exclusão lógica ou física
    const sql = `DELETE FROM produtos WHERE id = ?`;
    const result = await query(sql, [id]);
    return result.affectedRows;
  }

  static async decrementStock(id, quantity) {
    const sql = `UPDATE produtos SET estoque = GREATEST(0, estoque - ?), vendas = vendas + ? WHERE id = ?`;
    await query(sql, [quantity, quantity, id]);
  }
}

module.exports = ProductModel;
