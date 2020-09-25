const express = require("express");
const router = express.Router();
const utils = require("../services/utils");
const listingType = require("../constants/listingType");
const dbConstants = require("../constants/dbConstants");
const Listing = require("../models/listing");

// type route
router.get("/:type", function (req, res) {
    const type = utils.getListingType(req.params.type);
    const searchQuery = { "propertyType.type": type, "status": listingType.status.LIVE };
    Listing.countDocuments(searchQuery).exec((err, count) => {
        if (err) {
            console.log(err);
            res.status(400).send();
        }
        else {
            Listing.find(searchQuery).skip(dbConstants.DEFAULT_SKIP).limit(dbConstants.DEFAULT_LIMIT_LISTING).exec((err, allListings) => {
                if (err) {
                    console.log(err);
                    res.redirect("/", 400);
                } else {
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
                }
            });
        }
    });
});

// type subtype
router.get("/:type/:subtype", function (req, res) {
    const type = utils.getListingType(req.params.type);
    const listingSubtype = utils.getListingSubtype(req.params.subtype);
    const searchQuery = { "propertyType.type": type, "propertyType.subtype": listingSubtype, "status": listingType.status.LIVE };
    Listing.countDocuments(searchQuery).exec((err, count) => {
        if (err) {
            console.log(err);
            res.status(400).send();
        }
        else {
            Listing.find(searchQuery).skip(dbConstants.DEFAULT_SKIP).limit(dbConstants.DEFAULT_LIMIT_LISTING).exec((err, allListings) => {
                if (err) {
                    console.log(err);
                    res.redirect("/", 400);
                } else {
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
                }
            });
        }
    });
});

module.exports = router;