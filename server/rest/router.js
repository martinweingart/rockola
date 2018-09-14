const express = require('express');
const body_parser = require('body-parser');
const router = express.Router();
const return_types = require('../return_types');

router.use(body_parser.json());

router.use(function (req, res, next) {
  let params = { where: {}};
  for(let key in req.query) {
    if (key === 'offset') params.offset = req.query.offset;
    else if (key === 'limit') params.limit = req.query.limit;
    // else if (key === 'q') params.where.name = { $like: `%${req.query[key]}%` };
    // else params.where[key] = req.query[key];
  }
  req.sql = params;
  next();
});

router.use('/artists', require('./artists'));
router.use('/albums', require('./albums'));
router.use('/tracks', require('./tracks'));
router.use('/users', require('./users'));

module.exports = router;
