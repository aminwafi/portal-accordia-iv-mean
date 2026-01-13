const express   = require("express");
const authCtrl  = require("./ctrl");
const authSchema = require("../../schema/auth.schema");

const { validateSchema, isVerifyOtp } = require("../../middleware/auth");

const router = express.Router();

router.post('/register', validateSchema(authSchema.registerSchema, 'body'), authCtrl.register);
router.post('/login', validateSchema(authSchema.loginSchema, 'body'), authCtrl.login);

router.post('/verify', isVerifyOtp, validateSchema(authSchema.verifyOtpSchema, 'body'), authCtrl.verifyOtp);

module.exports = router;