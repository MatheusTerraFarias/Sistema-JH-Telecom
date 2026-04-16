const express = require('express');
const router = express.Router();

const { distribuir, setOnline, dashboard } = require('../controllers/adminController');

router.post('/distribuir', distribuir);
router.put('/online', setOnline);
router.get('/dashboard', dashboard);

module.exports = router;