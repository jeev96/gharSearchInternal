const express = require("express");
const router = express.Router();
const userDbService = require("../services/database/user");
const listingDbService = require("../services/database/listing");
const middleware = require("../services/middleware");
const { isLoggedIn, isAdmin } = middleware;

// all users route
router.get("/", isLoggedIn, isAdmin, function (req, res) {
    userDbService.find().then((foundUsers) => {
        console.log("Users Found: " + foundUsers.length);
        res.render("user/all-users", { users: foundUsers, page: "all-users" });
    }).catch((error) => {
        console.log(error);
        req.flash("error", "Some error occurred.");
        res.render("user/all-users", { users: [], page: "all-users" });
    });
});

// delete user
router.delete("/:id", isLoggedIn, isAdmin, function (req, res) {
    let newAuthor = {
        id: req.user._id,
        username: req.user.username
    }
    listingDbService.updateMany({ "author.id": req.params.id }, { author: newAuthor }).then((result) => {
        console.log(result);
        return userDbService.delete({ _id: req.params.id });
    }).then((result) => {
        console.log(result);
        req.flash('error', 'User deleted!');
        res.redirect('/user');
    }).catch((error) => {
        console.log(error);
        req.flash('error', err.message);
        res.redirect('back');
    });
});

module.exports = router;
