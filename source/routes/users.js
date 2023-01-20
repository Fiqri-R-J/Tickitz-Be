const express = require("express");
const router = express.Router();
const usersController = require("../controller/users");
const middleware = require("../middleware/users");
// const authMiddleware = require("../middleware/auth");
// const uploadMiddleware = require("../middleware/upload");
const redisMiddleware = require("../middleware/redis");

// CREATE
router.post(
  "/register",
  // middleware.createUsersValidator,
  usersController.createUsers
);

// READ
router.get(
  "/:email?",
  // authMiddleware.validateToken,
  redisMiddleware.getReqAccountByEmail_Redis,
  usersController.getUsersByEmail
);

module.exports = router;
