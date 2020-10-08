const express = require("express");
const router = express.Router();
const passport = require("passport");
const dbEntry = require("../services/dbEntry");
const listingDbService = require("../services/database/listing");
const builderDbService = require("../services/database/builder");
const userDbService = require("../services/database/user");
const leadDbService = require("../services/database/lead");
const middleware = require("../services/middleware");
const { isLoggedIn, isAdmin } = middleware;

// login
router.get("/login", function (req, res) {
    res.render("account/login", { page: "login" });
});

// handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/account/login",
    failureFlash: "Username or Password is incorrect!",
    successFlash: 'Welcome to Ghar Search!'
}), function (req, res) {
});

// show register form
router.get("/register", function (req, res) {
    res.render("account/register", { page: "register" });
});

//handle sign up logic
router.post("/register", function (req, res) {
    if (req.body.password !== req.body.passwordConfirm) {
        req.flash("error", "Passwords do not Match!");
        return res.redirect("back");
    }
    let newUser = dbEntry.createUserEntry(req.body);
    userDbService.register(newUser, req.body.password).then((result) => {
        req.flash("success", "User creation Successful!");
        res.status(201).redirect("/");
    }).catch((error) => {
        console.log(error);
        req.flash("error", "Some error occurerd.");
        return res.redirect("back");
    });
});

// logout route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logout Successful!");
    res.status(204).redirect("/");
});

// submit new details
router.post("/edit-profile", function (req, res) {
    let newUser = dbEntry.createUserEntry(req.body);
    userDbService.findByIdAndUpdate(req.user.id, newUser).then((updatedUser) => {
        console.log(updatedUser);
        req.flash("success", "Details successfully updated!");
        res.status(204).redirect("/account/profile");
    }).catch((error) => {
        req.flash("error", error.message);
        res.status(400).redirect("back");
    });
});

// change password
router.post("/change-password", function (req, res) {
    if (req.body.passwordNew !== req.body.passwordConfirm) {
        req.flash("error", "Passwords do not Match!");
        return res.redirect("back");
    }
    userDbService.findById(req.user.id).then((user) => {
        user.changePassword(req.body.passwordOld, req.body.passwordNew, function (err) {
            if (err) {
                console.log(err);
                req.flash("error", "Your Current password is incorrect.");
                res.status(400).redirect("back");
            } else {
                console.log("Success");
                req.flash("success", "Password successfully changed!");
                res.status(204).redirect("/account/profile");
            }
        });
    }).catch((error) => {
        console.log(error);
        req.flash("error", "Could not find user");
        res.status(400).redirect("/");
    });
});

// profile route
router.get("/profile", isLoggedIn, function (req, res) {
    res.render("account/profile", { page: "profile" });
});

// profile route
router.get("/my-properties", isLoggedIn, function (req, res) {
    listingDbService.find({ "author.id": req.user._id }, { lastModified: -1, status: -1 }).then((foundListings) => {
        console.log("Listings Found: " + foundListings.length);
        res.render("account/my-properties", { listings: foundListings, page: "my-properties" });
    }).catch((error) => {
        console.log(error);
        res.render("account/my-properties", { listings: [], page: "my-properties" });
    });
});

// profile route
router.get("/all-properties", isLoggedIn, function (req, res) {
    listingDbService.find({}, { lastModified: -1, status: -1 }).then((foundListings) => {
        console.log("Listings Found: " + foundListings.length);
        res.render("account/my-properties", { listings: foundListings, page: "all-properties" });
    }).catch((error) => {
        console.log(error);
        res.render("account/my-properties", { listings: [], page: "all-properties" });
    });
});

// builders route
router.get("/builder", function (req, res) {
    builderDbService.find().then((foundBuilders) => {
        res.render("account/builder", { builders: foundBuilders, page: "builder-admin" });
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.render("account/builder", { builders: [], page: "builder-index" });
    });
});

// lead route
router.get("/leads", isLoggedIn, isAdmin, function (req, res) {
    leadDbService.find({}, { createdAt: -1, status: -1 }).then((foundLeads) => {
        console.log("Leads Found: " + foundLeads.length);
        res.render("account/leads", { leads: foundLeads, page: "leads" });
    }).catch((error) => {
        console.log(error);
        res.render("account/leads", { leads: [], page: "leads" });
    });
});

module.exports = router;