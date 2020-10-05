const listingType = require("../constants/listing");

function getListingTags(data) {
    let tags = [];
    tags.push(data.tag);
    data.isFeatured ? tags.push(listingType.tagType.FEATURED) : "";
    data.isHotOffer ? tags.push(listingType.tagType.HOT_OFFER) : "";
    return tags;
}

function getVideoEntry(names, links) {
    if (!names) {
        return [];
    }
    let videos = [];
    if (typeof names === "string" && names !== "") {
        videos.push({
            name: names,
            link: links
        });
    } else {
        for (let i = 0; i < names.length; i++) {
            videos.push({
                name: names[i],
                link: links[i]
            });
        }
    }
    return videos;
}

function getAddFeaturesEntry(names, values) {
    if (!names) {
        return [];
    }
    let addFeatures = [];
    if (typeof names === "string" && names !== "") {
        addFeatures.push({
            name: names,
            link: values
        });
    } else {
        for (let i = 0; i < names.length; i++) {
            addFeatures.push({
                name: names[i],
                value: values[i]
            });
        }
    }
    return addFeatures;
}

function getPlanEntry(names, descriptions, areas, rooms, baths, images) {
    if (!names) {
        return [];
    }
    let plans = [];
    if (typeof names === "string" && names !== "") {
        plans.push({
            name: names,
            description: descriptions,
            area: areas,
            rooms: rooms,
            baths: baths,
            image: images
        });
    } else {
        for (let i = 0; i < names.length; i++) {
            plans.push({
                name: names[i],
                description: descriptions[i],
                area: areas[i],
                rooms: rooms[i],
                baths: baths[i],
                image: images[i]
            });
        }
    }
    return plans;
}

module.exports = {
    createUserEntry: function (data) {
        let newUser = {
            name: data.name,
            username: data.username,
            userType: data.userType ? data.userType : "AGENT",
            phone: data.phone,
            organization: data.organization
        }
        return newUser;
    },
    createSubmitEntryResidential: function (user, data) {
        let author = {
            id: data.userId ? data.userId : user._id,
            username: data.username ? data.username : user.username
        }
        let status = listingType.status.PENDING;
        let listingInfo = {
            title: data.title,
            description: data.description ? data.description.trim() : "",
            tags: getListingTags(data),
            contactDisplay: {
                type: data.contactDisplayType,
                email: data.contactDisplayEmail ? true : false,
                phone: data.contactDisplayPhone ? true : false
            }
        }
        let similarListings = data.similarListing ? data.similarListing : [];
        let ownership = data.ownership;
        let price = data.price;
        let propertyType = {
            type: data.type,
            subtype: data.subtype
        }
        let location = {
            map: {
                lat: data.lat,
                lon: data.lon
            },
            city: data.city,
            sector: data.sector,
            project: data.project,
            block: data.block,
            tower: data.tower,
            floor: data.floor,
            propertyNumber: data.propertyNumber,
            preferentialLocationCharges: data.preferentialLocationCharges
        }
        let propertyInfo = {
            area: data.area,
            bhk: data.bhk,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            balconies: data.balconies,
            reservedParking: data.reservedParking,
            otherRooms: data.otherRooms,
            builtYear: data.builtYear,
            amenities: data.amenities ? data.amenities : [],
            waterSource: data.waterSource,
            facing: data.facing,
            flooring: data.flooring,
            additionalFeatures: getAddFeaturesEntry(data.addFeatureName, data.addFeatureValue)
        }
        let contactInfo = {
            name: data.dealerName,
            email: data.dealerEmail,
            description: data.dealerDescription,
            firmName: data.firmName,
            type: data.dealerType,
            phone: data.dealerPhone
        }
        let builderId = data.builderId ? data.builderId : null;

        let newListing = {
            status: status,
            author: author,
            builderId: builderId,
            contactInfo: contactInfo,
            price: price,
            ownership: ownership,
            createdAt: data.createdAt ? data.createdAt : Date.now(),
            lastModified: Date.now(),
            listingInfo: listingInfo,
            propertyType: propertyType,
            location: location,
            propertyInfo: propertyInfo,
            similarListings: similarListings,
        }
        return newListing;
    },
    createSubmitEntryMedia: function (data) {
        let images = data.images ? data.images : [];
        let videos = getVideoEntry(data.videoName, data.videoLink);
        let plans = getPlanEntry(data.planName, data.planDescription, data.planArea, data.planRooms, data.planBaths, data.planImages);

        return {
            images: images,
            videos: videos,
            plans: plans
        }
    },
    createCompleteResidentialEntry: function (user, data) {
        let newData = this.createSubmitEntryResidential(user, data);
        newData["media"] = this.createSubmitEntryMedia(data);

        return newData;
    },
    createBuilderEntry: function (data) {
        return {
            name: data.name,
            email: data.email,
            phone: data.phone,
            parentCompany: data.parentCompany,
            descriptionShort: data.descriptionShort ? data.descriptionShort.trim() : "",
            description: data.description ? data.description.trim() : "",
            projectBrief: data.projectBrief ? data.projectBrief.trim() : "",
            image: data.image,
            createdAt: data.createdAt ? data.createdAt : Date.now(),
        }
    },
}