const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../auth');
const return_types = require('../return_types');
const config = require('../config');

router.post('/authenticate', function(req, res) {
    auth.authenticate(req.body.email, req.body.pass)
        .then(r => {
          return_types[r.return_type](res, r.json);
        })
        .catch(error => {
          console.log(error);
          return_types.internal_error(res);
        });
  });
  
  router.get('', auth.validation.isAdmin, function(req, res) {
    db.User.findAll({
      attributes: ['id', 'admin', 'first_name', 'last_name', 'email', 'createdAt', 'updatedAt']
    })
    .then(users => return_types.ok(res, users))
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
  });
  
  router.get('/:id', auth.validation.isOwnerOrAdmin, function(req, res) {
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
  
  router.post('', auth.validation.isOwnerOrAdmin, function(req, res) {
    let user = req.body.user;
    let new_user = db.User.build(user);
    new_user.validate()
      .then(err => {
        if (!err) {
          new_user.save()
              .then(u => return_types.created(res, { msg: 'Recurso creado con éxito', url: `http://${config.host}:${config.port}/rest/${u.id}` } ))
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
  
  router.put('/:id', auth.validation.isOwnerOrAdmin, function(req, res) {
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
  
  router.delete('/:id', auth.validation.isAdmin, function(req, res) {
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
  
  router.put('/:id/playlists', auth.validation.isOwner, function(req, res) {
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
                  req.body.tracks.forEach(s => {
                    proms.push(
                      db.Track.find( { where: { id: s.id } })
                        .then(track => {
                          db.PlaylistTrack.build({ order: s.order }).save()
                            .then(ls => {ls.setTrack(track); return ls;})
                            .then(ls => playlist.addPlaylisttrack(ls) );
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
  
  router.get('/:id/playlists', auth.validation.isOwner, function(req, res) {
    db.User.find({
      where: { id: req.params.id },
      attributes: [ 'id', 'email'],
      include: [{
          model: db.Playlist,
          as: 'playlists',
          include: [{
            model: db.PlaylistTrack,
            as: 'listtracks',
            include: [{
              model: db.Track,
              as: 'track',
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
  
  
  router.delete('/:id/playlists/:id_playlist', auth.validation.isOwner, function(req, res) {
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