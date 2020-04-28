const Seller = require('../../models/seller.js');

module.exports = {

  getAllSellers(req, res){
    Seller.find({},(err, result) => {
      if (err) {
        // return console.log(err);
          res.send('err')
        } else {
          res.json(result);
      }// res.json(response);
    })
  },
  getSingleSeller(req,res){
    Seller.find({name: req.params.name},(err, response) => {
      if (err) {
        return res.send('cant find');
      }
      return res.json(response)
      // res.json(response);
    })
  },
  addSeller(req, res){
    const {name, description, img, link, business} = req.body
    if (!name || !description || !img || !business) {
    return res.status(400).json({msg: `wine ${name}, description ${description}, img ${img}, business ${business}`})
    }

    const newSeller = new Seller({
        name,
        description,
        img,
        link,
        business
      })
    //
    newSeller.save()
    .then( seller => {
      res.json({
        seller: {
          name: seller.name,
          description: seller.description,
          img: seller.img,
          link: seller.link,
          business: seller.business
        }
      })
    })
  },
  updateSeller(req, res){
    const {newName, newDescription, newImg, newLink, newBusiness, id} = req.body
    if (!newName || !newDescription || !newImg || !newBusiness || !id) {
    return res.status(400).json({msg: `enter all feilds:  newName: ${newName}, newDescription: ${newDescription}, newImg: ${newImg}, newLink: ${newLink}, newBusiness ${newBusiness}, id: ${id}`})
    }
    Seller.findByIdAndUpdate(id, { "$set": {name: newName, description: newDescription, img: newImg, link: newLink, business:newBusiness }}, function(err, seller){

     if(err) {
         console.log(err);

         res.status(500).send(err);
     } else {

        res.status(200).send(seller);
     }
   })
 },
  deleteSeller(req, res){
    Seller.deleteOne({ name: req.params.name }, function(err) {
        if (err)
            res.send(err);
        else
            res.json({ message: `${req.params.name}: Seller Deleted!`});
    });
  }

}
