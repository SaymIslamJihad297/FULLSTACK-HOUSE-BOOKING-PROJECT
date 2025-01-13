const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

router.get('/signup', (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "you already signed in");
        res.redirect('/listings');
    } else {
        res.render("./users/signup.ejs")
    }
})

router.post('/signup', async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to your dashboard");
            res.redirect('/listings');
        })
    } catch (er) {
        req.flash("error", er.message);
        res.redirect('/signup');
    }
})

router.get('/login', (req, res) => {
    res.render("./users/login.ejs");
})

router.post('/login', saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
    req.flash("success", "Welcome Back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You Have been loged out");
            res.redirect('/login');
        })
    } else {
        req.flash("error", "You are already logged out");
        res.redirect("/listings");
    }
})

module.exports = router;