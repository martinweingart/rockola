const express = require('express');
const router = express.Router();
const db = require('../db');
const return_types = require('../return_types');

router.get('/', function(req, res) {
    req.sql.order = [
      ['artistId', 'ASC'],
      ['name', 'ASC']
    ];

    req.sql.include = [{
      model: db.Artist,
      as: 'artist'
    }]

    db.Album.findAll(req.sql)
    .then(albums => {
      return_types.ok(res, albums);
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});

router.get('/:id', function(req, res) {
    db.Album.findOne({
      where: { id: req.params.id },
      include: [{
          model: db.Track,
          as: 'tracks'
      }]
    })
    .then(album => {
      return_types.ok(res, album);
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});

router.get('/:id/tracks', function(req, res) {
  db.Album.findOne({
    where: { id: req.params.id }
  })
  .then(album => {
    album.getTracks({ order: ['track'], include: [{
      model: db.Album,
      attributes: [ 'name' ],
      as: 'album'
    }, {
      model: db.Artist,
      attributes: [ 'name' ],
      as: 'artist'
    }] })
    .then(tracks => return_types.ok(res, tracks))
  })
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});

module.exports = router;