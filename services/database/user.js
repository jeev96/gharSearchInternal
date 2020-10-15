const User = require("../../models/user");
const dbConstants = require("../../constants/dbConstants");

module.exports = {
    count: function (query = {}) {
        return new Promise((resolve, reject) => {
            User.countDocuments(query).exec((error, count) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(count);
                }
            });
        });
    },
    find: function (query = {}, sort = {}, skip = dbConstants.DEFAULT_SKIP, limit = dbConstants.DEFAULT_LIMIT) {
        return new Promise((resolve, reject) => {
            User.find(query).skip(parseInt(skip)).limit(parseInt(limit)).sort(sort).exec((error, foundListings) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(foundListings);
                }
            });
        });
    },
    findById: function (listingId) {
        return new Promise((resolve, reject) => {
            User.findById(listingId, function (error, foundListing) {
                if (error) {
                    reject(error);
                } else {
                    resolve(foundListing);
                }
            });
        });
    },
    register: function (data, password) {
        return new Promise((resolve, reject) => {
            User.register(new User(data), password, function (error, user) {
                if (error) {
                    reject(error);
                } else {
                    resolve("User Created");
                }
            });
        })
    },
    findByIdAndUpdate: function (listingId, newData) {
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(listingId, { $set: newData }, function (error, updatedListing) {
                if (error) {
                    reject(error);
                } else {
                    resolve(updatedListing);
                }
            });
        });
    },
    delete: function (query) {
        return new Promise((resolve, reject) => {
            User.deleteOne(query, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve("User Deleted.")
                }
            });
        });
    }
}

