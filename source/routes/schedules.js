const express = require("express");
const router = express.Router();
const schedulesController = require("../controller/schedules");
const middleware = require("../middleware/schedules");
const authMiddleware = require("../middleware/auth");
const redisMiddleware = require("../middleware/redis");

// CREATE
router.post(
  "/add-schedules",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.createSchedulesValidator,
  schedulesController.addSchedules
);

// READ - SORT BY TIME & SEARCH BY LOCATION
router.get(
  "/search/:title?",
  redisMiddleware.getSchedules_Redis,
  schedulesController.getSchedulesbyLocation
);

// READ - SORT BY CREATED_AT & SEARCH BY CINEMA
router.get(
  "/search-2/:title?",
  redisMiddleware.getSchedules_Redis,
  schedulesController.getSchedulesbyLocation2
);

// UPDATE
router.patch(
  "/edit/:id",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.updateSchedulesPartialValidator,
  schedulesController.updateSchedulesPartial
);

// DELETE
router.delete(
  "/delete/:id",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  schedulesController.deleteSchedules
);

module.exports = router;
