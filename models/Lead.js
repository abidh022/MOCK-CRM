//models/Lead.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    leadOwner: { type: String, required: true },
    company: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: { type: String },
    email: { type: String, required: true },
    fax: { type: String },
    mobile: { type: String },
    website: { type: String },
    leadSource: { type: String },
    leadStatus: { type: String },
    industry: { type: String },
    employees: { type: Number },
    annualRevenue: { type: Number },
    skypeID: { type: String },
    twitter: { type: String },
    secondaryEmail: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String },
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
