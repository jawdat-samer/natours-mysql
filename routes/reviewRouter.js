const express = require('express');

const reviewController = require('./../controllers/reviewController');
const validationController = require('./../controllers/validationController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.get('/', validationController.validateTourGetReview, reviewController.getAllReviews);
router.post(
  '/',
  authController.restrictTo('user'),
  validationController.validateTourCreateReview,
  reviewController.createReview
);

module.exports = router;
