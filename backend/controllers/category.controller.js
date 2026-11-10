const CategoryModel = require('../models/Category.model');

const getCategories = async (req, res, next) => {
  try {
    const categorias = await CategoryModel.findAll();
    return res.status(200).json({
      sucesso: true,
      categorias
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { nome, slug, descricao, icone, destaque, ordem } = req.body;
    if (!nome) {
      return res.status(400).json({ sucesso: false, mensagem: 'O nome da categoria é obrigatório.' });
    }

    const catSlug = slug || nome.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const categoryId = await CategoryModel.create({ nome, slug: catSlug, descricao, icone, destaque, ordem });

    return res.status(201).json({
      sucesso: true,
      mensagem: 'Categoria criada com sucesso no sistema.',
      id: categoryId
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affected = await CategoryModel.update(id, req.body);
    if (affected === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada.' });
    }
    return res.status(200).json({ sucesso: true, mensagem: 'Categoria atualizada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affected = await CategoryModel.delete(id);
    if (affected === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada.' });
    }
    return res.status(200).json({ sucesso: true, mensagem: 'Categoria excluída com sucesso!' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
