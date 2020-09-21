var mongoose = require("mongoose");

var listingSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    listingInfo: {
        title: {
            type: String,
            required: true
        },
        tags: {
            type: [String],
            default: ["NEW"]
        },
        description: {
            type: String
        },
    },
    propertyType: {
        type: {
            type: String,
            default: "RESIDENTIAL"
        },
        subtype: {
            type: String,
            default: "FLAT"
        }
    },
    location: {
        map: {
            lat: { type: String },
            lon: { type: String }
        },
        city: {
            type: String,
            default: "CHANDIGARH"
        },
        sector: {
            type: String,
        },
        project: {
            type: String,
        },
        block: {
            type: String,
        },
        tower: {
            type: String,
        },
        floor: {
            type: String
        },
        propertyNumber: {
            type: String
        },
        preferentialLocationCharges: {
            type: String
        },
    },
    media: {
        images: {
            type: [String],
            default: ["https://d27p8o2qkwv41j.cloudfront.net/wp-content/uploads/2016/07/shutterstock_262923179-e1500871070126.jpg"]
        },
        videos: [{
            name: { type: String },
            link: { type: String }
        }],
        plans: [{
            name: { type: String },
            description: { type: String },
            area: { type: String },
            rooms: { type: String },
            baths: { type: String },
            image: { type: String },
        }]
    },
    propertyInfo: {
        builtYear: {
            type: Number
        },
        amenities: {
            type: [String]
        },
        area: {
            type: Number,
        },
        bhk: {
            type: String
        },
        bedrooms: {
            type: Number
        },
        bathrooms: {
            type: Number
        },
        balconies: {
            type: Number
        },
        facing: {
            type: String,
        },
        flooring: {
            type: String,
            default: "VETRIFIED"
        },
        otherRooms: {
            type: String
        },
        reservedParking: {
            type: Number
        },
        waterSource: {
            type: String,
            default: "MUNICIPAL-CORPORATION"
        },
        additionalFeatures: [{
            name: { type: String },
            value: { type: String }
        }]
    },
    ownership: {
        type: String,
        enum: ["FREEHOLD", "LEASEHOLD", "CO-OPERATIVE-SOCIETY", "GPA", "FREEHOLD-AND-REG", "TRANSFER", "LOI", "POA", "REGISTRY-DONE", "NDC", "CD-CASE", "OUSTEE"],
        default: "FREEHOLD"
    },
    price: {
        type: mongoose.Decimal128
    },
    contactInfo: {
        name: String,
        firmName: String,
        type: {
            type: String,
            enum: ["DEALER", "OWNER"]
        },
        phone: [String]
    }
});

module.exports = mongoose.model("Listing", listingSchema);