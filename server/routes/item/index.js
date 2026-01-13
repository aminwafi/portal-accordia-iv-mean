const express = require("express");
const itemCtrl = require("./ctrl");
const itemSchema = require("../../schema/item.schema");

const { validateSchema, authenticate } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate);
router.get('/', itemCtrl.listItems);
router.get('/:id', validateSchema(itemSchema.itemIdSchema, 'params'), itemCtrl.getItem);
router.post('/', validateSchema(itemSchema.createItemSchema, 'body'), itemCtrl.createItem);

module.exports = router;