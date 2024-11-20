const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');
const leadRoutes = require('./routes/leadRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// MongoDB connection setup
// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri);
// let leadsCollection;
// let contactsCollection;

// async function connectToDatabase() {
//     try {
//         await client.connect();
//         const db = client.db("crm"); // database name
//         leadsCollection = db.collection("leads");
//         contactsCollection = db.collection("contacts");
//         console.log("Connected to MongoDB!");
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         process.exit(1); // Exit process if connection fails
//     }
// }

// connectToDatabase();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Use lead routes
app.use('/leads', leadRoutes);

module.exports = app;
