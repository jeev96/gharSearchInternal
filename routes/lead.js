const express = require("express");
const router = express.Router();
const leadDbService = require("../services/database/lead");

router.post("/", function (req, res) {
	leadDbService.create(req.body).then((newlyCreated) => {
		console.log(newlyCreated);
		res.status(200).send();
	}).catch((error) => {
		console.log(err);
		res.status(400).send(error.message);
	});
});

router.put("/:id", function (req, res) {
	leadDbService.findByIdAndUpdate(req.params.id, { status: req.body.status }).then((updatedLead) => {
		console.log("Lead Updated");
		req.flash("success", "Lead Updated");
		res.redirect("/account/leads");
	}).catch((error) => {
		console.log(error);
		req.flash("error", "Some error occurred.")
		res.redirect("back");
	});
})

module.exports = router;