const express = require('express');
const router = express.Router();
const wine_controller = require('../../controller/wine/wine.js')

router.get('/wines', wine_controller.getAllWines);
router.get('/wines/:name', wine_controller.getSingleWine);

module.exports = router;
