const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const leadRoutes = require('./routes/leadRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
// const port = 5000;

// MongoDB connection setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


let leadsCollection;
let contactsCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        const db = client.db("crm"); // database name
        leadsCollection = db.collection("leads"); //collection name
        contactsCollection = db.collection("contacts");
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToDatabase();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));


// Endpoint to retrieve leads
app.post('/data/leads', async (req, res) => {
    try {
        // await client.connect();
        const db = client.db("crm"); //database name
        leadsCollection = db.collection("leads");
        const result = await leadsCollection.insertOne(req.body);
        console.log(result);
        
        
        // Send only the insertedId in the response
        res.status(200).json({
            id: result.insertedId.toString()
        });
    } catch (error) {
        console.error('Error retrieving leads:', error);
        res.status(500).send('Error retrieving leads');
    }
});
//GET
app.get('/data/leads', async (req, res) => {
    try {
        const leads = await leadsCollection.find().toArray(); // Fetch all leads
        res.status(200).json(leads);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).send('Error fetching leads');
    }
});


app.use((req, res, next) => {
    req.leadsCollection = leadsCollection; // Add the leadsCollection to the request object
    next();
});

app.use('/data/leads', leadRoutes); // Use lead routes 


module.exports = app;
