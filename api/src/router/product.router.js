const express = require('express');
const {
    handleVnpayIpnUrl,
    handleVnpayReturn,
    getAllProduct,
    getProductByCategory,
    updateProduct,
    deleteProduct,
    createProduct,
    getProductByID,
    filterProduct,
    createPaymentUrl,
    handleGetPurchase
} = require('../controller/product.controller');

const { verifyTokenByAdmin, verifyToken } = require('../middleware/verifyToken');

const router = express.Router();
router.post('/api/products/create', verifyTokenByAdmin, createProduct);

// ADMIN
router.get('/api/products/:id', verifyTokenByAdmin, getProductByID);

// ADMIN
router.post('/api/products/list', verifyTokenByAdmin, getAllProduct);

// ADMIN
router.patch('/api/products/update/:id', verifyTokenByAdmin, updateProduct);

// ADMIN
router.delete('/api/products/delete/:id', verifyTokenByAdmin, deleteProduct);

// USER
router.post('/api/products/category/:category', getProductByCategory);

router.post('/api/products/find', filterProduct);

// Create payment
router.post('/api/create_payment_url', verifyToken, createPaymentUrl);

// vnpay ipn url
router.get('/api/vnpay_ipn', verifyToken, handleVnpayIpnUrl);

// vnpay return
router.post('/api/vnpay_return', verifyToken, handleVnpayReturn);

// get purchase order
router.get('/api/get_purchase', verifyToken, handleGetPurchase);

module.exports = router;
