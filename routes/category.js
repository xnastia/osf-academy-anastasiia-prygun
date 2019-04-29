const router = require('express').Router();
const passportConf = require('../config/passport');

categories_controller = require('../controllers/categories_controller');

router.get("/", categories_controller.get_categories);
router.get("/categories/:id/subcategories", categories_controller.get_sub_categories);

module.exports = router;
