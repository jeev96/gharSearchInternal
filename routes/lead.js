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
			res.status(200).send();
		}
	});
});

router.put("/:id", function (req, res) {
	Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, function (error, updatedLead) {
		if (error) {
			console.log(err);
			req.flash("error", "Some error occurred.")
			res.redirect("back");
		} else {
			console.log("Lead Updated");
			req.flash("success", "Lead Updated");
			res.redirect("/account/leads");
		}
	});
})

module.exports = router;