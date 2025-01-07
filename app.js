const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Listings = require('./models/listing.js');
const exp = require('constants');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


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


app.get('/', (req, res)=>{
    res.send("Hi i am root");
})

// index route start here
app.get('/listings', async (req, res)=>{
    const listings = await Listings.find();
    // console.log(listings);
    res.render('./listings/index.ejs', {listings})
})


app.get('/listings/new', (req, res)=>{
    res.render('./listings/create.ejs');
})

// show route
app.get('/listings/:id', async (req, res)=>{
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render('./listings/show.ejs', {listing});
})

app.post('/listings', async (req, res)=>{
    const newListing = new Listings(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
})

app.get('/listing/:id/edit', async (req, res)=>{
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render('./listings/edit.ejs', {listing});
})

app.put('/listings/:id',async (req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

app.delete('/listings/:id', async (req, res)=>{
    let {id} = req.params;
    let deletedValue = await Listings.findByIdAndDelete(id);
    console.log(deletedValue);
    res.redirect("/listings")
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const port = 8080;
app.listen(port, ()=>{
    console.log(`App started listening on port ${port}`);
})