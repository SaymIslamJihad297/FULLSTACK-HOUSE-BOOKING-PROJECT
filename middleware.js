const Listings = require('./models/listing.js');

module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        res.redirect('/login');
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next)=>{
    let { id } = req.params;
    let listing = await Listings.findById(id);
    if(res.locals.currUser &&!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not authorized");
        res.redirect('/listings');
    }
    next();
}