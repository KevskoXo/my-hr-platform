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
    description: {
        type: String,
    },
    logoUrl: {
        type: String,
    },
    recruiters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter'
    }]
});

module.exports = mongoose.model('Company', CompanySchema);
