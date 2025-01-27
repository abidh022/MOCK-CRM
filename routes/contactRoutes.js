// routes/contact.js

require("dotenv").config();
const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

const URI = process.env.MONGODB_URI;
const client = new MongoClient(URI);

let contactsCollection;

const mainFunction = async () => {
    contactsCollection = await getcontact(); 
};


router.use(async (req, res , next) => {
    console.log("Middleware: Checking if contactsCollection exists");
    await mainFunction();
    if (contactsCollection) {
        next();
    } else {
        console.log("contactsCollection not found, returning error");
        return res.json("DB connected, but collection not found");
    }
});
  
async function getcontact() {
    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        console.log("Connected to MongoDB (contacts)");

        const db = client.db("crm");
        let contactData = db.collection("contacts");
        return contactData; // Returning the collection object
    } catch (error) {
        console.error("Error connecting to DB:", error);
        return null;
    }
}


// GET ALL CONTACTS
router.get("/getAllContacts", async (req, res) => {
    try {
        console.log("Fetching all contacts...");
        const contacts = await contactsCollection.find({}).toArray();
        console.log("Fetched contacts:", contacts);
        res.json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Error fetching contacts" });
    }
});


// Get specific leads using ID
router.get("/data/:id", async (req, res) => {
  try {
    const contactId = req.params.id; 
    const fetchContactIndividual = client.db("crm").collection("contacts");
    const contactIndividualInformation = fetchContactIndividual.findOne({
      _id: new ObjectId(contactId),
    });

    if (!contactIndividualInformation) {
      return res.status(404).json({ message: "Lead not found" });
    }
    
    res.status(200).json(await contactIndividualInformation);
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


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
    

// Update a contact by ID
router.put("/updateContact/:id", async (req, res) => {
  const contactId = req.params.id;
  const updatedContact = req.body; // Data coming from the request body

  try {
      // Fetch the existing contact from the database
      const contact = await client.db("crm").collection("contacts").findOne({
          _id: new ObjectId(contactId),
      });

      if (!contact) {
          return res.status(404).json({ message: "Contact not found" });
      }

      // Get the current time for the modification timestamp
      const currentTime = new Date().toISOString();

      // Retrieve the existing modifications array or initialize an empty array
      const modifications = contact.modifications || [];
      modifications.push(currentTime); // Add the new modification timestamp

      // Now, update the contact with the new modifications array
      const result = await client.db("crm").collection("contacts").updateOne(
          { _id: new ObjectId(contactId) },
          {
              $set: {
                  ...updatedContact, // Update other fields from the request body
                  modifications: modifications, // Add the modifications array with the new timestamp
                  modified: currentTime, // Update the modified field with the new timestamp
              },
          }
      );

      if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Contact not found" });
      }

      // Return the updated contact data, including modifications
      res.status(200).json({
          message: "Contact updated successfully",
          updatedContact: { ...updatedContact, modifications: modifications }, // Send the updated contact with modifications
      });
  } catch (error) {
      console.error("Error updating contact:", error);
      res.status(500).json({ message: "Error updating contact" });
  }
});


// Delete a contact by ID
router.delete("/deleteContact/:id", async (req, res) => {
    const contactId = req.params.id;
  
    try {
      const result = await client.db("crm").collection("contacts").deleteOne({
        _id: new ObjectId(contactId),
      });
  
      if (result.deletedCount === 1) {
        return res.status(200).json({ message: "Contact deleted successfully" });
      } else {
        return res.status(404).json({ message: "Contact not found" });
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      return res.status(500).json({ message: "Error deleting contact" });
    }
});


//retrive data already exist
router.get("/getContactById/:id", async (req, res) => {
  const contactId = req.params.id;
  const contact = await client.db("crm").collection("contacts").findOne({
     _id: new ObjectId(contactId) 
    });

  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "contact not found" });
  }
});
  
module.exports = router;