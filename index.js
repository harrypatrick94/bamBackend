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

app.get('/test', (req, res) => {
  res.send('hello world')
})


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
  console.log(req.query);
  let name = req.body.name
  let email = req.body.email
  let message = req.body.message
  let content = `name: ${name} \n email: ${email} \n message: ${message}`

  let mail = {
    from: name,
    to: 'bensonandthemooch@gmail.com',  // Change to email address that you want to receive messages on
    subject: 'New Message from Contact Form',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
       status: 'success'
      })
    }
  })
})

// app.get('/', (req, res) => {
//   res.send('HEY!')
// })



app.listen(PORT, () => { console.log(`started on ${PORT}`)})
