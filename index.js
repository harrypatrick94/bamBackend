let express = require('express');
let router = express.Router();
let nodemailer = require('nodemailer');
let cors = require('cors');
let mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let bodyParser = require('body-parser');
const creds = require('./config/config.js');

app.get('/', (req, res) => {
  res.send('HEY!')
})

app.get('/test', (req, res) => {
  res.send('hello world')
})
app.listen(3000, () => console.log('Server running on port 3000'))
