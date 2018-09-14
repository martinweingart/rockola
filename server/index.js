const path = require('path');
const express = require('express');
const config = require('./config');

const app = express();
app.listen(config.port, config.host);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD");
  next();
});

app.use('/rest', require('./rest/router'));
app.use('/files', require('./files/router'));
app.use('/', express.static(path.join(__dirname, '..', 'dist')));
