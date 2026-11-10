const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const verifyToken = require('../middlewares/auth.middleware');
const verifyAdmin = require('../middlewares/admin.middleware');

router.post('/', newsletterController.subscribe);
router.get('/', verifyToken, verifyAdmin, newsletterController.getAllLeads);
router.delete('/:id', verifyToken, verifyAdmin, newsletterController.deleteLead);

module.exports = router;
