const express   = require("express");
const authCtrl  = require("./ctrl");

const router    = express.Router();

router.post('/register', authCtrl.register);

module.exports = router;