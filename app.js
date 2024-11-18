const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const leadRoutes = require('./routes/leadRoutes');
const cors = require('cors');

const app = express();
const port = 5000;

// MongoDB connection setup
const uri = "mongodb+srv://abidh22:9090@v1.gwylr.mongodb.net/crm?retryWrites=true&w=majority&appName=v1";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    socketTimeoutMS: 30000,  // Increase socket timeout to 30 seconds
    connectTimeoutMS: 30000
});

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

// Endpoint to retrieve leads
app.post('/api/leads', async (req, res) => {
    try {
        // await client.connect();
        const db = client.db("crm"); //database name
        leadsCollection = db.collection("leads");
        const result = await leadsCollection.insertOne(req.body);
        
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
app.get('/api/leads', async (req, res) => {
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

app.use('/api/leads', leadRoutes); // Use lead routes 


module.exports = app;
