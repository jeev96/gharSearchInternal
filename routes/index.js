const express = require("express");
const router = express.Router();
const listingType = require("../constants/listingType");
const dbConstants = require("../constants/dbConstants");
const Listing = require("../models/listing");

// root route
router.get("/", function (req, res) {
    Listing.find({ "status": listingType.status.LIVE }, function (err, allListings) {
        if (err) {
            console.log(err);
        } else {
            let featuredListings = allListings.filter((listing) => {
                if (listing.listingInfo && listing.listingInfo.tags) {
                    if (listing.listingInfo.tags.indexOf("FEATURED") > -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return false;
            });
            let count = allListings.length;
            allListings = allListings.slice(0, dbConstants.DEFAULT_LIMIT_HOME);
            res.render("index/home", { listings: allListings, listingCount: count, featuredListings: featuredListings, page: "home" });
        }
    });
});

// contact route
router.get("/contact", function (req, res) {
    res.render("index/contact", { page: "contact" });
});

// about us route
router.get("/about", function (req, res) {
    res.render("index/about", { page: "about" });
});

module.exports = router;