const router = require('express').Router();
const passportConf = require('../config/passport');

products_controller = require('../controllers/products_controller');

router.get('/search', products_controller.search);
router.post('/search', (req, res, next) => {
    res.redirect('/search?q=' + req.body.q);
});
router.get('/categories/:id/products', products_controller.products_by_category);
router.get('/products/:id', products_controller.get_product);

module.exports = router;
