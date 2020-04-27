const express = require('express');
const router = express.Router();
const seller_controller = require('../../controller/seller/seller.js')

router.get('/', seller_controller.getAllSellers);
router.get('/:name', seller_controller.getSingleSeller);
router.post('/add', seller_controller.addSeller);
router.put('/update', seller_controller.updateSeller);
router.delete('/:name', seller_controller.deleteSeller)
module.exports = router
