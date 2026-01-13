const express = require("express");
const itemCtrl = require("../item/ctrl");
const itemSchema = require("../../schema/item.schema");

const { validateSchema } = require("../../middleware/auth");

const router = express.Router();

router.put('/:id', validateSchema(itemSchema.itemIdSchema, 'params'), 
validateSchema(itemSchema.updateItemSchema, 'body'), itemCtrl.updateItem);
router.delete('/:id', validateSchema(itemSchema.itemIdSchema), itemCtrl.deleteItem);

module.exports = router;