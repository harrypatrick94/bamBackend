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

mongoose.connect('mongodb+srv://bensonMooch:discojuice@cluster0-idibi.mongodb.net/test
', {useNewUrlParser: true} )
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

// add wines
app.post('/add', (req, res) => {

  const {wineName, description, img} = req.query
  // res.send(req.query)
  if (!wineName || !description || !img) {
  return res.status(400).json({msg: "Please enter all fields"})
  }
  //
  const newWine = new Wine({
      wineName,
      description,
      img
    })
  //
  newWine.save()
  .then( wine => {
    res.json({
      wine: {
        name: wine.wineName,
        description: wine.description,
        img: wine.img
      }
    })
  })
})

// find all wines
app.get('/user', (req, res) => {

  Wine.find({},(err, result) => {
    if (err) {
      // return console.log(err);
        res.send('err')
      } else {
        res.json(result);
    }// res.json(response);
  })
})

app.get('/test', (req, res) => {
  res.send('hello world')
})

app.listen(PORT, () => { console.log(`started on ${PORT}`)})
