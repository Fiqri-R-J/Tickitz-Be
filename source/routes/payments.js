const express = require("express");
const router = express.Router();
const paymentsController = require("../controller/payments");
const middleware = require("../middleware/payments");
const authMiddleware = require("../middleware/auth");
const redisMiddleware = require("../middleware/redis");

// CREATE
router.post(
  "/add-payments",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.createPaymentsValidator,
  paymentsController.addPayments
);

// READ - SORT BY CREATED_AT & SEARCH BY PAYMENTS_ID
router.get(
  "/search/:title?",
  redisMiddleware.getPayments_Redis,
  paymentsController.getPayments
);

// JOIN TABLE
router.get(
    "/search-join",
    // redisMiddleware.getPayments_Redis,
    paymentsController.getJoinTable
  );

// UPDATE
router.patch(
  "/edit/:id",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  //   middleware.updatePaymentsPartialValidator,
  paymentsController.updatePayments
);

// // DELETE
// router.delete(
//   "/delete/:id",
//   authMiddleware.validateToken,
//   authMiddleware.validateRole,
//   schedulesController.deleteSchedules
// );

module.exports = router;
