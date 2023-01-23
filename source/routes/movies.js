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
  middleware.createMoviesValidator,
  moviesController.addMovies
);

// READ
router.get(
  "/:name?",
  // authMiddleware.validateToken,
  // redisMiddleware.getReqAccountByEmail_Redis,
  moviesController.getMoviesbyName
);


module.exports = router;
