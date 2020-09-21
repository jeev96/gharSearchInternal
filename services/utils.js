const ejs = require("ejs");
const listingType = require("../constants/listingType");
const tagType = require("../constants/tagType");
const ejsComponents = require("../services/ejsComponents");
const { parse } = require("uuid");

function getRangeQuery(lower, upper) {
    if (lower && upper) {
        return { $gte: lower, $lte: upper };
    } else if (lower) {
        return { $gte: lower };
    } else {
        return { $lte: upper };
    }
}

function getSearchQuery(data) {
    let obj = {};
    data.type ? obj["propertyType.type"] = data.type : "";
    data.subType ? obj["propertyType.subtype"] = data.subType : "";
    data.priceFrom || data.priceTo ? obj["price"] = getRangeQuery(data.priceFrom, data.priceTo) : "";
    data.areaFrom || data.areaTo ? obj["propertyInfo.area.area"] = getRangeQuery(data.areaFrom, data.areaTo) : "";
    data.yearFrom || data.yearTo ? obj["propertyInfo.builtYear"] = getRangeQuery(data.yearFrom, data.yearTo) : "";
    data.bedroomFrom || data.bedroomTo ? obj["propertyInfo.bedrooms"] = getRangeQuery(data.bedroomFrom, data.bedroomTo) : "";
    data.bathroomFrom || data.bathroomTo ? obj["propertyInfo.bathrooms"] = getRangeQuery(data.bathroomFrom, data.bathroomTo) : "";
    data.parkingFrom || data.parkingTo ? obj["propertyInfo.reservedParking"] = getRangeQuery(data.parkingFrom, data.parkingTo) : "";
    data.place ? obj["location.place"] = data.place : "";
    data.sector ? obj["location.sector"] = data.sector : "";
    data.project ? obj["location.project"] = data.project : "";

    return obj;
}
function getFilterQuery(filter) {
    let filterObj = {};
    switch (parseInt(filter)) {
        case 0: break;
        case 1: filterObj = { createdAt: -1 };
            break;
        case 2: filterObj = { createdAt: 1 };
            break;
        case 3: filterObj = { price: 1 };
            break;
        case 4: filterObj = { price: -1 };
            break;
        default: break;
    }
    return filterObj;
}

function getListingTags(data) {
    let tags = [];
    tags.push(data.tag);
    data.isFeatured ? tags.push(tagType.FEATURED) : "";
    data.isHotOffer ? tags.push(tagType.HOT_OFFER) : "";
    return tags; 
}

module.exports = {
    createSubmitEntryResidential: function (user, data) {
        let author = {
            id: user._id,
            username: user.username
        }
        let listingInfo = {
            title: data.title,
            description: data.description,
            tags: getListingTags(data)
        }
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
            amenities: data.amenities,
            waterSource: data.waterSource,
            facing: data.facing,
            flooring: data.flooring,
        }
        let contactInfo = {
            name: data.dealerName,
            firmName: data.firmName,
            type: data.dealerType,
            phone: data.dealerPhone
        }

        let newListing = {
            author: author,
            createdAt: Date.now(),
            listingInfo: listingInfo,
            propertyType: propertyType,
            location: location,
            propertyInfo: propertyInfo,
            ownership: ownership,
            price: price,
            contactInfo: contactInfo
        }
        return newListing;
    },
    getDbQuery: function (data) {
        const dbQuery = {
            searchQuery: getSearchQuery(data),
            filter: getFilterQuery(data.filter)
        }
        return dbQuery;
    },
    getListingType: function (data) {
        let type = listingType.type[data.toUpperCase()]
        return type;
    },
    getListingSubtype: function (data) {
        let subtype = null;
        switch (data) {
            case "independenthouse": subtype = listingType.subtype.INDEPENDENT_HOUSE;
                break;
            case "studioapartment": subtype = listingType.subtype.STUDIO_APARTMENT;
                break;
            case "serviceapartment": subtype = listingType.subtype.SERVICE_APARTMENT;
                break;
            case "farmhouse": subtype = listingType.subtype.FARM_HOUSE;
                break;
            case "commercialshop": subtype = listingType.subtype.COMMERCIAL_SHOP;
                break;
            case "commercialplot": subtype = listingType.subtype.COMMERCIAL_PLOT;
                break;
            case "commercialsco": subtype = listingType.subtype.COMMERCIAL_SCO;
                break;
            case "commercialspace": subtype = listingType.subtype.COMMERCIAL_SPACE;
                break;
            case "agriculturalland": subtype = listingType.subtype.AGRICULTURAL_LAND;
                break;
            default:
                subtype = listingType.subtype[data.toUpperCase()]
        }
        return subtype;
    },
    renderListingsEjs: function (data, isListingSearch) {
        if (isListingSearch) {
            return ejs.render(ejsComponents.listingSearchComponent, data);
        }
        return ejs.render(ejsComponents.homeSearchComponent, data);
    },
    renderTagsEjs: function (data, isListingSearch) {
        if (isListingSearch) {
            return ejs.render(ejsComponents.listingSearchTags, data);
        }
        return ejs.render(ejsComponents.homeSearchTags, data);
    },
    renderPaginationBarEjs: function (data, isListingSearch) {
        data.pageNo = parseInt(data.pageNo);
        if (isListingSearch) {
            return ejs.render(ejsComponents.paginationBar, data);
        }
        return null;
    },
    renderLoadButtonEjs: function (data, isListingSearch) {
        data.pageNo = parseInt(data.pageNo);
        data.limit = parseInt(data.limit);
        let isLastPage = (data.limit >= data.listingCount);;
        if (isListingSearch || isLastPage) {
            return null;
        }
        return ejs.render(ejsComponents.loadMoreButton, data);
    }
}