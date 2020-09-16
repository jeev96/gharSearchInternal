const express = require("express");
const router = express.Router();
const Lead = require("../models/lead");

router.post("/", function (req, res) {
    Lead.create(req.body, function (err, newlyCreated) {
		if (err) {
            console.log(err);
            res.status(400).send();
		} else {
			//redirect back to buyers page
			console.log(newlyCreated);
            res.status(200).send();		}
	});
});

module.exports = router;