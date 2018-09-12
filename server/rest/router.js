const path = require('path');
const express = require('express');
const body_parser = require('body-parser');
const router = express.Router();
const db = require('../db');
const scraper = require('../scraper/wraper');
const auth = require('../auth');
const return_types = require('../return_types');
const config = require('../config');


router.use(body_parser.json());
router.use(function (req, res, next) {
  let params = { where: {}};
  for(let key in req.query) {
    if (key === 'offset') params.offset = req.query.offset;
    else if (key === 'limit') params.limit = req.query.limit;
    else if (key === 'search') params.where.name = { $like: `%${req.query[key]}%` };
    else params.where[key] = req.query[key];
  }
  req.sql = params;
  next();
});

router.get('/artists', function(req, res) {
  db.Artist.findAll({
    order: [ ['name', 'ASC'] ],
    include: [{
        model: db.Album,
        as: 'albums'
    }]
  })
  .then(arts => {
      return_types.ok(res, arts);
  })
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});

router.get('/artists/:id', function(req, res) {
  db.Artist.findOne({
    where: { id: req.params.id },
    include: [{
        model: db.Album,
        as: 'albums'
    }]
  })
  .then(art => {
      return_types.ok(res, art);
  })
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});

router.get('/albums', function(req, res) {
  req.sql.order = [
    ['artistId', 'ASC'],
    ['name', 'ASC']
  ];
  db.Album.findAll(req.sql)
  .then(albums => {
    return_types.ok(res, albums);
  })
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});

router.get('/songs', function(req, res) {
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

  db.Song.findAll(req.sql)
  .then(songs => return_types.ok(res, songs))
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});


router.get('/folders', function(req, res) {
  db.Folder.findAll()
    .then(folders => return_types.ok(res, folders))
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});


router.post('/folders', function(req, res) {
  let folder_data = {
    path: req.body.path,
    scanned: false,
    search_art: req.body.search_art
  };

  db.Folder.build(folder_data).save()
    .then(f => {
      return_types.created(res, { msg: "Carpeta creada con éxito", "uri": `${config.protocol}://${config.host}:${config.port}/rest/folders/${f.id}`});
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});

router.put('/folders/:id', function(req, res) {
  db.Folder.findOne({ where: { id: req.params.id }})
    .then(folder => {
      folder.scanned = req.body.scanned;
      folder.search_art = req.body.search_art;
      folder.save()
            .then(f => return_types.ok(res, { msg: "Carpeta modificada con éxito", "uri": `${config.protocol}://${config.host}:${config.port}/rest/folders/${f.id}`}));
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});

function checkAndDestroyArtist() {
  return db.Artist.findAll()
    .then(artist => {
       artist.forEach(artist => {
         artist.getSongs().then(s => {
           if (Array.isArray(s) && !s.length) artist.destroy();
         });
       });
  });
}

router.delete('/folders/:id', function(req, res) {
  db.Folder.findOne({ where: { id: req.params.id }})
    .then(f =>
      f.destroy()
        .then(r => {
          return_types.ok(res, { msg: "Carpeta eliminada con éxito", "id": `${req.params.id}`});
          checkAndDestroyArtist();
     }))
     .catch(error => {
       console.log(error);
       return_types.internal_error(res);
     });
});

router.post('/folders/:id/scan', function(req, res) {
  db.Folder.findOne({ where: { id: req.params.id } })
    .then(f => {
        if (f) {
          scraper.scan(f);
          return_types.ok(res, { msg: "Scanning started", folder: req.params.id });
        }
        else return_types.not_found(res);
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});

router.post('/users/authenticate', function(req, res) {
  auth.authenticate(req.body.email, req.body.pass)
      .then(r => {
        return_types[r.return_type](res, r.json);
      })
      .catch(error => {
        console.log(error);
        return_types.internal_error(res);
      });
});

router.get('/users', auth.validation.isAdmin, function(req, res) {
  db.User.findAll({
    attributes: ['id', 'admin', 'first_name', 'last_name', 'email', 'createdAt', 'updatedAt']
  })
  .then(users => return_types.ok(res, users))
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});

router.get('/users/:id', auth.validation.isOwnerOrAdmin, function(req, res) {
  db.User.findOne({ attributes: ['id', 'first_name', 'last_name', 'email', 'createdAt', 'updatedAt'], where: { id: req.params.id } })
  .then(user => {
    if (!user) return_types.not_found(res);
    else return_types.ok(res, user.dataValues);
  })
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});

router.post('/users', auth.validation.isOwnerOrAdmin, function(req, res) {
  let user = req.body.user;
  let new_user = db.User.build(user);
  new_user.validate()
    .then(err => {
      if (!err) {
        new_user.save()
            .then(u => return_types.created(res, { msg: 'Recurso creado con éxito', url: `http://${config.host}:${config.port}/rest/users/${u.id}` } ))
            .catch(error => {
              console.log(error);
              return_types.internal_error(res);
            });
      }
      else {
        console.log(err);
        return_types.internal_error(res);
      }
    });
});

router.put('/users/:id', auth.validation.isOwnerOrAdmin, function(req, res) {
  db.User.findOne({ where: { id: req.params.id } })
  .then(user => {
    if (!user) return_types.not_found(res);
    else {
      for(let key in req.body.user) user[key] = req.body.user[key];
      user.save()
          .then(u => return_types.ok(res, { msg: 'Recurso modificado con éxito'} ));
    }
  })
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});

router.delete('/users/:id', auth.validation.isAdmin, function(req, res) {
  db.User.findOne({ where: { id: req.params.id } })
  .then(user => {
    if (!user) return_types.not_found(res);
    else {
      for(let key in req.body.user) {
        if (key != 'password' && key!= 'password_confirmation') user[key] = req.body.user[key];
      }
      user.destroy()
          .then(u => return_types.ok(res, { msg: 'Recurso eliminado con éxito'} ));
    }
  })
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});

router.put('/users/:id/playlists', auth.validation.isOwner, function(req, res) {
  db.User.find({
    where: { id: req.params.id }
  })
  .then(user => {
    return db.Playlist.find({ where: { name: req.body.name, userId: req.params.id }})
      .then(p => {
          if (p) throw { name : "conflict", msg : "Playlist existente" };
          else {
            return db.Playlist.build({ name: req.body.name }).save()
              .then(playlist =>  {
                let proms = [];
                req.body.songs.forEach(s => {
                  proms.push(
                    db.Song.find( { where: { id: s.id } })
                      .then(song => {
                        db.ListSong.build({ order: s.order }).save()
                          .then(ls => {ls.setSong(song); return ls;})
                          .then(ls => playlist.addListsong(ls) );
                      })
                  );
                });
                return Promise.all(proms).then(rs => user.addPlaylist(playlist));
               });
          }
      });
  })
  .then(p => return_types.ok(res, { msg: 'Playlist añadido ', id: req.params.id } ))
  .catch(e => {
    if (e.name === 'conflict') return_types.conflict(res);
    else {
      console.log(error);
      return_types.internal_error(res);
    }
  });
});

router.get('/users/:id/playlists', auth.validation.isOwner, function(req, res) {
  db.User.find({
    where: { id: req.params.id },
    attributes: [ 'id', 'email'],
    include: [{
        model: db.Playlist,
        as: 'playlists',
        include: [{
          model: db.ListSong,
          as: 'listsongs',
          include: [{
            model: db.Song,
            as: 'song',
            include: [{
              model: db.Album,
              attributes: [ 'name' ],
              as: 'album'
            }, {
              model: db.Artist,
              attributes: [ 'name' ],
              as: 'artist'
            }]
          }]
        }]
    }]
  })
  .then(user => return_types.ok(res, user.dataValues))
  .catch(error => {
    console.log(error);
    return_types.internal_error(res);
  });
});


router.delete('/users/:id/playlists/:id_playlist', auth.validation.isOwner, function(req, res) {
  db.Playlist.find({ where: { id: req.params.id_playlist }})
    .then(p => {
          if (!p) throw { name : "not_found", msg : "Playlist inexistente" };
          else return p.destroy();
    })
    .then(p => return_types.ok(res, { msg: 'Playist eliminado ', id: req.params.id_playlist }))
    .catch(e => {
      if (e.name === 'not_found') return_types.not_found(res);
      else {
        console.log(e);
        return_types.internal_error(res);
      }
    });
});

module.exports = router;
