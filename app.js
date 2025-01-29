let express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 5000;
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const fetch = require('node-fetch');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/leads', require('./routes/leadRoutes'));
app.use('/contact', require('./routes/contactRoutes'));
app.use('/account', require('./routes/accountRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/mail', require('./routes/mailRoutes'));


app.listen(port,()=>{
    console.log(`Server Listining at http://localhost:${port}`);
})

module.exports = app;