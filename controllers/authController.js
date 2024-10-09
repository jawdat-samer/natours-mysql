const { promisify } = require('util');
const crypto = require('crypto');
const { validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./../database');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  return [resetToken, hashedResetToken];
};

exports.signup = catchAsync(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.array({ onlyFirstError: true }),
    });
  }

  const data = matchedData(req);

  const [checkEmail] = await db.execute(`SELECT * FROM users WHERE email = ?`, [data.email]);
  if (checkEmail.length > 0) {
    return next(new AppError('Email provided already exists!', 400));
  }

  data.password = await bcrypt.hash(data.password, 12);

  const [newUser] = await db.execute(
    `INSERT INTO users
    (name, email, photo, password)
    VALUES (?, ?, ?, ?)`,
    [data.name, data.email, data.photo ? data.photo : 'default.jpg', data.password]
  );

  const token = signToken(newUser.insertId);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  });

  res.status(201).json({
    status: 'success',
    token: token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.array(),
    });
  }

  const data = matchedData(req);

  // 1) Check if email exist
  const [user] = await db.execute(`SELECT * FROM users WHERE email = ? LIMIT 1`, [data.email]);

  if (!(user.length > 0)) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!user[0].active) {
    return next(new AppError('Your account is no longer exists.', 401));
  }

  // 2) Check if password is correct
  const checkPassword = await bcrypt.compare(data.password, user[0].password);

  if (!checkPassword) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  const token = signToken(user[0].id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    token: token,
  });
});

exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const [user] = await db.execute(
    `SELECT 
      id, 
      name, 
      email, 
      photo, 
      role,
      active,
      password_changed_at AS passwordChangedAt 
    FROM users 
    WHERE id = ? 
    LIMIT 1`,
    [decoded.id]
  );
  if (!(user.length > 0)) {
    return next(new AppError('Your account is no longer exists.', 401));
  }

  if (!user[0].active) {
    return next(new AppError('Your account is no longer exists.', 401));
  }

  // 4) Check if user changed password after the token was issued
  const changedTimestamp = Number.parseInt(user[0].passwordChangedAt.getTime() / 1000, 10);

  if (decoded.iat < changedTimestamp) {
    return next(new AppError('user recently changed password! Please log in again.', 401));
  }

  delete user[0].active;
  delete user[0].passwordChangedAt;

  req.user = user[0];

  // Grant access to protected route
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    // 1) Getting token and check if it's there
    if (req.cookies && req.cookies.jwt) {
      const token = req.cookies.jwt;

      // 2) Verification token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      // 3) Check if user still exists
      const [user] = await db.execute(
        `SELECT 
      id, 
      name, 
      email, 
      photo, 
      role,
      active,
      password_changed_at AS passwordChangedAt 
    FROM users 
    WHERE id = ? 
    LIMIT 1`,
        [decoded.id]
      );
      if (!(user.length > 0)) {
        return next();
      }

      if (!user[0].active) {
        return next();
      }

      // 4) Check if user changed password after the token was issued
      const changedTimestamp = Number.parseInt(user[0].passwordChangedAt.getTime() / 1000, 10);

      if (decoded.iat < changedTimestamp) {
        return next();
      }

      delete user[0].active;
      delete user[0].passwordChangedAt;

      res.locals.user = user[0];
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.array({ onlyFirstError: true }),
    });
  }

  const data = matchedData(req);

  const [user] = await db.execute(
    `SELECT * FROM users
    WHERE email = ?`,
    [data.email]
  );

  if (!(user.length > 0)) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  const [resetToken, hashedResetToken] = createPasswordResetToken();

  await db.execute(
    `UPDATE users SET 
      password_reset_token = ?, 
      password_reset_expires = ? 
    WHERE id = ?`,
    [hashedResetToken, new Date(Date.now() + 10 * 60 * 1000), user[0].id]
  );

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and
  passwordConfirm to ${resetURL}.\nIf you didn't forget your password, please ignore this
  email!`;

  try {
    await sendEmail({
      email: user[0].email,
      subject: 'Your password reset token (valid for 10 min)',
      message: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    await db.execute(
      `UPDATE users SET 
        password_reset_token = ?, 
        password_reset_expires = ? 
      WHERE id = ?`,
      [null, null, user[0].id]
    );

    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.array({ onlyFirstError: true }),
    });
  }

  const data = matchedData(req);

  const hashedResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const [user] = await db.execute(
    `SELECT * FROM users
    WHERE password_reset_token = ?
    LIMIT 1`,
    [hashedResetToken]
  );

  if (!(user.length > 0)) {
    return next(new AppError('Incorrect reset token URL! Try again later with new reset token.', 400));
  }

  const resetTimestamp = Number.parseInt(user[0].password_reset_expires.getTime(), 10);

  if (Date.now() > resetTimestamp) {
    await db.execute(
      `UPDATE users SET 
        password_reset_token = ?, 
        password_reset_expires = ? 
      WHERE id = ?`,
      [null, null, user[0].id]
    );

    return next(new AppError('Reset token expired! Try again later with new reset token.', 400));
  }

  data.password = await bcrypt.hash(data.password, 12);

  await db.execute(
    `UPDATE users SET
      password = ?, 
      password_changed_at = ?,
      password_reset_token = ?, 
      password_reset_expires = ? 
    WHERE id = ?`,
    [data.password, new Date(Date.now() - 1000), null, null, user[0].id]
  );

  const token = signToken(user[0].id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    token: token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.array({ onlyFirstError: true }),
    });
  }

  const data = matchedData(req);

  const [user] = await db.execute(
    `SELECT * FROM users
    WHERE id = ?`,
    [req.user.id]
  );

  const checkPassword = await bcrypt.compare(data.oldPassword, user[0].password);

  if (!checkPassword) {
    return next(new AppError('Wrong old password!, Please try again later.', 401));
  }

  data.newPassword = await bcrypt.hash(data.newPassword, 12);

  await db.execute(
    `UPDATE users
    SET
      password = ?,
      password_changed_at = ?
    WHERE id = ?`,
    [data.newPassword, new Date(Date.now() - 1000), req.user.id]
  );

  const token = signToken(req.user.id);

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    token: token,
  });
});
