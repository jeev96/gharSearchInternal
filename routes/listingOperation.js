let express = require("express");
let router = express.Router();
let moment = require('moment')
let mongoose = require("mongoose");
let utils = require("../services/utils");
let Listing = require("../models/listing");

// compare listing route
router.get("/compare", function (req, res) {
    let compareIds = req.session.compare || [];

    compareIds = compareIds.map(id => {
        return mongoose.Types.ObjectId(id);
    });

    Listing.find({ _id: { $in: compareIds } }, function (err, foundListings) {
        if (err) {
            console.log(err);
            res.redirect("/error");
        } else {
            res.render("listing/compare", { listings: foundListings, page: "compare-listing" });
        }
    });
});
// add to compare
router.post("/compare", function (req, res) {
    if (!req.body.id) {
        res.status(404).send();
        return;
    }
    try {
        if (!req.session.hasOwnProperty("compare")) {
            req.session.compare = [];
        }
        let index = req.session.compare.indexOf(req.body.id);
        if (index === -1) {
            req.session.compare.push(req.body.id);
            req.session.save();
            res.status(200).send();
        } else {
            res.status(409).send();
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send();
    }
});
// delete all from compare
router.delete("/compare", function (req, res) {
    req.session.compare = [];
    req.session.save();
    res.status(200).send();

});
// delete one from compare
router.delete("/compare/:id", function (req, res) {
    if (!req.session.hasOwnProperty("compare")) {
        res.status(404).send();
    } else {
        let index = req.session.compare.indexOf(req.params.id);
        if (index > -1) {
            req.session.compare.splice(index, 1);
        }
        req.session.save();
        res.status(200).send();
    }
});

// favourites listing route
router.get("/favourite", function (req, res) {
    let favouriteIds = req.session.favourite || [];

    favouriteIds = favouriteIds.map(id => {
        return mongoose.Types.ObjectId(id);
    });

    Listing.find({ _id: { $in: favouriteIds } }, function (err, foundListings) {
        if (err) {
            console.log(err);
            res.redirect("/error");
        } else {
            res.render("listing/favourite", { listings: foundListings, page: "favourite-listing" });
        }
    });
});
// add to favourite
router.post("/favourite", function (req, res) {
    if (!req.body.id) {
        res.status(404).send();
        return;
    }
    try {
        if (!req.session.hasOwnProperty("favourite")) {
            req.session.favourite = [];
        }
        let index = req.session.favourite.indexOf(req.body.id);
        if (index === -1) {
            req.session.favourite.push(req.body.id);
            req.session.save();
            res.status(200).send();
        } else {
            res.status(409).send();
        }
    }
    catch (err) {
        console.log(err);
        res.status(400).send();
    }
});
// delete all from favourite
router.delete("/favourite", function (req, res) {
    req.session.favourite = [];
    req.session.save();
    res.status(200).send();

});
// delete one from favourite
router.delete("/favourite/:id", function (req, res) {
    if (!req.session.hasOwnProperty("favourite")) {
        res.status(404).send();
    } else {
        let index = req.session.favourite.indexOf(req.params.id);
        if (index > -1) {
            req.session.favourite.splice(index, 1);
        }
        req.session.save();
        res.status(200).send();
    }
});

module.exports = router;