const { validationResult, matchedData } = require('express-validator');
const multer = require('multer');
const sharp = require('sharp');
const db = require('./../database');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const checkValidation = require('./../utils/checkValidation');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/tours');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `tour-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Only file images are allowed!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// exports.uploadTourImages = upload.array('images', 3);

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.imageCover || !req.files.images) return next();

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  checkValidation(req, res);

  const data = matchedData(req);

  let sql;
  let values;

  if (data.limit || data.page) {
    data.limit = data.limit || 10;
    data.page = data.page - 1 || 0;
    data.offset = data.page * data.limit;

    sql = `SELECT 
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
      GROUP BY trs.id
      LIMIT ?
      OFFSET ?`;
    values = [data.limit, data.offset];
  } else {
    sql = `SELECT 
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
        tsl.description AS tslDescription
      FROM tours AS trs
      LEFT JOIN tours_images AS imgs ON imgs.tour_id = trs.id
      LEFT JOIN tours_start_dates AS dts ON dts.tour_id = trs.id
      INNER JOIN tours_start_location AS tsl ON tsl.tour_id = trs.id
      GROUP BY trs.id`;
    values = [];
  }

  const [tours] = await db.execute(sql, values);

  tours.forEach((tour) => {
    if (tour.images) tour.images = tour.images.split(',');
    if (tour.startDates) tour.startDates = tour.startDates.split(',');

    tour.startLocation = {};
    tour.startLocation.address = tour.tslAddress;
    delete tour.tslAddress;
    tour.startLocation.description = tour.tslDescription;
    delete tour.tslDescription;
  });

  const [toursCount] = await db.execute(`SELECT COUNT(1) AS toursCount FROM tours`);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    toursAvailable: toursCount[0].toursCount,
    data: {
      tours: tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.array({ onlyFirstError: true }),
    });
  }

  const data = matchedData(req);

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

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour[0],
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  checkValidation(req, res);

  const data = matchedData(req);

  const [tour] = await db.execute(
    `INSERT INTO tours 
      (name, duration, max_group_size, difficulty, price, price_discount, summary, description, image_cover)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.duration,
      data.maxGroupSize,
      data.difficulty,
      data.price,
      data.priceDiscount > 0 ? data.priceDiscount : null,
      data.summary,
      data.description,
      data.imageCover,
    ]
  );

  if (data.images && data.images.length > 0) {
    const prepareImages = data.images.map((img) => `(?, ${tour.insertId})`).join(',');
    await db.execute(`INSERT INTO tours_images (image, tour_id) VALUES ${prepareImages}`, data.images);
  }

  if (data.startDates && data.startDates.length > 0) {
    const prepareDates = data.startDates.map((date) => `(?, ${tour.insertId})`).join(',');
    await db.execute(`INSERT INTO tours_start_dates (start_date, tour_id) VALUES ${prepareDates}`, data.startDates);
  }

  await db.execute(
    `INSERT INTO tours_start_location
      (address, description, tour_id)
    VALUES (?, ?, ?)`,
    [data.startLocation.address, data.startLocation.description, tour.insertId]
  );

  if (data.locations && data.locations.length > 0) {
    const locationsArray = [];
    const prepareLocations = data.locations
      .map((location) => {
        locationsArray.push(location.description, location.day);
        return `(? ,?, ${tour.insertId})`;
      })
      .join(',');

    await db.execute(
      `INSERT INTO tours_locations
        (description, start_day, tour_id)
      VALUES 
        ${prepareLocations}`,
      locationsArray
    );
  }

  if (data.guides && data.guides.length > 0) {
    const prepareGuides = data.guides.map((guide) => `(${tour.insertId}, ?)`).join(',');

    await db.execute(`INSERT INTO tours_guides (tour_id, user_id) VALUES ${prepareGuides}`, data.guides);
  }

  res.status(201).json({
    status: 'success',
    message: 'Tour created successfully',
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.array({ onlyFirstError: true }),
    });
  }

  const data = matchedData(req);

  if (
    data.name === undefined &&
    data.duration === undefined &&
    data.maxGroupSize === undefined &&
    data.difficulty === undefined &&
    data.price === undefined &&
    data.priceDiscount === undefined &&
    data.summary === undefined &&
    data.description === undefined &&
    data.imageCover === undefined &&
    (data.images?.length ? data.images.length === 0 : data.images === undefined) &&
    (data.startDates?.length ? data.startDates.length === 0 : data.images === undefined) &&
    data.startLocation === undefined &&
    (data.locations?.length ? data.locations.length === 0 : data.images === undefined) &&
    (data.guides?.length ? data.guides.length === 0 : data.guides === undefined)
  ) {
    return next(new AppError('There is nothing to update!', 404));
  }

  const [tour] = await db.execute(
    `SELECT 
      id,
      name,
      duration,
      max_group_size AS maxGroupSize,
      difficulty,
      price,
      price_discount AS priceDiscount,
      summary,
      description,
      image_cover AS imageCover
    FROM tours WHERE id = ?`,
    [data.id]
  );
  if (!tour[0]) {
    return next(new AppError(`Can't find any tour with id: ${data.id}`, 404));
  }

  await db.execute(
    `UPDATE tours SET 
        name = ?, 
        duration = ?, 
        max_group_size = ?,
        difficulty = ?,
        price = ?,
        price_discount = ?,
        summary = ?,
        description = ?,
        image_cover = ?
      WHERE id = ?`,
    [
      data.name !== undefined ? data.name : tour[0].name,
      data.duration !== undefined ? data.duration : tour[0].duration,
      data.maxGroupSize !== undefined ? data.maxGroupSize : tour[0].maxGroupSize,
      data.difficulty !== undefined ? data.difficulty : tour[0].difficulty,
      data.price !== undefined ? data.price : tour[0].price,
      data.priceDiscount !== undefined ? data.priceDiscount : tour[0].priceDiscount,
      data.summary !== undefined ? data.summary : tour[0].summary,
      data.description !== undefined ? data.description : tour[0].description,
      data.imageCover !== undefined ? data.imageCover : tour[0].imageCover,
      data.id,
    ]
  );

  if (data.images && data.images.length > 0) {
    await db.execute(`DELETE FROM tours_images WHERE tour_id = ?`, [data.id]);

    const prepareImages = data.images.map((img) => `(?, ${data.id})`).join(',');
    await db.execute(`INSERT INTO tours_images (image, tour_id) VALUES ${prepareImages}`, data.images);
  }

  if (data.startDates && data.startDates.length > 0) {
    await db.execute(`DELETE FROM tours_start_dates WHERE tour_id = ?`, [data.id]);

    const prepareDates = data.startDates.map((date) => `(?, ${data.id})`).join(',');
    await db.execute(`INSERT INTO tours_start_dates (start_date, tour_id) VALUES ${prepareDates}`, data.startDates);
  }

  if (data.startLocation && data.startLocation.address && data.startLocation.description) {
    await db.execute(`DELETE FROM tours_start_location WHERE tour_id = ?`, [data.id]);

    await db.execute(
      `INSERT INTO tours_start_location
        (address, description, tour_id)
      VALUES (?, ?, ?)`,
      [data.startLocation.address, data.startLocation.description, data.id]
    );
  }

  if (data.locations && data.locations.length > 0) {
    await db.execute(`DELETE FROM tours_locations WHERE tour_id = ?`, [data.id]);

    const locationsArray = [];
    const prepareLocations = data.locations
      .map((location) => {
        locationsArray.push(location.description, location.day);
        return `(? ,?, ${data.id})`;
      })
      .join(',');

    await db.execute(
      `INSERT INTO tours_locations
        (description, start_day, tour_id)
      VALUES 
        ${prepareLocations}`,
      locationsArray
    );
  }

  if (data.guides && data.guides.length > 0) {
    await db.execute(`DELETE FROM tours_guides WHERE tour_id = ?`, [data.id]);

    const prepareGuides = data.guides.map((guide) => `(${data.id}, ?)`).join(',');

    await db.execute(
      `INSERT INTO tours_guides
        (tour_id, user_id)
      VALUES
        ${prepareGuides}`,
      data.guides
    );
  }

  res.status(202).json({
    status: 'success',
    message: 'Tour updated successfuly',
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.array({ onlyFirstError: true }),
    });
  }

  const data = matchedData(req);

  const [tour] = await db.execute(`SELECT * FROM tours WHERE id = ?`, [data.id]);
  if (!tour[0]) {
    return next(new AppError(`Can't find any tour with id: ${data.id}`, 204));
  }

  await db.execute(`DELETE FROM tours WHERE id = ?`, [data.id]);

  res.status(200).json({
    status: 'success',
    message: 'Tour deleted successfuly',
  });
});
