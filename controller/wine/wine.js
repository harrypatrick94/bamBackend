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
  },
  addWine(req,res){
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
  },
  updateWine(req, res){

    const {newName, newDescription, newImg, id} = req.body
    if (!newName || !newDescription || !newImg || !id) {
    return res.status(400).json({msg: `enter all feilds:  newName: ${newName}, newDescription: ${newDescription}, newImg: ${newImg},  id: ${id}`})
    }
    Wine.findByIdAndUpdate(id, { "$set": {wineName: newName, description: newDescription, img: newImg}}, function(err, wine){

     if(err) {
         console.log(err);

         res.status(500).send(err);
     } else {

        res.status(200).send(wine);
     }
   })
 },
  deleteWine(req, res){
   Wine.deleteOne({ wineName: req.params.name }, function(err) {
         if (err)
             res.send(err);
         else
             res.json({ message: `${req.params.name}: Wine Deleted!`});
    });
 }
}
