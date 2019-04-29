// external imports
const router = require('express').Router();
const passport = require('passport');
const passportConf = require('../config/passport');
users_controller = require('../controllers/users_controller');

router.get('/login', users_controller.get_login);
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));
router.get('/profile', passportConf.isAuthenticated, users_controller.get_profile);
router.get('/signup', users_controller.get_signup);
router.post('/signup', users_controller.post_signup);
router.get('/logout', users_controller.logout);
router.get('/edit-profile', users_controller.get_edit_profile);

router.post('/edit-profile', users_controller.post_edit_profile);

router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));



router.get('/forgot', users_controller.get_forgot);
router.post('/forgot', users_controller.post_forgot);
router.get('/reset/:token', users_controller.get_reset);
router.post('/reset', users_controller.post_reset);

module.exports = router;
