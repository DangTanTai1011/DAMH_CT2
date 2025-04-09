const express = require('express');
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const router = express.Router();

router.get('/:userId', getCart);
router.post('/', addToCart);
router.post('/remove', removeFromCart);

module.exports = router;
