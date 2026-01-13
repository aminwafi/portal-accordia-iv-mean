const Joi = require("joi");

const itemIdSchema = Joi.object({
    id: Joi.number().required()
})

const createItemSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('').optional()
});

const updateItemSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('').optional()
});

module.exports = {
    itemIdSchema,
    createItemSchema,
    updateItemSchema
}