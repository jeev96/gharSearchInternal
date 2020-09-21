const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const dbEntry = require("../services/dbEntry");
const Listing = require("../models/listing");
const User = require("../models/user");
let utils = require("../services/utils");
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
    failureFlash: true,
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
    User.register(new User(newUser), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.redirect("back");
        }
        res.status(201).redirect("/");
    });
});

// logout route
router.get("/logout", function (req, res) {
    req.logout();
    res.status(204).redirect("/");
});

// submit new details
router.post("/edit-profile", function (req, res) {
    let newUser = dbEntry.createUserEntry(req.body);
    User.findByIdAndUpdate(req.user.id, { $set: newUser }, function (err, updatedUser) {
        if (err) {
            req.flash("error", err.message);
            res.status(400).redirect("back");
        } else {
            console.log(updatedUser);
            req.flash("success", "Details successfully updated!");
            res.status(204).redirect("/account/profile");
        }
    });
});

// change password
router.post("/change-password", function (req, res) {
    if (req.body.passwordNew !== req.body.passwordConfirm) {
        req.flash("error", "Passwords do not Match!");
        return res.redirect("back");
    }
    User.findById(req.user.id, function (err, user) {
        if (err) {
            req.flash("error", "Could not find user");
            res.status(400).redirect("/");
        } else {
            user.changePassword(req.body.passwordOld, req.body.passwordNew, function (err) {
                if (err) {
                    console.log("Error");
                    req.flash("error", "Your Current password is incorrect.");
                    res.status(400).redirect("back");
                } else {
                    console.log("Success");
                    req.flash("success", "Password successfully changed!");
                    res.status(204).redirect("/account/profile");
                }
            })
        }
    })
});

// profile route
router.get("/profile", isLoggedIn, function (req, res) {
    res.render("account/profile", { page: "profile" });
});

// submit route
router.get("/submit", isLoggedIn, function (req, res) {
    res.render("account/submit", { page: "submit" });
});

// submit post route
router.post("/submit", isLoggedIn, function (req, res) {
    let newListing = utils.createSubmitEntryResidential(req.user, req.body);

	Listing.create(newListing, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			//redirect back to listings page
			console.log(newlyCreated);
			res.redirect("/listings");
		}
	});
});

// profile route
router.get("/my-properties", isLoggedIn, function (req, res) {
    Listing.find({ "author.id": req.user._id }).exec((err, foundListings) => {
        if (err) {
            console.log(err);
            res.render("account/my-properties", { listings: [], page: "my-properties" });
        } else {
            console.log("Listings Found: " + foundListings.length);
            res.render("account/my-properties", { listings: foundListings, page: "my-properties" });
        }
    });
});



module.exports = router;