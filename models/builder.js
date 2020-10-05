let mongoose = require("mongoose");

let BuilderSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    email: String,
    phone: String,
    parentCompany: String,
    descriptionShort: String,
    description: String,
    projectBrief: String,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Builder", BuilderSchema);