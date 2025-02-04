if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const exp = require('constants');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');

const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const dbUrl = process.env.ATLASDB_URL;
const secretKey = process.env.SECRET_KEY;

main().then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.dir(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: secretKey,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("Error in mongo session store", err);
    
})

const sessionOption = {
    store,
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')))

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res)=>{
    res.redirect('/listings');
})

// app.get('/demouser', async(req, res)=>{
//     let fakeUser = new User({
//         email: "saymislam365@gmail.com",
//         username: "saymislamjihad"
//     })
//     let registeredUser =   await User.register(fakeUser, "andajedepassword");
//     res.send(registeredUser)
// })

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currUser = req.user;
    next();
})

app.use('/listings', listingsRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);


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