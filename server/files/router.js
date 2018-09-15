const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const return_types = require('../return_types');
const db = require('../db');
const archiver = require('archiver');
const contentDisposition = require('content-disposition')


router.get('/tracks/download', function(req, res) {
  db.Track.findAll({
    where: { id: { $in: req.query.track } }
  })
  .then(tracks => {
    if (tracks.length > 0) {
      res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Disposition": contentDisposition('Rockola Playlist.zip')
      });

      let archive = archiver('zip', {
        zlib: { level: 9 }
      });

      for(let track of tracks) {
        archive.file(track.uri, { name: `${track.track} - ${track.name}.mp3` });
      }
      
      archive.finalize();
      archive.pipe(res, { end: true });

    }
    else return_types.not_found(res);
  })
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});

function getFileStats(path) {
  return new Promise(function(resolve, reject) {
    fs.stat(path, function(e, stats) {
      if (e) reject(e);
      else resolve(stats)
    })
  })
}

router.get('/tracks/:id', function(req, res) {
  db.Track.findOne({ where: { id: req.params.id } })
    .then(track => {

      getFileStats(track.uri)
      .then(stat => {
        res.writeHead(200, {
          'Content-Type': 'audio/mp3',
          'Content-Length': stat.size
        });
    
        const stream = fs.createReadStream(track.uri);
    
        stream.on('end', () => console.log('Streaming finished!'));
        stream.pipe(res);
      })
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
        res.download(track.uri, `${track.name}.mp3`);
      }
      else return_types.not_found(res);
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});


router.get('/albums/:id/download', function(req, res) {
  db.Album.findOne({
    where: { id: req.params.id },
    include: [{
        model: db.Track,
        as: 'tracks'
    }]
  })
  .then(album => {
    if (album) {
      res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Disposition": contentDisposition(`(${album.year}) ${album.name}.zip`)
      });

      let archive = archiver('zip', {
        zlib: { level: 9 }
      });

      for(let track of album.tracks) {
        archive.file(track.uri, { name: `${track.track} - ${track.name}.mp3` });
      }
      
      archive.finalize();
      archive.pipe(res, { end: true });

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

router.get('/artist-photo/:id', function(req, res) {
  db.Artist.findOne({ where: { id: req.params.id } })
    .then(artist => {
      if (artist && artist.photo) res.sendFile(`${__dirname}/artist-photo/${artist.name}.jpg`);
      else return_types.not_found(res);
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});

module.exports = router;
