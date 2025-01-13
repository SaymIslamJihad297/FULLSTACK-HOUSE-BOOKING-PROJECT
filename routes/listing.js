const express = require('express');
const router = express.Router();
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/WrapAsync.js');
const Listings = require('../models/listing.js');
const {isLoggedIn} = require('../middleware.js');

const validateSchema = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}
// index route start here
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listings.find();
    // console.log(listings);
    res.render('./listings/index.ejs', { listings })
}))

// new route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('./listings/create.ejs');
})

// show route
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect('/listings');
    }
    res.render('./listings/show.ejs', { listing });
}))

// create route
router.post('/', validateSchema, wrapAsync(async (req, res) => {
    // let result = listingSchema.validate(req.body);
    // // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    const newListing = new Listings(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect('/listings');
}))

// edit route
router.get('/:id/edit', isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect('/listings');
    }
    res.render('./listings/edit.ejs', { listing });
}))

router.put('/:id', validateSchema, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listings.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}))

// delete route
router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedValue = await Listings.findByIdAndDelete(id);
    console.log(deletedValue);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}));


module.exports = router;