const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().min(8).required()
});

const verifyOtpSchema = Joi.object({
    code: Joi.string().max(6).required()
});

module.exports = {
    registerSchema,
    loginSchema,
    verifyOtpSchema
}