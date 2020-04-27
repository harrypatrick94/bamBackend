const express = require('express');
const router = express.Router();
const email_controller = require('../../controller/email/email.js')

router.post('/send', email_controller.sendMail);

module.exports = router
