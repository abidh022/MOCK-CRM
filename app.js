let express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();
const serverless = require('serverless-http'); // Import serverless-http

const leadRoutes = require('./routes/leadRoutes');
const contactRoutes = require('./routes/contactRoutes')

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/leads', leadRoutes);

app.listen(port,()=>{
    console.log(`Server Listining at http://localhost:${port}`);
})

// module.exports = app;
module.exports.handler = serverless(app);