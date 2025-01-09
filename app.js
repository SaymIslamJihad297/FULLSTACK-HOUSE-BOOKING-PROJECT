const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Listings = require('./models/listing.js');
const exp = require('constants');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/WrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const listingSchema = require('./schema.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')))

main().then(()=>{
    console.log("Connected to database");
}).catch(()=>{
    console.log("Error");
})


const validateSchema = (req, res, next)=>{
    let {error} =  listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

app.get('/', (req, res)=>{
    res.send("Hi i am root");
})

// index route start here
app.get('/listings', wrapAsync(async (req, res)=>{
    const listings = await Listings.find();
    // console.log(listings);
    res.render('./listings/index.ejs', {listings})
}))

// new route
app.get('/listings/new', (req, res)=>{
    res.render('./listings/create.ejs');
})

// show route
app.get('/listings/:id', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render('./listings/show.ejs', {listing});
}))

// create route
app.post('/listings',validateSchema, wrapAsync(async (req, res)=>{
    // let result = listingSchema.validate(req.body);
    // // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    const newListing = new Listings(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}))

// edit route
app.get('/listing/:id/edit', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render('./listings/edit.ejs', {listing});
}))

app.put('/listings/:id', validateSchema, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

// delete route
app.delete('/listings/:id', wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let deletedValue = await Listings.findByIdAndDelete(id);
    console.log(deletedValue);
    res.redirect("/listings")
}));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})
app.use((err, req, res, next)=>{
    let {StatusCode = 500, message="Some error happend"} = err;
    res.status(StatusCode).render('error.ejs', {StatusCode, message});
    // res.status(StatusCode).send(message);
})
const port = 8080;
app.listen(port, ()=>{
    console.log(`App started listening on port ${port}`);
})