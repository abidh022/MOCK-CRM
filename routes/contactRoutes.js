// routes/contact.js

const express = require('express');
const router = express.Router();
const {ObjectId} = require('mangodb');

//GET 
router.get('/:id',async(req,res) => {
    try {
        const contactId = req.params.id;
        const contact = await req.contactCollection.findOne({ _id: new ObjectId(contactId)});

        if (!contact){
            return res.status(404).json({ message: 'contact not found' });
        }
        res.status(200).json(contact);
    }catch{
        console.error('Error fetching contact:',error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// CREATE
router.post('/',async (req,res)=>{
    try {
        const newContact = req.body;
        const result = await req.contactsCollection.insertOne(newContact);
        res.status(200).json({
            insertedId: result.insertedId 
        });
    }catch (error){
        console.error('Error creating contact:',error);
        res.status(500).send('Error creating contact');
    }
}); 