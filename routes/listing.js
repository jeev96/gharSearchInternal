const express = require("express");
const router = express.Router();
const moment = require('moment');
const listingDbService = require("../services/database/listing");
const builderDbService = require("../services/database/builder");
const dbEntry = require("../services/dbEntry");
const utils = require("../services/utils");
const fileManager = require("../services/fileManager");
const listingType = require("../constants/listing");
const middleware = require("../services/middleware");
const { isLoggedIn, isAdmin } = middleware;

// submit route
router.get("/submit", isLoggedIn, function (req, res) {
    builderDbService.find().then((foundBuilders) => {
        res.render("listing/submit", { builders: foundBuilders, page: "submit" });
    }).catch((error) => {
        console.log(error);
        res.render("listing/submit", { builders: [], page: "submit" });
    });
});

// submit post route
router.post("/submit", isLoggedIn, function (req, res) {
    let newListing = dbEntry.createSubmitEntryResidential(req.user, req.body);

    listingDbService.create(newListing).then((newlyCreated) => {
        console.log(newlyCreated);
        res.status(201).send({ id: newlyCreated._id });
    }).catch((error) => {
        console.log(error);
        res.status(400).send(error);
    });
});

// submit media info post route
router.post("/submitMedia", isLoggedIn, function (req, res) {
    let mediaInfo = dbEntry.createSubmitEntryMedia(req.body);

    listingDbService.findByIdAndUpdate(req.body.listingId, { media: mediaInfo }).then((updatedListing) => {
        console.log(updatedListing);
        req.flash("success", "Successfully Created!");
        res.redirect("/account/my-properties");
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("back");
    });
});

// search route
router.post("/search", function (req, res) {
    const dbQuery = utils.getDbQuery(req.body);
    console.log(dbQuery);
    let listingCount = 0;

    listingDbService.count(dbQuery.searchQuery).then((count) => {
        console.log("Listings Found: " + count);
        listingCount = count;
        return listingDbService.find(dbQuery.searchQuery, dbQuery.filter, req.body.skip, req.body.limit);
    }).then((foundListings) => {
        let data = {
            listings: foundListings,
            listingsHtml: utils.renderListingsEjs({ listings: foundListings, moment: moment }, req.body.isListingSearch),
            tagsHtml: utils.renderTagsEjs({ listingCount: listingCount, tags: req.body, builderName: req.body.builderName, type: req.body.type }, req.body.isListingSearch),
            paginationBar: utils.renderPaginationBarEjs({ listingCount: listingCount, pageNo: req.body.page, limit: req.body.limit }, req.body.isListingSearch),
            loadButton: utils.renderLoadButtonEjs({ listingCount: listingCount, pageNo: req.body.page, limit: req.body.limit }, req.body.isListingSearch),
            isListingSearch: req.body.isListingSearch ? true : false
        }
        res.status(200).send(data);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error.message);
    });
});

// single listing route
router.get("/:id", function (req, res) {
    let listingId = utils.extractListingId(req.params.id);
    let foundListing;
    let similarListings;
    let featuredListings;

    listingDbService.findById(listingId).then((result) => {
        foundListing = result;
        let searchData = {
            "_id": { $in: foundListing.similarListings },
            "status": listingType.status.LIVE
        }
        return listingDbService.find(searchData);
    }).then((result) => {
        similarListings = result;
        console.log("Similar Listings: " + similarListings.length);
        let searchData = {
            "listingInfo.tags": { $in: [listingType.tagType.FEATURED] },
            "status": listingType.status.LIVE
        }
        return listingDbService.find(searchData);
    }).then((result) => {
        featuredListings = result;
        console.log("Featured Listings: " + featuredListings.length);
        return builderDbService.findById(foundListing.builderId);
    }).then((result) => {
        res.render("listing/show", {
            listing: foundListing,
            builderInfo: result,
            similarListings: similarListings,
            featuredListings: featuredListings,
            page: "single-listing"
        });
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("back");
    });
});

// put edit route
router.put("/:id", isLoggedIn, function (req, res) {
    let newData = dbEntry.createCompleteResidentialEntry(req.user, req.body);

    listingDbService.findByIdAndUpdate(req.params.id, newData).then((updatedListing) => {
        console.log("Listing updated");
        req.flash("success", "Successfully Updated!");
        res.redirect("/account/my-properties");
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("back");
    });
});

// get edit route
router.get("/:id/edit", isLoggedIn, function (req, res) {
    let foundListing;
    listingDbService.findById(req.params.id).then((result) => {
        foundListing = result;
        return builderDbService.find();
    }).then((result) => {
        res.render("listing/edit", { listing: foundListing, builders: result, page: "edit-listing" });
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("back");
    })
});

// change listing status
router.put("/:id/LIVE", isLoggedIn, isAdmin, function (req, res) {
    let foundListing;
    listingDbService.findById(req.params.id).then((result) => {
        foundListing = result;
        return fileManager.createLiveImages(foundListing._id, foundListing.media.images);
    }).then((response) => {
        console.log(response);
        return listingDbService.findByIdAndUpdate(req.params.id, { status: listingType.status.LIVE });
    }).then((result) => {
        console.log("Listing set to LIVE");
        req.flash("success", "Successfully Updated!");
        res.redirect("/account/all-properties");
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("back");
    });
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

    listingDbService.findByIdAndUpdate(req.params.id, { status: req.params.status }).then((result) => {
        console.log("Status updated.");
        req.flash("success", "Successfully Updated!");
        res.redirect("/account/all-properties");
    }).catch((error) => {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("back");
    });
});

module.exports = router;