const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const orderRoutes = require('./order.routes');
const clientRoutes = require('./client.routes');
const newsletterRoutes = require('./newsletter.routes');
const dashboardRoutes = require('./dashboard.routes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/clients', clientRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/dashboard', dashboardRoutes);

// Rota de Healthcheck do Sistema
router.get('/health', (req, res) => {
  res.status(200).json({
    sucesso: true,
    status: 'ONLINE',
    servico: 'Luminary Store Enterprise API REST',
    tempo_ativo: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
