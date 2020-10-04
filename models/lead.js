let mongoose = require("mongoose");

let LeadSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    listingName: String,
    status: {
        type: String,
        default: "NEW"
    },
    listing_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
});
module.exports = mongoose.model("Lead", LeadSchema);