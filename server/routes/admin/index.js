const express = require("express");

const { authenticate, isAdmin } = require("../../middleware/auth");

const router = express.Router();

router.use(authenticate, isAdmin);
router.use('/item', require("./item.index"));

module.exports = router;