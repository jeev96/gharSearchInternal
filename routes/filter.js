const express = require("express");
const router = express.Router();
const utils = require("../services/utils");
const listingType = require("../constants/listing");
const dbConstants = require("../constants/dbConstants");
const listingDbService = require("../services/database/listing");

// type route
router.get("/:type", function (req, res) {
    const type = utils.getListingType(req.params.type);
    const searchQuery = { "propertyType.type": type, "status": listingType.status.LIVE };
    let count;
    listingDbService.count(searchQuery).then((result) => {
        count = result;
        return listingDbService.find(searchQuery, {}, dbConstants.DEFAULT_SKIP, dbConstants.DEFAULT_LIMIT_LISTING);
    }).then((allListings) => {
        console.log("Listings Found: " + count);
        res.render("index/show", {
            listings: allListings,
            type: type,
            subtype: null,
            listingCount: count,
            pageNo: 1,
            limit: dbConstants.DEFAULT_LIMIT_LISTING,
            page: "listings-" + req.params.type
        });
    }).catch((error) => {
        console.log(error);
        res.redirect("/", 400);
    });
});

// type subtype
router.get("/:type/:subtype", function (req, res) {
    const type = utils.getListingType(req.params.type);
    const listingSubtype = utils.getListingSubtype(req.params.subtype);
    const searchQuery = { "propertyType.type": type, "propertyType.subtype": listingSubtype, "status": listingType.status.LIVE };
    let count;
    listingDbService.count(searchQuery).then((result) => {
        count = result;
        return listingDbService.find(searchQuery, {}, dbConstants.DEFAULT_SKIP, dbConstants.DEFAULT_LIMIT_LISTING);
    }).then((allListings) => {
        console.log("Listings Found: " + count);
        res.render("index/show", {
            listings: allListings,
            type: type,
            subtype: listingSubtype,
            listingCount: count,
            pageNo: 1,
            limit: dbConstants.DEFAULT_LIMIT_LISTING,
            page: "listings-" + req.params.type
        });
    }).catch((error) => {
        console.log(error);
        res.redirect("/", 400);
    });
});

module.exports = router;