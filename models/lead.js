var mongoose = require("mongoose");

var LeadSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    listing_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    }
});
module.exports = mongoose.model("Lead", LeadSchema);