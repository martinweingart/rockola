// jshint esversion:6

const fs = require('fs');
const path = require('path');
const express = require('express');
const config = require('./config');
const rest_router = require('./rest/router');
const file_router = require('./files/router');
// const app_events = require('./custom-events/app-events');
const db = require('./db');

const app = express();
app.listen(config.port, config.host);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD");
  next();
});

app.use('/rest', rest_router);
app.use('/files', file_router);
