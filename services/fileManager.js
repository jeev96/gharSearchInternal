const fs = require('fs-extra')

module.exports = {
    saveListingImages: function (listingId, images) {
        let saveLocation = `./public/uploads/${listingId}/images/raw`;
        fs.mkdir(saveLocation, { recursive: true }, function (err) {
            if (err) {
                return console.error("Some error occurred.");
            }
            Object.keys(images).forEach((key, index) => {
                let image = images[key];
                image.mv(`${saveLocation}/${image.name}`);
            });
        });
    },
    savePlanImage: function (listingId, images) {
        let saveLocation = `./public/uploads/${listingId}/plans`;
        fs.mkdir(saveLocation, { recursive: true }, function (err) {
            if (err) {
                return console.error("Some error occurred.");
            }
            Object.keys(images).forEach((key, index) => {
                let image = images[key];
                image.mv(`${saveLocation}/${image.name}`);
            });
        });
    },
    deleteListingImage: function (listingId, imageName) {
        let imageLocation = `./public/uploads/${listingId}/images/raw/${imageName}`;

        fs.access(imageLocation, (error) => {
            if (error) {
                console.log("No file existis with this name");
                return;
            }
            let tempFile = fs.openSync(imageLocation, 'r');
            fs.closeSync(tempFile);
            fs.unlinkSync(imageLocation);
            return;
        });
    },
    deletePlanImage: function (listingId, imageName) {
        let imageLocation = `./public/uploads/${listingId}/plans/${imageName}`;

        fs.access(imageLocation, (error) => {
            if (error) {
                console.log("No file existis with this name");
                return;
            }
            let tempFile = fs.openSync(imageLocation, 'r');
            fs.closeSync(tempFile);
            fs.unlinkSync(imageLocation);
            return;
        });
    },
    deleteListing: function (listingId) {
        let listingLocation = `./public/uploads/${listingId}`;

        fs.access(listingLocation, (error) => {
            if (error) {
                console.log("No file existis with this name");
                return;
            }
            fs.remove(listingLocation, (error) => {
                if (error) {
                    console.log("Could not delete directory");
                    return;
                }
                console.log("Delete Successful");
                return;
            });
        });
    }
}
