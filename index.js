const express = require('express');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const wine = require('./routes/wine/wine.js');
const seller = require('./routes/seller/seller.js');
const user = require('./routes/user/user.js');
const email = require('./routes/email/email.js');
const creds = require('./creds.js');

const PORT = 3000
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use('/', router)
app.use('/wines', wine)
app.use('/sellers', seller)
app.use('/', user)
app.use('/', email)

mongoose.connect(`mongodb+srv://${creds.mongodb}@cluster0-idibi.mongodb.net/test`, {useNewUrlParser: true, useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(PORT, () => { console.log(`started on ${PORT}`)})
