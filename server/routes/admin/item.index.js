const express = require("express");
const itemCtrl = require("../item/ctrl");

const router = express.Router();

router.put('/:id', itemCtrl.updateItem);
router.delete('/:id', itemCtrl.deleteItem);

module.exports = router;