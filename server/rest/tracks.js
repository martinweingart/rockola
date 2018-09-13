const express = require('express');
const router = express.Router();
const db = require('../db');
const return_types = require('../return_types');

router.get('/', function(req, res) {
    req.sql.order = [
      [db.Artist, 'name', 'ASC'],
      [db.Album, 'name', 'ASC'],
      ['track', 'ASC']
    ];
    req.sql.include = [{
      model: db.Album,
      attributes: [ 'name' ],
      as: 'album'
    }, {
      model: db.Artist,
      attributes: [ 'name' ],
      as: 'artist'
    }];
  
    db.Track.findAll(req.sql)
    .then(tracks => return_types.ok(res, tracks))
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
  });

  module.exports = router;