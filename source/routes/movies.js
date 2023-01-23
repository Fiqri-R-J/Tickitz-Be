const express = require("express");
const router = express.Router();
const moviesController = require("../controller/movies");
const middleware = require("../middleware/movies");
// const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");
const redisMiddleware = require("../middleware/redis");

// CREATE
router.post(
  "/add-movies",
  // uploadMiddleware.fileExtLimiter([
  //   ".png",
  //   ".jpg",
  //   ".jpeg",
  //   ".PNG",
  //   ".JPG",
  //   ".JPEG",
  // ]),
  middleware.createMoviesValidator,
  moviesController.addMovies
);

// READ
router.get(
  "/:title?",
  // authMiddleware.validateToken,
  // redisMiddleware.getReqAccountByEmail_Redis,
  moviesController.getMoviesbyTitle
);

module.exports = router;
