const Builder = require("../../models/builder");
const dbConstants = require("../../constants/dbConstants");

module.exports = {
    count: function (query = {}) {
        return new Promise((resolve, reject) => {
            Builder.countDocuments(query).exec((error, count) => {
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
            Builder.find(query).skip(parseInt(skip)).limit(parseInt(limit)).sort(sort).exec((error, foundListings) => {
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
            Builder.findById(listingId, function (error, foundListing) {
                if (error) {
                    reject(error);
                } else {
                    resolve(foundListing);
                }
            });
        });
    },
    create: function (data) {
        return new Promise((resolve, reject) => {
            Builder.create(data, function (error, newlyCreated) {
                if (error) {
                    reject(error);
                } else {
                    resolve(newlyCreated);
                }
            });
        });
    },
    findByIdAndUpdate: function (listingId, newData) {
        return new Promise((resolve, reject) => {
            Builder.findByIdAndUpdate(listingId, { $set: newData }, function (error, updatedListing) {
                if (error) {
                    reject(error);
                } else {
                    resolve(updatedListing);
                }
            });
        });
    }
}

