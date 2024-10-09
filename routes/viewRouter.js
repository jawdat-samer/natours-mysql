const express = require('express');
const viewsController = require('./../controllers/viewsController');
const validationController = require('./../controllers/validationController');
const checkValidationHandler = require('./../utils/checkValidationHandler');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewsController.getOverview);
router.get('/tours/:id', validationController.validateViewGetTour, checkValidationHandler, viewsController.getTour);

router.get('/login', viewsController.getLoginForm);

router.use(authController.protect);

router.get('/me', viewsController.getAccount);

module.exports = router;
