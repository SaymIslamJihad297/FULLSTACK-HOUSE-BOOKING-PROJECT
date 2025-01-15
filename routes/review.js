const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/reviews.js');
const { reviewSchema } = require('../schema.js');
const wrapAsync = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listings = require('../models/listing.js');
const { isLoggedIn, isOwner } = require('../middleware.js');
const {createReview, deleteReview} = require('../controllers/reviews.js');

const validatereviewSchema = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

// reviews
router.post('/', isLoggedIn, validatereviewSchema, wrapAsync(createReview));

router.delete('/:reviewId', isLoggedIn, wrapAsync(deleteReview));

module.exports = router;