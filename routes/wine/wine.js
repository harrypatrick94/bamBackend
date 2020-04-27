const express = require('express');
const router = express.Router();
const wine_controller = require('../../controller/wine/wine.js')

router.get('/', wine_controller.getAllWines);
router.get('/:name', wine_controller.getSingleWine);
router.post('/add', wine_controller.addWine)
router.put('/:name', wine_controller.updateWine)
router.delete('/:name', wine_controller.deleteWine)

module.exports = router;
