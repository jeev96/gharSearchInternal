const fs = require('fs-extra')

module.exports = {
    saveListingImages: function (listingId, images) {
        return new Promise(function (resolve, reject) {
            let saveLocation = `./public/uploads/${listingId}/images/raw`;
            fs.mkdir(saveLocation, { recursive: true }, function (err) {
                if (err) {
                    console.error("Some error occurred.");
                    return reject(Error("Some error occurred."))
                }
                Object.keys(images).forEach((key, index) => {
                    let image = images[key];
                    fs.access(`${saveLocation}/${image.name}`, (err) => {
                        if (err) {
                            image.mv(`${saveLocation}/${image.name}`);
                            console.log(`Plan ${image.name} uploaded.`);
                            return resolve("Image Uploaded");
                        }
                        return reject(Error("File with this name already exists."));
                    })
                });
            });
        });
    },
    savePlanImage: function (listingId, images) {
        return new Promise(function (resolve, reject) {
            let saveLocation = `./public/uploads/${listingId}/plans`;
            fs.mkdir(saveLocation, { recursive: true }, function (err) {
                if (err) {
                    console.error("Some error occurred.");
                    return reject(Error("Some error occurred."))
                }
                Object.keys(images).forEach((key, index) => {
                    let image = images[key];
                    fs.access(`${saveLocation}/${image.name}`, (err) => {
                        if (err) {
                            image.mv(`${saveLocation}/${image.name}`);
                            console.log(`Plan ${image.name} uploaded.`);
                            return resolve("Image Uploaded");
                        }
                        return reject(Error("File with this name already exists."));
                    })
                });
            });
        });
    },
    deleteListingImage: function (listingId, imageName) {
        return new Promise(function (resolve, reject) {
            let imageLocation = `./public/uploads/${listingId}/images/raw/${imageName}`;

            fs.access(imageLocation, (error) => {
                if (error) {
                    console.log("No file existis with this name");
                    return reject(Error("No file existis with this name."));
                }
                let tempFile = fs.openSync(imageLocation, 'r');
                fs.closeSync(tempFile);
                fs.unlinkSync(imageLocation);
                console.log(`Plan ${imageName} deleted.`)
                return resolve("Image deleted.");
            });
        });
    },
    deletePlanImage: function (listingId, imageName) {
        return new Promise(function (resolve, reject) {
            let imageLocation = `./public/uploads/${listingId}/plans/${imageName}`;

            fs.access(imageLocation, (error) => {
                if (error) {
                    console.log("No file existis with this name");
                    return reject(Error("No file existis with this name."));
                }
                let tempFile = fs.openSync(imageLocation, 'r');
                fs.closeSync(tempFile);
                fs.unlinkSync(imageLocation);
                console.log(`Plan ${imageName} deleted.`)
                return resolve("Image deleted.");
            });
        });
    },
    deleteListing: function (listingId) {
        return new Promise(function (resolve, reject) {
            let listingLocation = `./public/uploads/${listingId}`;
            fs.access(listingLocation, (error) => {
                if (error) {
                    console.log("No file existis with this name");
                    return reject(Error("No file existis with this name."));
                }
                fs.remove(listingLocation, (error) => {
                    if (error) {
                        console.log("Could not delete directory");
                        return reject(Error("Could not delete directory"));
                    }
                    console.log("Delete Successful");
                    return resolve("Delete Successful.")
                });
            });
        });
    }
}
