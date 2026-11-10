const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const verifyToken = require('../middlewares/auth.middleware');
const verifyAdmin = require('../middlewares/admin.middleware');

// Middleware opcional para anexar usuário se o token for fornecido no checkout
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    try {
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_luminary_enterprise_key_2026');
    } catch (e) {
      // Ignorar erro se token for inválido no checkout opcional
    }
  }
  next();
};

router.post('/', optionalAuth, orderController.createOrder);
router.get('/me', verifyToken, orderController.getMyOrders);
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
router.get('/:id', verifyToken, orderController.getOrderById);
router.put('/:id/status', verifyToken, verifyAdmin, orderController.updateOrderStatus);
router.delete('/:id', verifyToken, verifyAdmin, orderController.deleteOrder);

module.exports = router;
