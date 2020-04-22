let express = require('express');
let router = express.Router();
let nodemailer = require('nodemailer');
let cors = require('cors');
let mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let bodyParser = require('body-parser');
const creds = require('./config/config.js');
const auth = require('./auth');
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

mongoose.connect('mongodb+srv://bensonMooch:discojuice@cluster0-idibi.mongodb.net/test', {useNewUrlParser: true} )
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

const sellerSchema = new mongoose.Schema({
  name: {
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
  link: {
    type:  String,
    required: true
  }

})

let Seller = mongoose.model('Seller', sellerSchema)

// add seller
app.post('/addSeller', (req, res) => {
  const {name, description, img, link} = req.query

  if (!name || !description || !img || !link) {
  return res.status(400).json({msg: `wine ${name}, description ${description}, img ${img}, link ${link}`})
  }

  const newSeller = new Seller({
      name,
      description,
      img
    })
  //
  newSeller.save()
  .then( seller => {
    res.json({
      seller: {
        name: seller.name,
        description: seller.description,
        img: seller.img,
        link: seller.link
      }
    })
  })
})
// add wines
app.post('/add', (req, res) => {

  const {wineName, description, img} = req.body
  // res.send(req.body)
  if (!wineName || !description || !img) {
  return res.status(400).json({msg: `wine ${wineName}, description ${description}, img ${img}`})
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

  let toReturn = {
    wines: null,
    sellers: null
  }
  Wine.find({},(err, result) => {
    if (err) {
      // return console.log(err);
        res.send('err')
      } else {
        toReturn.wines = result
        res.json(toReturn);
    }// res.json(response);
  })
})
// single wine
app.get('/user/:name', (req, res) => {

  // res.send(req.params.name)
  Wine.find({wineName: req.params.name},(err, response) => {
    if (err) {
      return res.send('cant find');
    }
    return res.json(response)
    // res.json(response);
  })
})
// update wine
app.put('/user/:name', (req, res) => {

  const newName = req.body.newName
  const newDescription = req.body.newDescription
  const newImg = req.body.newImg
  const id = req.body.id
  // res.send(`hello put ${id}`);
  Wine.findByIdAndUpdate(id, { "$set": {wineName: newName, description: newDescription, img: newImg}}, function(err, wine){

   if(err) {
       console.log(err);

       res.status(500).send(err);
   } else {

      res.status(200).send(wine);
   }
 })// findOneAndUpdate
})
// delete single wine
app.delete('/user/:name', (req, res) => {

  Wine.deleteOne({ wineName: req.params.name }, function(err) {
        if (err)
            res.send(err);
        else
            res.json({ message: `${req.params.name}: Wine Deleted!`});
    });
}) // delete single wine
// create user
app.post('/register', (req, res) => {
  // res.send(req.body)
  const {userName, password} = req.body
//   // small validation
  if (!userName || !password) {
    return res.status(400).json({msg: "Please enter all fields"})
  }
  User.findOne({userName})
    .then(user => {
      if(user) {
        return res.status(400).json({ msg: "User already exists"})
      }// if
// create new user
      const newUser = new User({
        userName,
        password
      }) // new user

      // create password hash
      bcrypt.genSalt(10, (err, salt) => {
        //salt the password
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // has the password
          newUser.password = hash;
          newUser.save()
            .then(user => {
              jwt.sign(
                {id: user.id},
                "ra_myjwtSecret",
                {expiresIn: 7200},
                (err, token) => {
                  if (err) throw err
                  res.json({
                    token,
                    user: {
                      id: user.id,
                      userName: user.userName
                  } // user
                }) // res .json
              } //jwt callback
            ) // sign
          }) // then
        }) // hash
      }) // bcrypt
    }) // then
  res.send('register')
}) // post
// sigIn user
app.post('/signIn', (req, res) => {
  const {userName, password} = req.body
  if (!userName || !password) {
    return res.status(400).json({msg: "Please enter all fields"})
  }
  if (userName) {
    console.log("user: ", userName);
  }
// find user
User.findOne({userName})
  .then(user => {
    if(!user) {
      return res.status(400).json({ msg: "User does not exists"})
    }// if
    //validate password
    bcrypt.compare(password, user.password)
      .then(isMatch => {
        if (!isMatch) return res.status(400).json({msg: 'Invlaid credentials'});
        console.log("match");
        jwt.sign(
            {id: user.id},
            // get secret
              "ra_myjwtSecret",
            {expiresIn: 7200},
            (err, token) => {
              // return token id, username
              if (err) throw err
              res.json({
                token,
                user: {
                  id: user.id,
                  userName: user.userName,
              } // user
            }) // res .json
          } //jwt callback
        ) // sign
      })
      .catch(err => console.log("bcrypt: ", err))
  }) // then
  .catch(err => console.warn(err))

}) //signIn

app.get('/testing', (req, res) => {
  res.send('hello world')
})

app.listen(PORT, () => { console.log(`started on ${PORT}`)})
