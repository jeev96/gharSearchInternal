const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    session = require('express-session'),
    fileupload = require("express-fileupload");
    MongoStore = require('connect-mongo')(session),
    User = require("./models/user"),
    flash = require("connect-flash"),
    methodOverride = require("method-override");

let testScript = require("./services/testScript");

// configure dotenv
require('dotenv').config();

// routes
let indexRoutes = require("./routes/index");
let filterRoutes = require("./routes/filter");
let listingRoutes = require("./routes/listing");
let listingOperationRoutes = require("./routes/listingOperation");
let accountRoutes = require("./routes/account");
let mediaRoutes = require("./routes/media");
let userRoutes = require("./routes/user");
let leadRoutes = require("./routes/lead");

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

// const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/ghar_search';
const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/property_db';

console.log(databaseUri);

mongoose.connect(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log(`Database connected`))
    .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json()); app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(fileupload());
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

// PASSPORT CONFIGURATION
app.use(session({
    secret: "Flat Broker Rent Lease Mortgage Plot Shop",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    app.locals.moment = require('moment');
    res.locals.compare = req.session.compare || [];
    res.locals.favourite = req.session.favourite || [];
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// root route
app.use("/", indexRoutes);
app.use("/filter", filterRoutes);
app.use("/listing", listingRoutes);
app.use("/listingOperation", listingOperationRoutes);
app.use("/account", accountRoutes);
app.use("/media", mediaRoutes);
app.use("/user", userRoutes);
app.use("/lead", leadRoutes);

// testScript.imageScript();

app.listen(3000, function () {
    console.log("The server has started!");
});