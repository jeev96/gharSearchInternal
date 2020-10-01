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
                    let media = {
                        images: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"],
                        videos: [{ name: "Walkthrough", link: "https://www.youtube.com/embed/-NInBEdSvp8" }],
                        plans: [{ name: "First Floor", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.", area: "1180", rooms: "3", baths: "1", image: "plan-1.jpg" },
                        { name: "Second Floor", description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.", area: "1200", rooms: "5", baths: "2", image: "plan-2.jpg" }]
                    }
                    // let listingInfo = {
                    //     title: listing.location.project,
                    //     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium magnam veniam sit reprehenderit deserunt ad voluptates id aperiam veritatis! Nobis saepe quos eveniet numquam vitae quis, tenetur consectetur impedit dolore.",
                    //     tags: ["FOR SALE"]
                    // }
                    // let lastModified = moment(listing.createdAt).valueOf();
                    let data = {
                        media: media,
                    }
                    Listing.findByIdAndUpdate({ _id: listing._id }, { $set: data }, function (err, updatedListing) {
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