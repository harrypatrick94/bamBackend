const express = require('express');
const router = express.Router();
const user_controller = require('../../controller/user/user.js')

router.post('/signIn', user_controller.signIn)

module.exports = router
