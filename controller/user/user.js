const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');

module.exports = {

  registerUser(req, res){
    const {userName, password} = req.body

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
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
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
  },
  signIn(req, res){
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
  }

}
