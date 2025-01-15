const Listings = require('../models/listing');
const Review = require('../models/reviews');

module.exports.createReview = async (req, res) => {
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "Feedback successful");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner");
        res.redirect('/listings');
    } else {
        await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Feedback Deleted Successfully")
        res.redirect(`/listings/${id}`);
    }   
}