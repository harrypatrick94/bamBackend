const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const wine = require('./routes/wine/wine.js');
const seller = require('./routes/seller/seller.js');
const User = require('./models/user.js');

const creds = require('./config/config.js');
const auth = require('./auth');
const PORT = 3000
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use('/', router)
app.use('/wines', wine)
app.use('/sellers', seller)

let transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
    auth: {
    user: 'bensonandthemooch@gmail.com',
    pass: 'discojuice'
  }
}

let transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  console.log(req.body);
  let name = req.body.name
  let email = req.body.email
  let message = req.body.message
  let content = `name: ${name} \n email: ${email} \n message: ${message} `

  let mail = {
    from: name,
    to: 'bensonandthemooch@gmail.com',  // Change to email address that you want to receive messages on
    subject: 'New Message from Contact Form',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: err
      })
    } else {
      res.json({
       status: 'success'
      })
    }
  })
})

mongoose.connect('mongodb+srv://bensonMooch:discojuice@cluster0-idibi.mongodb.net/test', {useNewUrlParser: true, useFindAndModify: false} )
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(PORT, () => { console.log(`started on ${PORT}`)})
