const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const { signUp, renderLogin, LoginUser, logOutUser, renderSignUp } = require('../controllers/users.js');


router.route('/signup')
    .get(renderSignUp)
    .post(signUp);

router.route('/login')
    .get(renderLogin)
    .post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), LoginUser);

router.get('/logout', logOutUser);

module.exports = router;