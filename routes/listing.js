const express = require("express");
const router = express.Router();
const moment = require('moment')
const dbEntry = require("../services/dbEntry");
const utils = require("../services/utils");
const fileManager = require("../services/fileManager");
const listingType = require("../constants/listing");
const Listing = require("../models/listing");
const Builder = require("../models/builder");
const middleware = require("../services/middleware");
const { isLoggedIn, isAdmin } = middleware;

// submit route
router.get("/submit", isLoggedIn, function (req, res) {
    Builder.find({}).exec(function (error, foundBuilders) {
        if (error) {
            console.log(err);
            res.render("listing/submit", { builders: [], page: "submit" });
        } else {
            res.render("listing/submit", { builders: foundBuilders, page: "submit" });
        }
    });
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
    Listing.countDocuments(dbQuery.searchQuery).exec((error, count) => {
        if (error) {
            console.log(error);
            res.status(400).send();
        }
        else {
            Listing.find(dbQuery.searchQuery).skip(parseInt(req.body.skip)).limit(parseInt(req.body.limit)).sort(dbQuery.filter).exec((error, foundListings) => {
                if (error) {
                    console.log(error);
                    res.status(400).send();
                } else {
                    console.log("Listings Found: " + count);
                    let data = {
                        listings: foundListings,
                        listingsHtml: utils.renderListingsEjs({ listings: foundListings, moment: moment }, req.body.isListingSearch),
                        tagsHtml: utils.renderTagsEjs({ listingCount: count, tags: req.body, builderName: req.body.builderName, type: req.body.type }, req.body.isListingSearch),
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
    let listingId = utils.extractListingId(req.params.id);
    Listing.findOne({ _id: listingId }, function (error, foundListing) {
        if (error) {
            console.log(error);
            req.flash("error", error.message);
            res.redirect("back");
        } else {
            let searchData = {
                "_id": { $in: foundListing.similarListings },
                "status": listingType.status.LIVE
            }
            Listing.find(searchData, function (error, similarListings) {
                if (error) {
                    console.log(error);
                    req.flash("error", error.message);
                    res.redirect("back");
                } else {
                    console.log("Similar Listings: " + similarListings.length);
                    let searchData = {
                        "listingInfo.tags": { $in: [listingType.tagType.FEATURED] },
                        "status": listingType.status.LIVE
                    }
                    Listing.find(searchData, function (error, featuredListings) {
                        if (error) {
                            console.log(error);
                            req.flash("error", error.message);
                            res.redirect("back");
                        } else {
                            Builder.findById({ _id: foundListing.builderId }, function (error, foundBuilder) {
                                if (error) {
                                    console.log(error);
                                    req.flash("error", error.message);
                                    res.redirect("back");
                                } else {
                                    console.log("Featured Listings: " + featuredListings.length);
                                    res.render("listing/show", {
                                        listing: foundListing,
                                        builderInfo: foundBuilder,
                                        similarListings: similarListings,
                                        featuredListings: featuredListings,
                                        page: "single-listing"
                                    });
                                }
                            });
                        }
                    });
                }
            });
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

// get edit route
router.get("/:id/edit", isLoggedIn, function (req, res) {
    Builder.find({}).exec(function (error, foundBuilders) {
        if (error) {
            console.log(err);
            res.redirect("back");
        } else {
            Listing.findOne({ _id: req.params.id }, function (err, foundListing) {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    res.render("listing/edit", { listing: foundListing, builders: foundBuilders, page: "edit-listing" });
                }
            });
        }
    });
});

// change listing status
router.put("/:id/LIVE", isLoggedIn, isAdmin, function (req, res) {
    Listing.findOne({ _id: req.params.id }, function (err, foundListing) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            fileManager.createLiveImages(foundListing._id, foundListing.media.images).then((response) => {
                console.log(response);
                Listing.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: listingType.status.LIVE } }, function (err, updatedListing) {
                    if (err) {
                        console.log(err);
                        req.flash("error", err.message);
                        res.redirect("back");
                    } else {
                        req.flash("success", "Successfully Updated!");
                        res.redirect("/account/all-properties");
                    }
                });
            }).catch((error) => {
                console.log(error);
                req.flash("error", error.message);
                res.redirect("back");
            })
        }
    })
});

// change listing status
router.put("/:id/:status", isLoggedIn, function (req, res) {
    if (!utils.checkListingStatus(req.params.status)) {
        req.flash("error", "Cannot perform Action.");
        res.redirect("back");
    } else if (req.user.userType !== "ADMIN" && [listingType.status.REJECTED].indexOf(req.params.status) > -1) {
        req.flash("error", "Cannot perform Action.");
        res.redirect("back");
    }
    Listing.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: req.params.status } }, function (err, updatedListing) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/account/all-properties");
        }
    });
});

module.exports = router;