let mongoose = require('mongoose');

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
    type: String,
    required: true
  },
  fizzFactor: {
    type: String,
    required: false
  }

})

let Wine = mongoose.model('Wine', wineSchema)

module.exports = Wine
