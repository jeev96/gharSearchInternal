module.exports = {
	isLoggedIn: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('error', 'You must be signed in to do that!');
		res.redirect("/account/login");
	},
	isAdmin: function (req, res, next) {
		if (req.user.userType === "ADMIN") {
			next();
		} else {
			req.flash('error', 'This site is now read only.');
			res.redirect('back');
		}
	}
}