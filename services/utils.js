const ejs = require("ejs");
const listingType = require("../constants/listing");
const ejsComponents = require("../services/ejsComponents");

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
    obj["status"] = listingType.status.LIVE;
    data.type ? obj["propertyType.type"] = data.type : "";
    data.bhk ? obj["propertyInfo.bhk"] = data.bhk : "";
    data.subType ? obj["propertyType.subtype"] = data.subType : "";
    data.priceFrom || data.priceTo ? obj["price"] = getRangeQuery(data.priceFrom, data.priceTo) : "";
    data.areaFrom || data.areaTo ? obj["propertyInfo.area.area"] = getRangeQuery(data.areaFrom, data.areaTo) : "";
    data.yearFrom || data.yearTo ? obj["propertyInfo.builtYear"] = getRangeQuery(data.yearFrom, data.yearTo) : "";
    data.bedroomFrom || data.bedroomTo ? obj["propertyInfo.bedrooms"] = getRangeQuery(data.bedroomFrom, data.bedroomTo) : "";
    data.bathroomFrom || data.bathroomTo ? obj["propertyInfo.bathrooms"] = getRangeQuery(data.bathroomFrom, data.bathroomTo) : "";
    data.parkingFrom || data.parkingTo ? obj["propertyInfo.reservedParking"] = getRangeQuery(data.parkingFrom, data.parkingTo) : "";
    data.city ? obj["location.city"] = data.city : "";
    data.sector ? obj["location.sector"] = data.sector : "";
    data.project ? obj["location.project"] = data.project : "";
    data.builderId ? obj["builderId"] = data.builderId : "";

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

module.exports = {
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
            case "independenthouse": subtype = listingType.subtype.INDEPENDENT_HOUSE; break;
            case "studioapartment": subtype = listingType.subtype.STUDIO_APARTMENT; break;
            case "serviceapartment": subtype = listingType.subtype.SERVICE_APARTMENT; break;
            case "farmhouse": subtype = listingType.subtype.FARM_HOUSE; break;
            case "commercialshop": subtype = listingType.subtype.COMMERCIAL_SHOP; break;
            case "commercialplot": subtype = listingType.subtype.COMMERCIAL_PLOT; break;
            case "commercialsco": subtype = listingType.subtype.COMMERCIAL_SCO; break;
            case "commercialspace": subtype = listingType.subtype.COMMERCIAL_SPACE; break;
            case "agriculturalland": subtype = listingType.subtype.AGRICULTURAL_LAND; break;
            default: subtype = listingType.subtype[data.toUpperCase()]
        }
        return subtype;
    },
    checkListingStatus(status) {
        return (status in listingType.status);
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