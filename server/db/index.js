//jshint esversion:6

const Sequelize = require('sequelize');
const config = require('../config');

var sequelize = new Sequelize('database', 'username', 'password', {
  host: config.host,
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: '/home/mweingart/Proyectos/rockola/server/db/db.sqlite',
  logging: false
});

module.exports.sequelize = sequelize;

var Artist = sequelize.import(__dirname + "/models/artist");
var Album = sequelize.import(__dirname + "/models/album");
var Track = sequelize.import(__dirname + "/models/track");
var Genre = sequelize.import(__dirname + "/models/genre");

Artist.hasMany(Album, { onDelete: 'CASCADE' });
Album.belongsTo(Artist);
Album.hasMany(Track, { onDelete: 'CASCADE' });
Track.belongsTo(Album);
Track.belongsTo(Artist);
Artist.hasMany(Track);
Track.belongsToMany(Genre, {through: 'SongGenre'});
Genre.belongsToMany(Track, {through: 'SongGenre'});

module.exports.Artist = Artist;
module.exports.Album = Album;
module.exports.Track = Track;
module.exports.Genre = Genre;

module.exports.init = function() {
  return sequelize.sync({ force: true });
};
