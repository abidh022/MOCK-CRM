//routes/leadRoutes.js

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');


router.get('/data/leads', async (req, res) => {
    try {
        const leads = await leadsCollection.find().toArray();  // Ensure the query is working
        console.log('Fetched Leads:', leads);  // Log the result to debug
        res.status(200).json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).send('Error fetching leads');
    }
});

// Get all leads
router.get('/:id', async (req, res) => {
    try {
        const leadId = req.params.id; // Get the leadId from the URL parameter
        const lead = await req.leadsCollection.findOne({ _id: new ObjectId(leadId) }); 
        
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
        
        // Set created and modified times (current timestamp)
        const currentTime = new Date().toISOString(); // Get current time as ISO string
        newLead.dateTime = currentTime;  // Created time
        newLead.modified = currentTime;  // Modified time (initially the same)

        // Insert the new lead into the collection
        const result = await req.leadsCollection.insertOne(newLead); 
        
        res.status(200).json({
            insertedId: result.insertedId, // Send the insertedId back to the client
            ...newLead // Return the lead data with created and modified times
        });
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).send('Error creating lead');
    }
});

// Update lead by ID
router.put('/:id', async (req, res) => {
    try {
        const leadId = req.params.id;
        const updatedLead = req.body;

        const currentTime = new Date().toISOString();

        // Ensure that the "modified" time is updated
        updatedLead.modified = currentTime;

        // Retrieve the current modifications array from the lead
        const lead = await req.leadsCollection.findOne({ _id: new ObjectId(leadId) });
        
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // If modifications already exist, push the new timestamp to the array
        const modifications = lead.modifications || []; // Ensure array exists
        modifications.push(currentTime); // Add the new modification timestamp

        // Now, update the lead with the new modification timestamps and the updated data
        const result = await req.leadsCollection.updateOne(
            { _id: new ObjectId(leadId) },
            {
                $set: {
                    ...updatedLead, // Update the lead fields
                    modifications: modifications, // Save the updated modifications array
                    modified: currentTime // Update the 'modified' field as well
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Return the updated lead with its id and the new modifications array
        res.status(200).json({
            id: leadId, 
            ...updatedLead, // Send the updated lead data, including the new modification history
            modifications: modifications // Return the modifications array
        });
    } catch (error) {
        console.error('Error updating lead:', error);
        res.status(500).json({ message: 'Error updating lead' });
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


module.exports = router;