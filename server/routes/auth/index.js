const express   = require("express");
const authCtrl  = require("./ctrl");

const router    = express.Router();

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

module.exports = router;