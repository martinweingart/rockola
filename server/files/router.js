const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const return_types = require('../return_types');
const db = require('../db');


router.get('/tracks/:id', function(req, res) {
  db.Track.findOne({ where: { id: req.params.id } })
    .then(track => {
      // if (track) res.sendFile(track.uri);
      // else return_types.not_found(res);
      var stream = fs.createReadStream(track.uri)
      .on('end', function () {
          console.log('Stream Done');
      })
      .on("error", function (err) {
          res.end(err);
      })
      .pipe(res, { end: true });
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});

router.get('/tracks/:id/download', function(req, res) {
  db.Track.findOne({ where: { id: req.params.id } })
    .then(track => {
      if (track) {
        let headers = {
          'Content-disposition': `attachment; filename="${track.name}.mp3"`,
          'Content-type': 'audio/mpeg'
        };
        res.sendFile(track.uri, {headers: headers});
      }
      else return_types.not_found(res);
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});

router.get('/album-art/:id', function(req, res) {
  db.Album.findOne({ where: { id: req.params.id } })
    .then(album => {
      if (album && album.art) res.sendFile(`${__dirname}/album-art/${album.name}.jpg`);
      else return_types.not_found(res);
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});

module.exports = router;
