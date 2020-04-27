const nodemailer = require('nodemailer');

const transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
    auth: {
    user: 'bensonandthemooch@gmail.com',
    pass: 'discojuice'
  }
}

const transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

module.exports = {

  sendMail(req, res){
    const {name, email, message} = req.body
    const content = `name: ${name} \n email: ${email} \n message: ${message} `
    const mail = {
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
  }
}
