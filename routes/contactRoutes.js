// routes/contact.js

require("dotenv").config();
const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

const URI = process.env.MONGODB_URI;
const client = new MongoClient(URI);

let contactsCollection;


//GET 
// router.get('/',async(req,res) => {
//     res.send('Welcome');
//     // try {
//     //     const contactId = req.params.id;
//     //     const contact = await req.contactCollection.findOne({ _id: new ObjectId(contactId)});

//     //     if (!contact){
//     //         return res.status(404).json({ message: 'contact not found' });
//     //     }
//     //     res.status(200).json(contact);
//     // }catch{
//     //     console.error('Error fetching contact:',error);
//     //     res.status(500).json({ message: 'Server Error' });
//     // }
// });

//Create contacts
router.post("/createContact", async (req, res) => {
    try{
        const newContact = req.body;
        
        const currentTime = new Date().toISOString(); // Get current time as ISO string
        newContact.dateTime = currentTime; // Created time
        newContact.modified = currentTime;

        const settingDbAndCollection = client.db('crm').collection('contacts')
        const addingContact = await settingDbAndCollection?.insertOne(newContact);

        res.status(200).json({
            id: addingContact.insertedId.toString(),
            ...newContact,
        });
    }catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).send("Error creating lead");
    }
});
    
module.exports = router;