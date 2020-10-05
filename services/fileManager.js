const fs = require('fs-extra');
const sharp = require('sharp');
const imageParameters = require("../constants/imageParameters");

sharp.cache(false);

function resizeImage(inputLocation, outputLocation, images, imgX, imgY) {
    return new Promise(function (resolve, reject) {
        fs.mkdir(outputLocation, { recursive: true }, function (err) {
            if (err) {
                console.error("Some error occurred.");
                return reject(Error("Some error occurred."))
            }
            if (!(images && images.length > 0)) {
                return reject(Error("No Image Uploaded."))
            }
            fs.emptyDir(outputLocation).then(() => {
                images.forEach((image, index) => {
                    sharp(`${inputLocation}/${image}`).resize({ width: imgX, height: imgY }).toFile(`${outputLocation}/${image}`).then((newFileInfo) => {
                        console.log("Image Resized");
                        resolve("Image resized and Saved.")
                    }).catch((error) => {
                        console.log(error.message);
                        return reject(Error("Some error occurred."))
                    })
                });
            }).catch((err) => {
                console.error(err);
                return reject(Error("Some error occurred."))
            });
        });
    });
}

function saveImage(saveLocation, images) {
    return new Promise(function (resolve, reject) {
        fs.mkdir(saveLocation, { recursive: true }, function (err) {
            if (err) {
                console.error("Some error occurred.");
                return reject(Error("Some error occurred."))
            }
            if (!images) {
                return reject(Error("No Image Uploaded."))
            }
            Object.keys(images).forEach((key, index) => {
                let image = images[key];
                fs.access(`${saveLocation}/${image.name}`, (err) => {
                    if (err) {
                        image.mv(`${saveLocation}/${image.name}`);
                        console.log(`${image.name} uploaded.`);
                        return resolve("Image Uploaded");
                    }
                    return reject(Error("File with this name already exists."));
                });
            });
        });
    });
}

function deleteImage(imageLocation) {
    return new Promise(function (resolve, reject) {
        fs.access(imageLocation, (error) => {
            if (error) {
                console.log("No file existis with this name");
                return reject(Error("No file existis with this name."));
            }
            let tempFile = fs.openSync(imageLocation, 'r');
            fs.closeSync(tempFile);
            fs.unlinkSync(imageLocation);
            console.log(`${imageLocation} deleted.`)
            return resolve("Image deleted.");
        });
    });
}

function deleteFile(fileLocation) {
    return new Promise(function (resolve, reject) {
        fs.remove(fileLocation).then(() => {
            resolve("File Deleted")
        }).catch((err) => {
            console.error(err);
            return reject(Error("Some error occurred."))
        });
    })
}

module.exports = {
    saveListingImages: function (listingId, images) {
        return new Promise(function (resolve, reject) {
            let saveLocation = `./public/uploads/listing/${listingId}/images/raw`;
            saveImage(saveLocation, images).then((response) => {
                return resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    savePlanImage: function (listingId, images) {
        return new Promise(function (resolve, reject) {
            let saveLocation = `./public/uploads/listing/${listingId}/plans`;
            saveImage(saveLocation, images).then((response) => {
                return resolve(response);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    saveBuilderImage: function (listingId, images) {
        return new Promise(function (resolve, reject) {
            let tempLocation = `./public/uploads/temp`;
            let saveLocation = `./public/uploads/builder/${listingId}`;

            saveImage(tempLocation, images).then((response) => {
                console.log(response);
                return resizeImage(tempLocation, saveLocation, [images.builderImage.name], imageParameters.builderSize.x, imageParameters.builderSize.y)
            }).then((response) => {
                console.log(response);
                return deleteFile(`${tempLocation}/${images.builderImage.name}`);
            }).then((response) => {
                console.log(response);
                return resolve("Image Saved.");
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    },
    createLiveImages: function (listingId, images) {
        return new Promise(function (resolve, reject) {
            let rawLocation = `./public/uploads/listing/${listingId}/images/raw`;
            let largeLocation = `./public/uploads/listing/${listingId}/images/large`;
            let mediumLocation = `./public/uploads/listing/${listingId}/images/medium`;
            let smallLocation = `./public/uploads/listing/${listingId}/images/small`;

            resizeImage(rawLocation, largeLocation, images, imageParameters.size.large.x, imageParameters.size.large.y)
                .then((response) => {
                    return resizeImage(rawLocation, mediumLocation, images, imageParameters.size.medium.x, imageParameters.size.medium.y);
                }).then((response) => {
                    return resizeImage(rawLocation, smallLocation, images, imageParameters.size.small.x, imageParameters.size.small.y);
                }).then((response) => {
                    console.log(response);
                    return resolve("Live images created");
                }).catch((error) => {
                    return reject(error);
                })
        });
    },
    deleteListingImage: function (listingId, imageName) {
        return new Promise(function (resolve, reject) {
            let imageLocation = `./public/uploads/listing/${listingId}/images/raw/${imageName}`;

            deleteImage(imageLocation).then((response) => {
                return resolve(response);
            }).catch((error) => {
                return reject(error);
            });
        });
    },
    deletePlanImage: function (listingId, imageName) {
        return new Promise(function (resolve, reject) {
            let imageLocation = `./public/uploads/listing/${listingId}/plans/${imageName}`;

            deleteImage(imageLocation).then((response) => {
                return resolve(response);
            }).catch((error) => {
                return reject(error);
            });
        });
    },
    deleteBuilderImage: function (listingId, imageName) {
        return new Promise(function (resolve, reject) {
            let imageLocation = `./public/uploads/builder/${listingId}/${imageName}`;

            deleteImage(imageLocation).then((response) => {
                return resolve(response);
            }).catch((error) => {
                return reject(error);
            });
        });
    },
    deleteListing: function (listingId) {
        return new Promise(function (resolve, reject) {
            let listingLocation = `./public/uploads/listing/${listingId}`;
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
    },
}
