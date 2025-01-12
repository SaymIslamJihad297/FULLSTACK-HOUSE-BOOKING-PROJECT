const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/reviews.js');
const {reviewSchema} = require('../schema.js');
const wrapAsync = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listings = require('../models/listing.js');

const validatereviewSchema = (req, res, next)=>{
    let {error} =  reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

// reviews
router.post('/', validatereviewSchema, wrapAsync(async(req, res)=>{
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "Feedback successful");
    res.redirect(`/listings/${listing._id}`);
}));

router.delete('/:reviewId', wrapAsync(async(req, res)=>{
    let {id, reviewId} = req.params;

    await Listings.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Feedback Deleted Successfully")
    res.redirect(`/listings/${id}`);
}));

module.exports = router;