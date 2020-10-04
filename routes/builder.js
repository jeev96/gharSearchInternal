const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const dbEntry = require("../services/dbEntry");
const Builder = require("../models/builder");
const middleware = require("../services/middleware");
const { isLoggedIn, isAdmin } = middleware;

// index route
router.get("/", function (req, res) {
    Builder.find({}, function (error, foundBuilders) {
        if (error) {
            console.log(error);
            req.flash("error", error.message);
            res.render("builder/index", { builders: [], page: "builder-index" });
        } else {
            res.render("builder/index", { builders: foundBuilders, page: "builder-index" });
        }
    })
});

// submit route
router.get("/submit", isLoggedIn, isAdmin, function (req, res) {
    let builder = new Builder();
    res.render("builder/submit", { builder: builder, page: "builder-submit" });
});

// submit post route
router.post("/submit", isLoggedIn, isAdmin, function (req, res) {
    let newListing = dbEntry.createBuilderEntry(req.body);

    newListing["_id"] = new mongoose.mongo.ObjectId(req.body.builderId);
    Builder.create(newListing, function (err, newlyCreated) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            //redirect back to listings page
            console.log(newlyCreated);
            res.redirect("/builders");
        }
    });
});

// single builder route
router.get("/:id", function (req, res) {
    Builder.findOne({ _id: req.params.id }, function (error, foundBuilder) {
        if (error) {
            console.log(error);
            req.flash("error", error.message);
            res.redirect("back");
        } else {
            res.render("builder/show", { builder: foundBuilder, page: "show-builder" });
        }
    });
});

// put edit route
router.put("/:id", isLoggedIn, isAdmin, function (req, res) {
    let newData = dbEntry.createBuilderEntry(req.body);
    console.log(newData);

    Builder.findByIdAndUpdate({ _id: req.params.id }, { $set: newData }, function (err, updatedListing) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/account/builder");
        }
    });
});

// get edit route
router.get("/:id/edit", isLoggedIn, isAdmin, function (req, res) {
    Builder.findOne({ _id: req.params.id }, function (err, foundBuilder) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("builder/edit", { builder: foundBuilder, page: "edit-builder" });
        }
    });
});

module.exports = router;