const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const {signUp, renderLogin, LoginUser, logOutUser, renderSignUp} = require('../controllers/users.js');

router.get('/signup', renderSignUp);

router.post('/signup', signUp);

router.get('/login', renderLogin);

router.post('/login', saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), LoginUser);

router.get('/logout', logOutUser);

module.exports = router;