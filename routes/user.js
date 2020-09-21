const express = require("express");
const router = express.Router();
const User = require("../models/user");
const middleware = require("../services/middleware");
const { isLoggedIn, isAdmin } = middleware;

// all users route
router.get("/", isLoggedIn, isAdmin, function(req, res) {
    User.find({}, function(err, foundUsers) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            console.log("Users Found: " + foundUsers.length);
            res.render("user/all-users", { users: foundUsers, page: "all-users" });
        }
    });
});

// delete user
router.delete("/:id", isLoggedIn, isAdmin, function (req, res) {
    User.remove({
        _id: req.params.id
    }, function (err) {
        if (err) {
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            req.flash('error', 'User deleted!');
            res.redirect('/user');
        }
    });
});

module.exports = router;
