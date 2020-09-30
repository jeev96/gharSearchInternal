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
    fileManager.saveListingImages(req.body.listingId, req.files)
        .then(function (response) {
            return res.status(200).send(response);
        })
        .catch(function (error) {
            return res.status(500).send(error.message);
        });
});

router.post("/uploadPlan", isLoggedIn, function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        req.flash("No files were uploaded.");
        return res.status(404).send();
    }
    fileManager.savePlanImage(req.body.listingId, req.files)
        .then(function (response) {
            return res.status(200).send(response);
        })
        .catch(function (error) {
            return res.status(500).send(error.message);
        });
});

// delete uploaded images
router.post("/removeListingImage", isLoggedIn, function (req, res) {
    fileManager.deleteListingImage(req.body.listingId, req.body.imageName)
        .then(function (response) {
            return res.status(200).send(response);
        })
        .catch(function (error) {
            return res.status(500).send(error.message);
        });
});

// delete uploaded images
router.post("/removePlanImage", isLoggedIn, function (req, res) {
    fileManager.deletePlanImage(req.body.listingId, req.body.imageName)
        .then(function (response) {
            return res.status(200).send(response);
        })
        .catch(function (error) {
            return res.status(500).send(error.message);
        });
});

module.exports = router;