const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const verifyToken = require('../middlewares/auth.middleware');
const verifyAdmin = require('../middlewares/admin.middleware');
const upload = require('../middlewares/multer.middleware');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', verifyToken, verifyAdmin, upload.array('images', 5), productController.createProduct);
router.put('/:id', verifyToken, verifyAdmin, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, productController.deleteProduct);

module.exports = router;
