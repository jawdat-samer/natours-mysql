const { validationResult, matchedData } = require('express-validator');
const multer = require('multer');
const sharp = require('sharp');
const db = require('./../database');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 50 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const [users] = await db.execute(
    `SELECT id, name, email, photo, role
    FROM users
    WHERE active IS NOT FALSE`
  );

  res.status(200).json({
    status: 'success',
    data: {
      users: users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

exports.getMe = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: req.user,
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.array({ onlyFirstError: true }),
    });
  }

  const data = matchedData(req);

  if (req.file && req.file.filename) {
    data.photo = req.file.filename;
  }

  if (!data.name && !data.email && !data.photo) {
    return next(new AppError('Nothing to update!', 400));
  }

  await db.execute(
    `UPDATE users
    SET
      name = ?,
      email = ?,
      photo = ?
    WHERE id = ?`,
    [
      data.name ? data.name : req.user.name,
      data.email ? data.email : req.user.email,
      data.photo ? data.photo : req.user.photo,
      req.user.id,
    ]
  );

  res.status(200).json({
    status: 'success',
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await db.execute(
    `UPDATE users
    SET
      active = FALSE
    WHERE id = ?`,
    [req.user.id]
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
