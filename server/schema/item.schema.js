const Joi = require("joi");

const itemIdSchema = Joi.object({
    id: Joi.number().required()
})

const createItemSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
});

const updateItemSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
});

module.exports = {
    itemIdSchema,
    createItemSchema,
    updateItemSchema
}