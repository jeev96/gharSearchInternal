const mongoose = require("mongoose");
const listingType = require("../constants/listingType");

let listingSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        default: listingType.status.PENDING
    },
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
    lastModified: {
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
            default: []
        },
        videos: {
            type: [{
                name: { type: String },
                link: { type: String }
            }],
            default: []
        },
        plans: {
            type: [{
                name: { type: String },
                description: { type: String },
                area: { type: String },
                rooms: { type: String },
                baths: { type: String },
                image: { type: String },
            }],
            default: []
        },
    },
    propertyInfo: {
        builtYear: {
            type: Number
        },
        amenities: {
            type: [String],
            default: []
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
        additionalFeatures: {
            type: [{
                name: { type: String },
                value: { type: String }
            }],
            default: []
        },
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
        },
        phone: {
            type: [String],
            default: []
        }
    }
});

module.exports = mongoose.model("Listing", listingSchema);