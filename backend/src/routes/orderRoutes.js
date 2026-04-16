const express = require('express');
const router = express.Router();

const { importExcel, getOrders, importFinalizados } = require('../controllers/orderController');

router.post('/import', importExcel);
router.post('/finalizados', importFinalizados);
router.get('/', getOrders);

module.exports = router;