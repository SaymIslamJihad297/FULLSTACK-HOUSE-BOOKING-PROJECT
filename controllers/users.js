const User = require('../models/user');

module.exports.renderSignUp = (req, res) => {
    if (req.isAuthenticated()) {
        req.flash("error", "you already signed in");
        res.redirect('/listings');
    } else {
        res.render("./users/signup.ejs")
    }
}

module.exports.signUp = async (req, res) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render("./users/login.ejs");
}


module.exports.LoginUser = (req, res) => {
    req.flash("success", "Welcome Back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logOutUser = (req, res, next) => {
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
}