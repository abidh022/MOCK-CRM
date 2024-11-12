//routes/leadRoutes.js

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
// const { leadsCollection } = require('../app'); 
// const leadController = require('../controllers/leadController');

// Get all leads
router.get('/:id', async (req, res) => {
    try {
        const leadId = req.params.id; // Get the leadId from the URL parameter
        const lead = await req.leadsCollection.findOne({ _id: new ObjectId(leadId) }); // Query the database for the lead
        
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        
        res.status(200).json(lead); // Return the lead data as JSON
    } catch (error) {
        console.error('Error fetching lead:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route to create a new lead
router.post('/', async (req, res) => {
    try {
        const newLead = req.body; // Expecting the lead data in the body of the POST request
        const result = await req.leadsCollection.insertOne(newLead); // Insert the new lead into the collection
        res.status(200).json({
            insertedId: result.insertedId // Send the insertedId back to the client
        });
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).send('Error creating lead');
    }
});

// Update a lead by ID
router.put('/:id', async (req, res) => {
    const leadId = req.params.id;
    const updatedData = req.body;
    try {
        const result = await leadsCollection.updateOne(
            { _id: new ObjectId(leadId) },
            { $set: updatedData }
        );
        if (result.modifiedCount === 1) res.status(200).send('Lead updated');
        else res.status(404).send('Lead not found');
    } catch (err) {
        res.status(500).send('Error updating lead');
    }
});

// Delete a lead by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params; 
    //check ObjectId format is correct
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid lead ID format' });
    }

    try {
        // Attempt to delete
        const result = await req.leadsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            return res.status(200).json({ message: 'Lead deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Lead not found' });
        }
    } catch (error) {
        console.error('Error deleting lead:', error);
        return res.status(500).json({ error: 'Error deleting lead' });
    }
});

// const leadId = new URLSearchParams(window.location.search).get('id');
// console.log('Lead ID:', leadId);

module.exports = router;