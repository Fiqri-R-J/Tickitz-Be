const express = require("express");
const router = express.Router();
const schedulesController = require("../controller/schedules");
const middleware = require("../middleware/schedules");
// const authMiddleware = require("../middleware/auth");

const redisMiddleware = require("../middleware/redis");

// CREATE
router.post(
  "/add-schedules",
//   middleware.createMoviesValidator,
  schedulesController.addSchedules
);

// // READ - SORT BY CREATED_AT
// router.get(
//   "/search/:title?",
//   // authMiddleware.validateToken,
//   redisMiddleware.getReqMoviesByTitle_Redis,
//   moviesController.getMoviesbyTitle
// );

// // READ - SORT BY RELEASE_DATE
// router.get(
//   "/search-2/:title?",
//   // authMiddleware.validateToken,
//   redisMiddleware.getReqMoviesByTitle_Redis,
//   moviesController.getMoviesbyTitle2
// );

// // UPDATE
// router.patch(
//   "/edit/:id",
//   // authMiddleware.validateToken,
//   // authMiddleware.validateRole,
//   uploadMiddleware.fileExtLimiter([
//     ".png",
//     ".jpg",
//     ".jpeg",
//     ".PNG",
//     ".JPG",
//     ".JPEG",
//   ]),
//   uploadMiddleware.fileSizeLimiter,
//   middleware.updateMoviesPartialValidator,
//   moviesController.updateMoviesPartial
// );

// // DELETE
// router.delete(
//   "/delete/:id",
//   // authMiddleware.validateToken,
//   // authMiddleware.validateRole,
//   moviesController.deleteMovies
// );

module.exports = router;
