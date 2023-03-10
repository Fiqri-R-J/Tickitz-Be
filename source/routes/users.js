const express = require("express");
const router = express.Router();
const usersController = require("../controller/users");
const middleware = require("../middleware/users");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");
const redisMiddleware = require("../middleware/redis");

// CREATE
router.post(
  "/register",
  middleware.createUsersValidator,
  usersController.createUsers
);

// READ
router.get(
  "/:email?",
  redisMiddleware.getReqAccountByEmail_Redis,
  usersController.getUsersByEmail
);

// UPDATE
router.patch(
  '/edit/:id',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  uploadMiddleware.fileExtLimiter([
    '.png',
    '.jpg',
    '.jpeg',
    '.PNG',
    '.JPG',
    '.JPEG',
  ]),
  uploadMiddleware.fileSizeLimiter,
  middleware.updateUsersPartialValidator,
  usersController.updateUsersPartial
)

// DELETE
router.delete(
  "/delete/:id",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.deleteUsers
);

module.exports = router;
