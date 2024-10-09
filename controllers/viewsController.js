const db = require('./../database');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const [tours] = await db.execute(`SELECT 
    trs.id,
    trs.name,
    trs.duration,
    trs.max_group_size AS maxGroupSize,
    trs.difficulty,
    trs.ratings_average AS ratingsAverage,
    trs.ratings_quantity AS ratingsQuantity,
    trs.price,
    trs.price_discount AS priceDiscount,
    trs.summary,
    trs.description,
    trs.image_cover AS imageCover,
    trs.created_at AS createdAt,
    GROUP_CONCAT(DISTINCT imgs.image SEPARATOR ',') AS images,
    GROUP_CONCAT(DISTINCT dts.start_date SEPARATOR ',') AS startDates,
    tsl.address AS tslAddress,
    tsl.description AS tslDescription,
    GROUP_CONCAT(DISTINCT tl.description SEPARATOR ',') AS tlDescription,
    GROUP_CONCAT(DISTINCT tl.start_day SEPARATOR ',') AS tlStartDay
  FROM tours AS trs
  LEFT JOIN tours_images AS imgs ON imgs.tour_id = trs.id
  LEFT JOIN tours_start_dates AS dts ON dts.tour_id = trs.id
  LEFT JOIN tours_start_location AS tsl ON tsl.tour_id = trs.id
  LEFT JOIN tours_locations AS tl ON tl.tour_id = trs.id
  GROUP BY trs.id`);

  tours.forEach((tour) => {
    if (tour.images) tour.images = tour.images.split(',');
    if (tour.startDates) tour.startDates = tour.startDates.split(',');

    tour.startLocation = {};
    tour.startLocation.address = tour.tslAddress;
    delete tour.tslAddress;
    tour.startLocation.description = tour.tslDescription;
    delete tour.tslDescription;

    if (tour.tlDescription && tour.tlStartDay) {
      tour.locations = [];
      tour.tlDescription = tour.tlDescription.split(',');
      tour.tlStartDay = tour.tlStartDay.split(',');
      tour.tlDescription.forEach((tl, i) =>
        tour.locations.push({
          description: tl,
          day: tour.tlStartDay[i],
        })
      );
    }
  });

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const data = req.data;

  const [tour] = await db.execute(
    `SELECT 
      trs.id,
      trs.name,
      trs.duration,
      trs.max_group_size AS maxGroupSize,
      trs.difficulty,
      trs.ratings_average AS ratingsAverage,
      trs.ratings_quantity AS ratingsQuantity,
      trs.price,
      trs.price_discount AS priceDiscount,
      trs.summary,
      trs.description,
      trs.image_cover AS imageCover,
      trs.created_at AS createdAt,
      GROUP_CONCAT(DISTINCT imgs.image SEPARATOR ',') AS images,
      GROUP_CONCAT(DISTINCT dts.start_date SEPARATOR ',') AS startDates
    FROM tours AS trs
    LEFT JOIN tours_images AS imgs ON imgs.tour_id = trs.id
    LEFT JOIN tours_start_dates AS dts ON dts.tour_id = trs.id
    WHERE trs.id = ?
    GROUP BY trs.id`,
    [data.id]
  );

  if (!(tour.length > 0)) {
    return next(new AppError('Tour not found!', 404));
  }

  if (tour[0] && tour[0].images) tour[0].images = tour[0].images.split(',');
  if (tour[0] && tour[0].startDates) tour[0].startDates = tour[0].startDates.split(',');

  if (tour[0]) {
    const [startLocation] = await db.execute(`SELECT * FROM tours_start_location WHERE tour_id = ?`, [data.id]);
    const [locations] = await db.execute(`SELECT * FROM tours_locations WHERE tour_id = ?`, [data.id]);
    tour[0].startLocation = startLocation[0];
    tour[0].locations = locations;
  }

  if (tour[0]) {
    const [tourGuides] = await db.execute(
      `SELECT 
        users.name,
        users.role,
        users.email,
        users.photo
      FROM tours_guides
      LEFT JOIN users ON users.id = tours_guides.user_id
      WHERE tour_id = ?`,
      [data.id]
    );
    tour[0].guides = tourGuides;
  }

  if (tour[0]) {
    const [tourReviews] = await db.execute(
      `SELECT 
        review,
        rating,
        users.name,
        users.photo,
        created_at AS createdAt
      FROM reviews
      LEFT JOIN users ON users.id = reviews.user_id
      WHERE tour_id = ?`,
      [data.id]
    );

    tour[0].reviews = tourReviews;
  }

  res.status(200).render('tour', {
    title: tour[0].name,
    tour: tour[0],
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'My account',
  });
};
