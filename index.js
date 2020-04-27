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
// const auth = require('./auth');
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

  const {name, email, message} = req.body
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
// create user
// app.post('/register', (req, res) => {
//   // res.send(req.body)
//   const {userName, password} = req.body
// //   // small validation
//   if (!userName || !password) {
//     return res.status(400).json({msg: "Please enter all fields"})
//   }
//   User.findOne({userName})
//     .then(user => {
//       if(user) {
//         return res.status(400).json({ msg: "User already exists"})
//       }// if
// // create new user
//       const newUser = new User({
//         userName,
//         password
//       }) // new user
//
//       // create password hash
//       bcrypt.genSalt(10, (err, salt) => {
//         //salt the password
//         bcrypt.hash(newUser.password, salt, (err, hash) => {
//           if (err) throw err;
//           // has the password
//           newUser.password = hash;
//           newUser.save()
//             .then(user => {
//               jwt.sign(
//                 {id: user.id},
//                 "ra_myjwtSecret",
//                 {expiresIn: 7200},
//                 (err, token) => {
//                   if (err) throw err
//                   res.json({
//                     token,
//                     user: {
//                       id: user.id,
//                       userName: user.userName
//                   } // user
//                 }) // res .json
//               } //jwt callback
//             ) // sign
//           }) // then
//         }) // hash
//       }) // bcrypt
//     }) // then
//   res.send('register')
// }) // post
//
// app.post('/signIn', (req, res) => {
//   const {userName, password} = req.body
//   if (!userName || !password) {
//     return res.status(400).json({msg: "Please enter all fields"})
//   }
//   if (userName) {
//     console.log("user: ", userName);
//   }
// // find user
// User.findOne({userName})
//   .then(user => {
//     if(!user) {
//       return res.status(400).json({ msg: "User does not exists"})
//     }// if
//     //validate password
//     bcrypt.compare(password, user.password)
//       .then(isMatch => {
//         if (!isMatch) return res.status(400).json({msg: 'Invlaid credentials'});
//         jwt.sign(
//             {id: user.id},
//             // get secret
//               "ra_myjwtSecret",
//             {expiresIn: 7200},
//             (err, token) => {
//               // return token id, username
//               if (err) throw err
//               res.json({
//                 token,
//                 user: {
//                   id: user.id,
//                   userName: user.userName,
//               } // user
//             }) // res .json
//           } //jwt callback
//         ) // sign
//       })
//       .catch(err => console.log("bcrypt: ", err))
//   }) // then
//   .catch(err => console.warn(err))
//
// }) //signIn
app.listen(PORT, () => { console.log(`started on ${PORT}`)})
