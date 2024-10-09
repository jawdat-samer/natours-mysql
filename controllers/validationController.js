const { param, query, body } = require('express-validator');

// Tour Validation
exports.validateTourID = [param('id').trim().escape().notEmpty().withMessage('Tour id is required!')];

exports.validateTourOptions = [
  query('limit').optional().trim().escape().isInt().withMessage('Limit must be a number'),
  query('page').optional().trim().escape().isInt().withMessage('Limit must be a number'),
];

exports.validateTourCreate = [
  body('name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('A tour must have a name!')
    .isString()
    .withMessage('Tour name must be a string'),
  body('duration')
    .notEmpty()
    .withMessage('A tour must have a duration!')
    .isInt()
    .withMessage('A group duration must be a number'),
  body('maxGroupSize')
    .notEmpty()
    .withMessage('A tour must have a group size!')
    .isInt()
    .withMessage('A group size must be a number'),
  body('difficulty')
    .notEmpty()
    .withMessage('A tour difficulty is required!')
    .custom((value) => {
      if (!(value === 'easy') && !(value === 'medium') && !(value === 'difficult')) {
        throw new Error('A tour difficulty must be (easy, medium, difficult)!');
      } else {
        return value;
      }
    }),
  body('price').notEmpty().withMessage('A tour must have a price!').isNumeric().withMessage('Price must be a number!'),
  body('priceDiscount').optional().isNumeric().withMessage('A tour price discount must be a number!'),
  body('summary')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('A tour must have a summary')
    .isString('Tour summary must be a string!'),
  body('description').optional().trim().escape().isString('Tour description must be a string!'),
  body('imageCover')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('A tour must have a image cover')
    .isString('Image cover must a valid path!'),
  body('images').optional().isArray({ min: 1 }).withMessage('Tour images must be a array with at least one item'),
  body('images[*]').optional().trim().escape().isString().withMessage('Tour image must be a valid path'),
  body('startDates')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Tour start date must be a array with at least one item'),
  body('startDates[*]').optional().trim().escape().toDate().isISO8601().withMessage('Tour date must be a valid date'),
  body('startLocation')
    .notEmpty()
    .withMessage('Start location is required')
    .isObject({ strict: true })
    .withMessage('Start location must be a json object with the required data'),
  body('startLocation.address').trim().escape().notEmpty().withMessage('Please provide a start location address'),
  body('startLocation.description')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please provide a start location description'),
  body('locations').isArray({ min: 1 }).withMessage('Tour locations must be a array with at least one item'),
  body('locations[*]')
    .notEmpty()
    .withMessage('location data is required')
    .isObject({ strict: true })
    .withMessage('location must be a json object with the required data'),
  body('locations[*].description').trim().escape().notEmpty().withMessage('Please provide a location description'),
  body('locations[*].day').notEmpty().isInt({ allow_leading_zeroes: false, gt: 0 }),
  body('guides').optional().isArray({ min: 1 }).withMessage('Tour guides must be a array with at least one item'),
  body('guides[*]').optional().isInt({ allow_leading_zeroes: false }).withMessage('Tour guide must be a valid ID'),
];

exports.validateTourUpdate = [
  body('name').optional().trim().escape().isString().withMessage('Tour name must be a string'),
  body('duration').optional().isInt().withMessage('A group duration must be a number'),
  body('maxGroupSize').optional().isInt().withMessage('A group size must be a number'),
  body('difficulty')
    .optional()
    .custom((value) => {
      if (!(value === 'easy') && !(value === 'medium') && !(value === 'difficult')) {
        throw new Error('A tour difficulty must be (easy, medium, difficult)!');
      } else {
        return value;
      }
    }),
  body('price').optional().isNumeric().withMessage('Price must be a number!'),
  body('priceDiscount').optional().isNumeric().withMessage('A tour price discount must be a number!'),
  body('summary').optional().trim().escape().notEmpty().isString('Tour summary must be a string!'),
  body('description').optional().trim().escape().isString('Tour description must be a string!'),
  body('imageCover').optional().trim().escape().isString('Image cover must a valid path!'),
  body('images').optional().isArray({ min: 1 }).withMessage('Tour images must be a array with at least one item'),
  body('images[*]').optional().trim().escape().isString().withMessage('Tour image must be a valid path'),
  body('startDates')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Tour start date must be a array with at least one item'),
  body('startDates[*]').optional().trim().escape().toDate().isISO8601().withMessage('Tour date must be a valid date'),
  body('startLocation')
    .optional()
    .isObject({ strict: true })
    .withMessage('Start location must be a json object with the required data'),
  body('startLocation.address')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please provide a start location address'),
  body('startLocation.description')
    .optional()
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please provide a start location description'),
  body('locations').optional().isArray({ min: 1 }).withMessage('Tour locations must be a array with at least one item'),
  body('locations[*]')
    .notEmpty()
    .withMessage('location data is required')
    .isObject({ strict: true })
    .withMessage('location must be a json object with the required data'),
  body('locations[*].description').trim().escape().notEmpty().withMessage('Please provide a location description'),
  body('locations[*].day').notEmpty().isInt({ allow_leading_zeroes: false, gt: 0 }),
  body('guides').optional().isArray({ min: 1 }).withMessage('Tour guides must be a array with at least one item'),
  body('guides[*]').optional().isInt({ allow_leading_zeroes: false }).withMessage('Tour guide must be a valid ID'),
];

// Auth Validation
exports.validateUserSignup = [
  body('name').trim().escape().notEmpty().isString().withMessage('Please provide your name!'),
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .toLowerCase()
    .withMessage('Please provide your email!')
    .isEmail()
    .withMessage('Please provide a valid email!'),
  body('photo').optional().trim().escape().isString().withMessage('Please provide your photo'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please provide a password')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password should be at least 8 characters'),
  body('passwordConfirm')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please confirm your password')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password should be at least 8 characters')
    .custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      } else {
        throw new Error('Password confirmation failed');
      }
    }),
];

exports.validateUserLogin = [
  body('email').trim().escape().notEmpty().isString().withMessage('Email is required!'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Password is required!')
    .isLength({ min: 8 })
    .withMessage('Password should be at least 8 characters'),
];

exports.validateUserForgotPassword = [
  body('email').trim().escape().notEmpty().isString().withMessage('Email is required!'),
];

exports.validateUserResetPassword = [
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please provide a password')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password should be at least 8 characters'),
  body('passwordConfirm')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please confirm your password')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password should be at least 8 characters')
    .custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      } else {
        throw new Error('Password confirmation failed');
      }
    }),
];

exports.validateUserUpdatePassword = [
  body('oldPassword')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please provide a password')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password should be at least 8 characters'),
  body('newPassword')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please provide a password')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password should be at least 8 characters'),
  body('newPasswordConfirm')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please confirm your password')
    .isStrongPassword({ minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0 })
    .withMessage('Password should be at least 8 characters')
    .custom((value, { req }) => {
      if (value === req.body.newPassword) {
        return true;
      } else {
        throw new Error('Password confirmation failed');
      }
    }),
];

// User Validation
exports.validateUserUpdateMe = [
  body('name').optional().trim().escape().isString().withMessage('Provided name is not valid!'),
  body('email').optional().trim().escape().toLowerCase().isEmail().withMessage('Provided email is not valid!'),
  // body('photo').optional().trim().escape().isString().withMessage('Please provide your photo'),
];

// Review validation
exports.validateTourGetReview = [param('tourId').optional().trim().escape().notEmpty().withMessage('Invalid tour id')];

exports.validateTourCreateReview = [
  body('review').trim().escape().notEmpty().withMessage('Review can not be empty!'),
  body('rating')
    .notEmpty()
    .withMessage('Rating can not be empty!')
    .isInt({ allow_leading_zeroes: false, gt: 0, lt: 6 })
    .withMessage('Rating must be between 1 and 5'),
  param('tourId').optional().trim().escape().notEmpty().withMessage('Invalid tour id'),
  body('tourId').optional().trim().escape().notEmpty().withMessage('tourId is required'),
];

// View validation
exports.validateViewGetTour = [param('id').optional().trim().escape().notEmpty().withMessage('Invalid tour id!')];
