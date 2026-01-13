const express = require("express");
const itemCtrl = require("./ctrl");

const { authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);
router.get('/', itemCtrl.listItems);
router.get('/:id', itemCtrl.getItem);
router.post('/', itemCtrl.createItem);

module.exports = router;