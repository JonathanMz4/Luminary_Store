const ProductModel = require('../models/Product.model');

const getProducts = async (req, res, next) => {
  try {
    const { q, categoria, minPrice, maxPrice, sort, page = 1, limit = 12, destaque } = req.query;
    const result = await ProductModel.findAll({
      q,
      categoria,
      minPrice,
      maxPrice,
      sort,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      destaque
    });

    return res.status(200).json({
      sucesso: true,
      produtos: result.products,
      paginacao: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findByIdOrSlug(id);

    if (!product) {
      return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado ou indisponível.' });
    }

    const relacionados = await ProductModel.findRelated(product.categoria_id, product.id, 4);

    return res.status(200).json({
      sucesso: true,
      produto: product,
      relacionados
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const data = req.body;

    if (req.files && req.files.length > 0) {
      const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
      data.imagem_principal = fileUrls[0];
      if (fileUrls.length > 1) {
        data.imagens_adicionais = fileUrls.slice(1);
      }
    } else if (req.file) {
      data.imagem_principal = `/uploads/${req.file.filename}`;
    }

    if (!data.nome || !data.preco) {
      return res.status(400).json({ sucesso: false, mensagem: 'Nome do produto e preço são obrigatórios.' });
    }

    if (!data.slug) {
      data.slug = data.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const productId = await ProductModel.create(data);

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Produto cadastrado com sucesso no catálogo corporativo.',
      id: productId
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (req.files && req.files.length > 0) {
      const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
      data.imagem_principal = fileUrls[0];
      if (fileUrls.length > 1) {
        data.imagens_adicionais = fileUrls.slice(1);
      }
    } else if (req.file) {
      data.imagem_principal = `/uploads/${req.file.filename}`;
    }

    const affected = await ProductModel.update(id, data);
    if (affected === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado para atualização.' });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Os dados do produto foram atualizados com sucesso!'
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affected = await ProductModel.delete(id);
    if (affected === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado no sistema.' });
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: 'Produto excluído permanentemente do catálogo.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
