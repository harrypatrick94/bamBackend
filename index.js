let express = require('express');
let router = express.Router();
let nodemailer = require('nodemailer');
let cors = require('cors');
let mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let bodyParser = require('body-parser');
const creds = require('./config/config.js');
const PORT = 3000

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use('/', router)


mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true} )
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const wineSchema = new mongoose.Schema({
  wineName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  img: {
    data: Buffer,
    type: String,
    required: true
  },

})

let Wine = mongoose.model('Wine', wineSchema)

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

let User = mongoose.model('User', userSchema)



app.get('/test', (req, res) => {
  res.send('hello world')
})

app.listen(PORT, () => { console.log(`started on ${PORT}`)})
