require("dotenv").config();
const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

const URI = process.env.MONGODB_URI;
const client = new MongoClient(URI);

let accountsCollection;

const mainFunction = async () => {
    accountsCollection = await getAccounts();
};

// Middleware to ensure DB and collection are set up
router.use(async (req, res, next) => {
    console.log("Middleware: Checking if accountsCollection exists");
    await mainFunction();
    if (accountsCollection) {
        next();
    } else {
        console.log("accountsCollection not found, returning error");
        return res.json("DB connected, but collection not found");
    }
});

// Function to connect to the MongoDB database
async function getAccounts() {
    try {
        console.log("Connecting to MongoDB...");
        await client.connect();
        const db = client.db("crm");
        let accountsData = db.collection("accounts");
        return accountsData; // Returning the collection object
    } catch (error) {
        console.error("Error connecting to DB:", error);
        return null;
    }
}

// GET ALL ACCOUNTS
router.get("/getAllAccounts", async (req, res) => {
    try {
        console.log("Fetching all accounts...");
        const accounts = await accountsCollection.find({}).toArray();
        console.log("Fetched accounts:", accounts);
        res.json(accounts);
    } catch (error) {
        console.error("Error fetching accounts:", error);
        res.status(500).json({ message: "Error fetching accounts" });
    }
});

// Get specific account using ID
router.get("/getAccountById/:id", async (req, res) => {
    const accountId = req.params.id;
    try {
        const account = await accountsCollection.findOne({ _id: ObjectId(accountId) });
        if (account) {
            res.status(200).json(account);
        } else {
            res.status(404).json({ message: "Account not found" });
        }
    } catch (error) {
        console.error("Error retrieving account:", error);
        res.status(500).send("Error retrieving account");
    }
});

// Create Account
router.post("/createAccount", async (req, res) => {
    try {
        const newAccount = req.body;

        // Get current time for created and modified timestamps
        const currentTime = new Date().toISOString();
        newAccount.dateTime = currentTime; // Set the dateTime when the account is created
        newAccount.modified = currentTime; // Set the modified timestamp

        // Insert the new account into the MongoDB "accounts" collection
        const settingDbAndCollection = client.db('crm').collection('accounts');
        const addingAccount = await settingDbAndCollection.insertOne(newAccount);

        // Send a response back with the new account's ID and details
        res.status(200).json({
            id: addingAccount.insertedId.toString(),
            ...newAccount,
        });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).send("Error creating account");
    }
});

// Update Account
router.put("/updateAccount/:id", async (req, res) => {
    const accountId = req.params.id;
    const updatedAccount = req.body;

    // Set the current dateTime to the modified timestamp
    updatedAccount.modified = new Date().toISOString();

    try {
        const result = await accountsCollection.updateOne(
            { _id: ObjectId(accountId) },
            { $set: updatedAccount }
        );

        if (result.modifiedCount === 1) {
            res.status(200).json({ message: "Account updated successfully" });
        } else {
            res.status(404).json({ message: "Account not found or no changes made" });
        }
    } catch (error) {
        console.error("Error updating account:", error);
        res.status(500).send("Error updating account");
    }
});

// Delete Account by ID
router.delete("/deleteAccount/:id", async (req, res) => {
    const accountId = req.params.id;

    try {
        const result = await accountsCollection.deleteOne({ _id: ObjectId(accountId) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Account deleted successfully" });
        } else {
            res.status(404).json({ message: "Account not found" });
        }
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).send("Error deleting account");
    }
});

module.exports = router;


// require("dotenv").config();
// const express = require("express");
// const router = express.Router();
// const { MongoClient, ObjectId } = require("mongodb");

// const URI = process.env.MONGODB_URI;
// const client = new MongoClient(URI);

// let accountsCollection;

// const mainFunction = async () => {
//     accountsCollection = await getAccounts();
// };

// // Middleware to ensure DB and collection are set up
// router.use(async (req, res, next) => {
//     console.log("Middleware: Checking if accountsCollection exists");
//     await mainFunction();
//     if (accountsCollection) {
//         next();
//     } else {
//         console.log("accountsCollection not found, returning error");
//         return res.json("DB connected, but collection not found");
//     }
// });

// // Function to connect to the MongoDB database
// async function getAccounts() {
//     try {
//         console.log("Connecting to MongoDB...");
//         await client.connect();
//         const db = client.db("crm");
//         let accountsData = db.collection("accounts");
//         return accountsData; // Returning the collection object
//     } catch (error) {
//         console.error("Error connecting to DB:", error);
//         return null;
//     }
// }

// // Create Account
// router.post("/createAccount", async (req, res) => {
//     try {
//         const newAccount = req.body;

//         // Get current time for created and modified timestamps
//         const currentTime = new Date().toISOString();
//         newAccount.dateTime = currentTime; // Set the dateTime when the account is created
//         newAccount.modified = currentTime; // Set the modified timestamp

//         // Insert the new account into the MongoDB "accounts" collection
//         const settingDbAndCollection = client.db('crm').collection('accounts');
//         const addingAccount = await settingDbAndCollection.insertOne(newAccount);

//         // Send a response back with the new account's ID and details
//         res.status(200).json({
//             id: addingAccount.insertedId.toString(),
//             ...newAccount,
//         });
//     } catch (error) {
//         console.error("Error creating account:", error);
//         res.status(500).send("Error creating account");
//     }
// });

// // Get Account by ID (for editing purposes)
// router.get("/getIdForEdit/:id", async (req, res) => {
//     const accountId = req.params.id;
//     try {
//         const account = await accountsCollection.findOne({ _id: ObjectId(accountId) });
//         if (account) {
//             res.status(200).json(account);
//         } else {
//             res.status(404).json({ message: "Account not found" });
//         }
//     } catch (error) {
//         console.error("Error retrieving account:", error);
//         res.status(500).send("Error retrieving account");
//     }
// });

// // Update Account
// router.put("/updateAccount/:id", async (req, res) => {
//     const accountId = req.params.id;
//     const updatedAccount = req.body;

//     // Set the current dateTime to the modified timestamp
//     updatedAccount.modified = new Date().toISOString();

//     try {
//         const result = await accountsCollection.updateOne(
//             { _id: ObjectId(accountId) },
//             { $set: updatedAccount }
//         );

//         if (result.modifiedCount === 1) {
//             res.status(200).json({ message: "Account updated successfully" });
//         } else {
//             res.status(404).json({ message: "Account not found or no changes made" });
//         }
//     } catch (error) {
//         console.error("Error updating account:", error);
//         res.status(500).send("Error updating account");
//     }
// });

// module.exports = router;
// // routes/contact.js

// require("dotenv").config();
// const express = require("express");
// const router = express.Router();
// const { MongoClient, ObjectId } = require("mongodb");

// const URI = process.env.MONGODB_URI;
// const client = new MongoClient(URI);

// let accoutsCollection;

// const mainFunction = async () => {
//     accoutsCollection = await getaccouts(); 
// };


// router.use(async (req, res , next) => {
//     await mainFunction();
//     if (accoutsCollection) {
//         next();
//     } else {
//         return res.json("DB connected, but collection not found");
//     }
// });
  
// async function getaccouts() {
//     try {
//         console.log("Connecting to MongoDB...");
//         await client.connect();
//         const db = client.db("crm");
//         let accountData = db.collection("accounts");
//         return accountData; 
//     } catch (error) {
//         console.error("Error connecting to DB:", error);
//         return null;
//     }
// }


// // GET ALL CONTACTS
// router.get("/getAllAccounts", async (req, res) => {
//     try {
//         console.log("Fetching all accounts...");
//         const accounts = await accoutsCollection.find({}).toArray();
//         console.log("Fetched contacts:", accounts);
//         res.json(accounts);
//     } catch (error) {
//         console.error("Error fetching contacts:", error);
//         res.status(500).json({ message: "Error fetching contacts" });
//     }
// });


// // Get specific leads using ID
// router.get("/data/:id", async (req, res) => {
//   try {
//     const accountId = req.params.id; 
//     const fetchAccountIndividual = client.db("crm").collection("accounts");
//     const accountIndividualInformation = fetchAccountIndividual.findOne({
//       _id: new ObjectId(accountId),
//     });

//     if (!accountIndividualInformation) {
//       return res.status(404).json({ message: "Lead not found" });
//     }
    
//     res.status(200).json(await accountIndividualInformation);
//   } catch (error) {
//     console.error("Error fetching lead:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });


// //Create contacts
// router.post("/createAccount", async (req, res) => {
//     try{
//         const newAccount = req.body;
        
//         const currentTime = new Date().toISOString();
//         newAccount.dateTime = currentTime; 
//         newAccount.modified = currentTime;

//         const settingDbAndCollection = client.db('crm').collection('accounts')
//         const addingAccount = await settingDbAndCollection?.insertOne(newAccount);

//         res.status(200).json({
//             id: addingAccount.insertedId.toString(),
//             ...newAccount,
//         });
//     }catch (error) {
//         console.error("Error creating lead:", error);
//         res.status(500).send("Error creating lead");
//     }
// });
    

// // // Update a contact by ID
// // router.put("/updateContact/:id", async (req, res) => {
// //   const contactId = req.params.id;
// //   const updatedContact = req.body; // Data coming from the request body

// //   try {
// //       // Fetch the existing contact from the database
// //       const contact = await client.db("crm").collection("contacts").findOne({
// //           _id: new ObjectId(contactId),
// //       });

// //       if (!contact) {
// //           return res.status(404).json({ message: "Contact not found" });
// //       }

// //       // Get the current time for the modification timestamp
// //       const currentTime = new Date().toISOString();

// //       // Retrieve the existing modifications array or initialize an empty array
// //       const modifications = contact.modifications || [];
// //       modifications.push(currentTime); // Add the new modification timestamp

// //       // Now, update the contact with the new modifications array
// //       const result = await client.db("crm").collection("contacts").updateOne(
// //           { _id: new ObjectId(contactId) },
// //           {
// //               $set: {
// //                   ...updatedContact, // Update other fields from the request body
// //                   modifications: modifications, // Add the modifications array with the new timestamp
// //                   modified: currentTime, // Update the modified field with the new timestamp
// //               },
// //           }
// //       );

// //       if (result.matchedCount === 0) {
// //           return res.status(404).json({ message: "Contact not found" });
// //       }

// //       // Return the updated contact data, including modifications
// //       res.status(200).json({
// //           message: "Contact updated successfully",
// //           updatedContact: { ...updatedContact, modifications: modifications }, // Send the updated contact with modifications
// //       });
// //   } catch (error) {
// //       console.error("Error updating contact:", error);
// //       res.status(500).json({ message: "Error updating contact" });
// //   }
// // });


// // // Delete a contact by ID
// // router.delete("/deleteContact/:id", async (req, res) => {
// //     const contactId = req.params.id;
  
// //     try {
// //       const result = await client.db("crm").collection("contacts").deleteOne({
// //         _id: new ObjectId(contactId),
// //       });
  
// //       if (result.deletedCount === 1) {
// //         return res.status(200).json({ message: "Contact deleted successfully" });
// //       } else {
// //         return res.status(404).json({ message: "Contact not found" });
// //       }
// //     } catch (error) {
// //       console.error("Error deleting contact:", error);
// //       return res.status(500).json({ message: "Error deleting contact" });
// //     }
// // });


// // //retrive data already exist
// // router.get("/getContactById/:id", async (req, res) => {
// //   const contactId = req.params.id;
// //   const contact = await client.db("crm").collection("contacts").findOne({
// //      _id: new ObjectId(contactId) 
// //     });

// //   if (contact) {
// //     res.status(200).json(contact);
// //   } else {
// //     res.status(404).json({ message: "contact not found" });
// //   }
// // });
  
// module.exports = router;