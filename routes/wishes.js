const router = require('express').Router();
const passportConf = require('../config/passport');

wishes_controller = require('../controllers/wishes_controller');

router.post('/wishlist', passportConf.isAuthenticated, wishes_controller.wishlist)
router.get('/wishes', passportConf.isAuthenticated, wishes_controller.get_wishes)

module.exports = router;
