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
  uploadMiddleware.fileExtLimiter([
    ".png",
    ".jpg",
    ".jpeg",
    ".PNG",
    ".JPG",
    ".JPEG",
  ]),
  uploadMiddleware.fileSizeLimiter,
  middleware.createMoviesValidator,
  moviesController.addMovies
);

// READ
router.get(
  "/:title?",
  // authMiddleware.validateToken,
  redisMiddleware.getReqMoviesByTitle_Redis,
  moviesController.getMoviesbyTitle
);

// UPDATE
router.patch(
  "/edit/:id",
  // authMiddleware.validateToken,
  // authMiddleware.validateRole,
  uploadMiddleware.fileExtLimiter([
    ".png",
    ".jpg",
    ".jpeg",
    ".PNG",
    ".JPG",
    ".JPEG",
  ]),
  uploadMiddleware.fileSizeLimiter,
  middleware.updateMoviesPartialValidator,
  moviesController.updateMoviesPartial
);

// DELETE
router.delete(
  "/delete/:id",
  // authMiddleware.validateToken,
  // authMiddleware.validateRole,
  moviesController.deleteMovies
);

module.exports = router;
