let mongoose = require('mongoose');

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

module.exports = Seller
