const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const verifyToken = require('../middlewares/auth.middleware');
const verifyAdmin = require('../middlewares/admin.middleware');

router.get('/stats', verifyToken, verifyAdmin, dashboardController.getDashboardStats);

module.exports = router;
