const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);
router.post('/register', authController.register);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
