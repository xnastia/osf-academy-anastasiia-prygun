const router = require('express').Router();
const passportConf = require('../config/passport');

cart_controller = require('../controllers/cart_controller');

router.post('/products/:product_id', passportConf.isAuthenticated, cart_controller.add);
router.get('/cart', passportConf.isAuthenticated, cart_controller.get_cart);
router.post('/remove', passportConf.isAuthenticated, cart_controller.remove);

module.exports = router;
