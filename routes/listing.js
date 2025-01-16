const express = require('express');
const router = express.Router();
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/WrapAsync.js');
const Listings = require('../models/listing.js');
const { isLoggedIn } = require('../middleware.js');
const user = require('../models/user.js');
const { isOwner } = require('../middleware.js');
const listingController = require('../controllers/listings.js');

const validateSchema = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(validateSchema, wrapAsync(listingController.createNewListing));

// new route
router.get('/new', isLoggedIn, listingController.renderNewRoute);

router.route('/:id')
    .get(wrapAsync(listingController.showDetails))
    .put(isOwner, validateSchema, wrapAsync(listingController.updateRoute))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));


// edit route
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;