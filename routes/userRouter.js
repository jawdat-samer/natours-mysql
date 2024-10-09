const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const validationControler = require('./../controllers/validationController');

const router = express.Router();

router.post('/signup', validationControler.validateUserSignup, authController.signup);
router.post('/login', validationControler.validateUserLogin, authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', validationControler.validateUserForgotPassword, authController.forgotPassword);
router.patch('/resetPassword/:token', validationControler.validateUserResetPassword, authController.resetPassword);

router.use(authController.protect);

router.patch('/updatePassword', validationControler.validateUserUpdatePassword, authController.updatePassword);

router.get('/me', userController.getMe);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  validationControler.validateUserUpdateMe,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
