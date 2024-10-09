const { matchedData } = require('express-validator');
const db = require('./../database');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const checkValidation = require('./../utils/checkValidation');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  checkValidation(req, res);

  const data = matchedData(req);

  let sql;
  let values;

  if (data.tourId) {
    sql = `SELECT 
      review,
      rating,
      users.name AS username,
      users.photo
    FROM reviews
    LEFT JOIN users ON users.id = reviews.user_id
    WHERE reviews.tour_id = ?`;

    values = [data.tourId];
  } else {
    sql = `SELECT 
      review,
      rating,
      users.name AS username,
      users.photo,
      tours.name AS tour
    FROM reviews
    LEFT JOIN users ON users.id = reviews.user_id
    LEFT JOIN tours ON tours.id = reviews.tour_id`;

    values = [];
  }

  const [reviews] = await db.execute(sql, values);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  checkValidation(req, res);

  const data = matchedData(req);

  if (!data.tourId) {
    return next(new AppError(`Can't find the tour`, 404));
  }

  const [checkTour] = await db.execute(`SELECT * FROM tours WHERE id = ?`, [data.tourId]);

  if (!(checkTour.length > 0)) {
    return next(new AppError(`Can't find the tour`, 404));
  }

  data.userId = req.user.id;

  const [review] = await db.execute(
    `INSERT INTO reviews
      (review, rating, tour_id, user_id)
    VALUES
      (?, ?, ?, ?)`,
    [data.review, data.rating, data.tourId, data.userId]
  );

  res.status(201).json({
    status: 'success',
    message: 'Review added successfuly',
  });
});
