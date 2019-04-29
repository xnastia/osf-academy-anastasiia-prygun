const router = require('express').Router();

payments_controller = require('../controllers/payments_controller');

router.post('/currency', payments_controller.currency);
router.post('/payment', payments_controller.payment);

module.exports = router;
