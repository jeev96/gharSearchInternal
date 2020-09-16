const express = require("express");
const router = express.Router();
const utils = require("../services/utils");
const dbConstants = require("../constants/dbConstants");
const Listing = require("../models/listing");

// type route
router.get("/:type", function (req, res) {
    const listingType = utils.getListingType(req.params.type);
    Listing.countDocuments({ "propertyType.type": listingType }).exec((err, count) => {
        if (err) {
            console.log(err);
            res.status(400).send();
        }
        else {
            Listing.find({ "propertyType.type": listingType }).skip(dbConstants.DEFAULT_SKIP).limit(dbConstants.DEFAULT_LIMIT_LISTING).exec((err, allListings) => {
                if (err) {
                    console.log(err);
                    res.redirect("/", 400);
                } else {
                    console.log("Listings Found: " + count);
                    res.render("index/show", {
                        listings: allListings,
                        type: listingType,
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
    const listingType = utils.getListingType(req.params.type);
    const listingSubtype = utils.getListingSubtype(req.params.subtype);
    const searchQuery = { "propertyType.type": listingType, "propertyType.subtype": listingSubtype };
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
                        type: listingType,
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