const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const leadRoutes = require('./routes/leadRoutes');
const cors = require('cors');
require('dotenv').config();  

const app = express();
const port = 5000;




// // MongoDB connection setup
// const uri = process.env.MONGODB_URI;
// if (!uri) {
//     console.error("MongoDB URI is not defined. Please check your .env file.");
//     process.exit(1); // Exit the process if MongoDB URI is not found
// }
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
//     socketTimeoutMS: 30000,  // Increase socket timeout to 30 seconds
//     connectTimeoutMS: 30000
// });

// let leadsCollection;
// let contactsCollection;

// async function connectToDatabase() {
//     try {
//         await client.connect();
//         const db = client.db("crm"); // database name
//         leadsCollection = db.collection("leads"); //collection name
//         contactsCollection = db.collection("contacts");
//         console.log("Connected to MongoDB!");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     }
// }

// connectToDatabase();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/data/leads', leadRoutes); // Use lead routes 

app.use((req, res, next) => {
    req.leadsCollection = leadsCollection; // Add the leadsCollection to the request object
    next();
});



module.exports = app;
