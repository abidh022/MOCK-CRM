//controllers.leadCOntroller.js

const Lead = require('../models/Lead');

// Get all leads
exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find(); 
        res.json(leads); 
    } catch (error) {
        console.error('Error fetching leads:', error); // Log the error for debugging
        res.status(500).json({ message: error.message }); // Respond with a 500 status code
    }
};

// Create a new lead
exports.createLead = async (req, res) => {
    const lead = new Lead(req.body); // Create a new lead instance with the request body
    try {
        const savedLead = await lead.save(); // Save the lead to the database
        res.status(201).json(savedLead); // Respond with the created lead
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle validation errors
    }
};

// Update a lead by ID
exports.updateLead = async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Update the lead
        if (!updatedLead) {
            return res.status(404).json({ message: 'Lead not found' }); // Handle not found
        }
        res.json(updatedLead); // Respond with the updated lead
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle any errors
    }
};

// Delete a lead by ID
exports.deleteLead = async (req, res) => {
    try {
        const deletedLead = await Lead.findByIdAndDelete(req.params.id); // Delete the lead
        if (!deletedLead) {
            return res.status(404).json({ message: 'Lead not found' }); // Handle not found
        }
        res.status(204).send(); // No content response for successful deletion
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle any errors
    }
};
