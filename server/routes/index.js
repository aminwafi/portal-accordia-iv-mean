const express   = require("express");
const router    = express.Router();

router.use('/admin', require("./admin"));
router.use('/auth', require("./auth"));
router.use('/item', require("./item"));

module.exports = router;