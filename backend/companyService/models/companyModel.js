const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    industry: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
    },
    longDescription: {
        type: String,
    },
    logoUrl: {
        type: String,
    },
});

module.exports = mongoose.model('Company', CompanySchema);
