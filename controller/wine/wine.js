const Wine = require('../../models/wine.js');

module.exports = {

  getAllWines(req, res){
    Wine.find({},(err, result) => {
      if (err) {
        // return console.log(err);
          res.send('err')
        } else {
          res.json(result);
      }// res.json(response);
    })
  },
  getSingleWine(req, res){
    // res.send(req.params.name)
    Wine.find({wineName: req.params.name},(err, response) => {
      if (err) {
        return res.send('cant find');
      }
      return res.json(response)
      // res.json(response);
    })
  }
}
