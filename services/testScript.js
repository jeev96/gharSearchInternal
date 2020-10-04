const Listing = require("../models/listing");
const fileManager = require("../services/fileManager");
const moment = require('moment')
const dbEntry = require("../services/dbEntry");


module.exports = {
    dbScript: function () {
        Listing.find({}).exec((err, foundListings) => {
            if (err) {
                console.log(err);
            } else {

                foundListings.forEach((listing, index) => {
                    let contactDisplay = {
                        type: "NONE",
                        email: true,
                        phone: true
                    }
                    // let listingInfo = {
                    //     title: listing.location.project,
                    //     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
                    //     tags: ["FOR SALE"]
                    // }
                    // let lastModified = moment(listing.createdAt).valueOf();
                    let data = {
                        "listingInfo.contactDisplay": contactDisplay,
                    }
                    Listing.findByIdAndUpdate({ _id: listing._id }, 
                        { $set: data }, function (err, updatedListing) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(index);

                            // fileManager.saveListingImages(updatedListing._id, [])
                            //     .then(() => {
                            //         fileManager.savePlanImage(updatedListing._id, [])
                            //     }).catch((error) => {
                            //         console.log(error.message);
                            //     });

                            console.log("done");
                        }
                    });
                })
            }
        });
    },
    imageScript: function () {
        Listing.find({}).exec((err, foundListings) => {
            foundListings.forEach((listing, index) => {
                fileManager.createLiveImages(listing._id, listing.media.images).then((response) => {
                        console.log(response);
                        console.log(index);
                    }).catch((error) => {
                        console.log(error.message);
                    });
            })
        })
    }
}