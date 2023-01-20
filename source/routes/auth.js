const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.js");
const middleware = require("../middleware/auth");

router.post("/login", authController.login);
router.get("/token", authController.refreshToken);

module.exports = router;
