const express = require('express');
const router = express.Router();
const db = require('../db');
const return_types = require('../return_types');

router.get('/', function(req, res) {
    req.sql.order = [ ['name', 'ASC'] ];
    req.sql.include = [{
        model: db.Album,
        as: 'albums'
    }];

    if (req.query.q)
        req.sql.where.name = { $like: `%${req.query.q}%` };

    db.Artist.findAll(req.sql)
    .then(arts => {
        return_types.ok(res, arts);
    })
    .catch(error => {
      console.log(error);
      return_types.internal_error(res);
    });
});

router.get('/:id', function(req, res) {
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

module.exports = router;