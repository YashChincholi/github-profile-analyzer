const express = require("express");
const router = express.Router();

const { syncUser } = require("../controllers/userController");

router.get("/sync/:username", syncUser);

module.exports = router;
