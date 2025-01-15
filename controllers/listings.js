const Listings = require('../models/listing');

module.exports.index = async (req, res) => {
    const listings = await Listings.find();
    // console.log(listings);
    res.render('./listings/index.ejs', { listings })
}

module.exports.renderNewRoute = (req, res) => {
    res.render('./listings/create.ejs');
}

module.exports.showDetails = async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id).populate({path: "reviews", populate: "author"}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect('/listings');
    }
    console.log(listing);
    res.render('./listings/show.ejs', { listing });
}

module.exports.createNewListing = async (req, res) => {
    // let result = listingSchema.validate(req.body);
    // // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    const newListing = new Listings(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect('/listings');
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect('/listings');
    }
    res.render('./listings/edit.ejs', { listing });
}

module.exports.updateRoute = async (req, res) => {
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteRoute = async (req, res) => {
    let { id } = req.params;
    let listing = await Listings.findById(id);
    let deletedValue = await Listings.findByIdAndDelete(id);
    console.log(deletedValue);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}