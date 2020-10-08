const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const dbEntry = require("../services/dbEntry");
const utils = require("../services/utils");
const listingType = require("../constants/listing");
const Builder = require("../models/builder");
const listingDbService = require("../services/database/listing");
const builderDbService = require("../services/database/builder");
const dbConstants = require("../constants/dbConstants");
const middleware = require("../services/middleware");
const { isLoggedIn, isAdmin } = middleware;

// index route
router.get("/", function (req, res) {
    builderDbService.find().then((foundBuilders) => {
        res.render("builder/index", { builders: foundBuilders, page: "builder-index" });
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.render("builder/index", { builders: [], page: "builder-index" });
    });
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

    builderDbService.create(newListing).then((newlyCreated) => {
        console.log(newlyCreated);
        res.redirect("/builder");
    }).catch((error) => {
        console.log(error);
        res.redirect("back");
    });
});

// single builder route
router.get("/:id", function (req, res) {
    let listingId = utils.extractListingId(req.params.id);
    let foundBuilder;
    builderDbService.findById(listingId).then((result) => {
        foundBuilder = result;
        return listingDbService.find({ builderId: listingId, status: listingType.status.LIVE });
    }).then((foundListings) => {
        console.log("Found listings:" + foundListings.length);
        res.render("builder/show", {
            builder: foundBuilder,
            listings: foundListings,
            listingCount: foundListings.length,
            pageNo: 1,
            limit: dbConstants.DEFAULT_LIMIT_LISTING,
            page: "show-builder"
        });
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("back");
    });
});

// put edit route
router.put("/:id", isLoggedIn, isAdmin, function (req, res) {
    let newData = dbEntry.createBuilderEntry(req.body);
    console.log(newData);

    builderDbService.findByIdAndUpdate(req.params.id, newData).then((updatedBuilder) => {
        console.log("Successfully Updated!");
        req.flash("success", "Successfully Updated!");
        res.redirect("/account/builder");
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("back");
    });
});

// get edit route
router.get("/:id/edit", isLoggedIn, isAdmin, function (req, res) {
    builderDbService.findById(req.params.id).then((foundBuilder) => {
        res.render("builder/edit", { builder: foundBuilder, page: "edit-builder" });
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("back");
    });
});

module.exports = router;