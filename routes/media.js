const express = require("express");
const router = express.Router();
const utils = require("../services/utils");
const fileManager = require("../services/fileManager");
const middleware = require("../services/middleware");
const { isLoggedIn, isAdmin } = middleware;

// upload images route
router.post("/upload", isLoggedIn, function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        req.flash("No files were uploaded.");
        return res.status(404).send();
    }
    fileManager.saveListingImages(req.body.listingId, req.files);

    return res.status(200).send("done");
});

router.post("/uploadPlan", isLoggedIn, function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        req.flash("No files were uploaded.");
        return res.status(404).send();
    }
    fileManager.savePlanImage(req.body.listingId, req.files);

    return res.status(200).send("done");
});

// delete uploaded images
router.post("/removeListingImage", isLoggedIn, function(req, res) {
    fileManager.deleteListingImage(req.body.listingId, req.body.imageName);
    return res.status(200).send("done");
});

// delete uploaded images
router.post("/removePlanImage", isLoggedIn, function(req, res) {
    fileManager.deletePlanImage(req.body.listingId, req.body.imageName);
    return res.status(200).send("done");
});

module.exports = router;