const express = require("express");
const router = express.Router();
const utils = require("../services/utils");
const fileManager = require("../services/fileManager");
const middleware = require("../services/middleware");
const { isLoggedIn, isAdmin } = middleware;

// upload images route
router.post("/upload", isLoggedIn, function (req, res) {
    if (!req.body.listingId) {
        return res.status(404).send("No listing with this ID.");
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(404).send();
    }
    fileManager.saveListingImages(req.body.listingId, req.files).then(function (response) {
        return res.status(200).send(response);
    }).catch(function (error) {
        return res.status(500).send(error.message);
    });
});

// upload plan images route
router.post("/uploadPlan", isLoggedIn, function (req, res) {
    if (!req.body.listingId) {
        return res.status(404).send("No listing with this ID.");
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        req.flash("No files were uploaded.");
        return res.status(404).send();
    }
    fileManager.savePlanImage(req.body.listingId, req.files).then(function (response) {
        return res.status(200).send(response);
    }).catch(function (error) {
        return res.status(500).send(error.message);
    });
});

// upload builder image
router.post("/uploadBuilder", isLoggedIn, function (req, res) {
    if (!req.body.builderId) {
        return res.status(404).send("No builder with this ID.");
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        req.flash("No files were uploaded.");
        return res.status(404).send();
    }
    fileManager.saveBuilderImage(req.body.builderId, req.files).then(function (response) {
        return res.status(200).send(response);
    }).catch(function (error) {
        return res.status(500).send(error.message);
    });
});

// delete uploaded images
router.post("/removeListingImage", isLoggedIn, function (req, res) {
    if (!req.body.listingId) {
        return res.status(404).send("No listing with this ID.");
    }
    fileManager.deleteListingImage(req.body.listingId, req.body.imageName).then(function (response) {
        return res.status(200).send(response);
    }).catch(function (error) {
        return res.status(500).send(error.message);
    });
});

// delete uploaded images
router.post("/removePlanImage", isLoggedIn, function (req, res) {
    fileManager.deletePlanImage(req.body.listingId, req.body.imageName).then(function (response) {
        return res.status(200).send(response);
    }).catch(function (error) {
        return res.status(500).send(error.message);
    });
});

// delete uploaded images
router.post("/removeBuilderImage", isLoggedIn, function (req, res) {
    fileManager.deleteBuilderImage(req.body.builderId, req.body.imageName).then(function (response) {
        return res.status(200).send(response);
    }).catch(function (error) {
        return res.status(500).send(error.message);
    });
});

module.exports = router;