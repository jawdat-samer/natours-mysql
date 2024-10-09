const { validationResult } = require('express-validator');

const formatter = ({ msg }) => {
  return { msg: msg };
};

module.exports = (req, res) => {
  const validation = validationResult(req).formatWith(formatter);
  if (!validation.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      errors: validation.mapped({ onlyFirstError: true }),
    });
  }
};