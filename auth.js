// const creds = require('./config/config.js');
const jwt = require('jsonwebtoken');

function auth(req, res, next){
  const token = req.header('Authorization');
  console.log('TOKEN from headers', token);
  // console.log("request: ", req);
  if (!token) {
    // wrong user (unauthorised)
    res.status(401).json({msg: "No token authorisation denied", token: token})
    return next();
  }

  try {
    // verify jsonwebtoken
    const decoded = jwt.verify(token, "ra_myjwtSecret")
    // add user from payload

    console.log( 'authed!' );

    req.user = decoded;
    return next();
  } catch(e){
    console.log('Decode error', e);
    res.status(400).json({msg: 'token is not valid'})
  }

}

module.exports = auth;
