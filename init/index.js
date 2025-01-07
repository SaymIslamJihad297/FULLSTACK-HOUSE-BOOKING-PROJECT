const mongoose = require('mongoose');
const Listing = require('../models/listing.js')
const initData = require('./data.js');

main().then(()=>{
    console.log("Connected to database");
}).catch(()=>{
    console.log("Error");
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

async function initDb() {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log('Data was initialized');
}

initDb();