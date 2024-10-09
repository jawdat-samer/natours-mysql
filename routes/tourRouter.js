const express = require('express');

const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const validatationController = require('./../controllers/validationController');
const reviewRouter = require('./../routes/reviewRouter');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.get('/', validatationController.validateTourOptions, tourController.getAllTours);
router.get('/:id', validatationController.validateTourID, tourController.getTour);
router.post(
  '/',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  validatationController.validateTourCreate,
  tourController.createTour
);
router.patch(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.uploadTourImages,
  tourController.resizeTourImages,
  validatationController.validateTourID,
  validatationController.validateTourUpdate,
  tourController.updateTour
);
router.delete(
  '/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  validatationController.validateTourID,
  tourController.deleteTour
);

module.exports = router;
