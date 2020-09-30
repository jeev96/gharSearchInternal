const express = require("express");
const router = express.Router();
const moment = require('moment')
const dbEntry = require("../services/dbEntry");
const utils = require("../services/utils");
const Listing = require("../models/listing");
const middleware = require("../services/middleware");
const { isLoggedIn, isAdmin } = middleware;

// submit route
router.get("/submit", isLoggedIn, function (req, res) {
    res.render("listing/submit", { page: "submit" });
});

// submit post route
router.post("/submit", isLoggedIn, function (req, res) {
    let newListing = dbEntry.createSubmitEntryResidential(req.user, req.body);

    Listing.create(newListing, function (err, newlyCreated) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            //redirect back to listings page
            console.log(newlyCreated);
            res.status(200).send({ id: newlyCreated._id });
        }
    });
});

// submit media info post route
router.post("/submitMedia", isLoggedIn, function (req, res) {
    let mediaInfo = dbEntry.createSubmitEntryMedia(req.body);

    Listing.findByIdAndUpdate(req.body.listingId, { $set: { media: mediaInfo } }, function (err, newlyCreated) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            //redirect back to listings page
            console.log(newlyCreated);
            req.flash("success", "Successfully Created!");
            res.redirect("/account/my-properties");
        }
    });
});

// search route
router.post("/search", function (req, res) {
    const dbQuery = utils.getDbQuery(req.body);
    console.log(dbQuery);
    Listing.countDocuments(dbQuery.searchQuery).exec((err, count) => {
        if (err) {
            console.log(err);
            res.status(400).send();
        }
        else {
            Listing.find(dbQuery.searchQuery).skip(parseInt(req.body.skip)).limit(parseInt(req.body.limit)).sort(dbQuery.filter).exec((err, foundListings) => {
                if (err) {
                    console.log(err);
                    res.status(400).send();
                } else {
                    console.log("Listings Found: " + count);
                    let data = {
                        listings: foundListings,
                        listingsHtml: utils.renderListingsEjs({ listings: foundListings, moment: moment }, req.body.isListingSearch),
                        tagsHtml: utils.renderTagsEjs({ listingCount: count, tags: req.body, type: req.body.type }, req.body.isListingSearch),
                        paginationBar: utils.renderPaginationBarEjs({ listingCount: count, pageNo: req.body.page, limit: req.body.limit }, req.body.isListingSearch),
                        loadButton: utils.renderLoadButtonEjs({ listingCount: count, pageNo: req.body.page, limit: req.body.limit }, req.body.isListingSearch),
                        isListingSearch: req.body.isListingSearch ? true : false
                    }
                    res.status(200).send(data);
                }
            });
        }
    });
});

// single listing route
router.get("/:id", function (req, res) {
    Listing.findOne({ _id: req.params.id }, function (err, foundListing) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("listing/show", { listing: foundListing, page: "single-listing" });
        }
    });
});

// get edit route
router.get("/:id/edit", isLoggedIn, function (req, res) {
    Listing.findOne({ _id: req.params.id }, function (err, foundListing) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("listing/edit", { listing: foundListing, page: "edit-listing" });
        }
    });
});

// put edit route
router.put("/:id", isLoggedIn, function (req, res) {
    let newData = dbEntry.createCompleteResidentialEntry(req.user, req.body);
    console.log(newData);

    Listing.findByIdAndUpdate({ _id: req.params.id }, { $set: newData }, function (err, updatedListing) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/account/my-properties");
        }
    });
});


module.exports = router;