const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const verifyToken = require('../middlewares/auth.middleware');
const verifyAdmin = require('../middlewares/admin.middleware');

router.get('/', verifyToken, verifyAdmin, clientController.getAllClients);
router.get('/:id', verifyToken, verifyAdmin, clientController.getClientById);
router.put('/:id', verifyToken, verifyAdmin, clientController.updateClient);
router.delete('/:id', verifyToken, verifyAdmin, clientController.deleteClient);

module.exports = router;
