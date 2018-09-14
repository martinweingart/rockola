// jshint esversion:6

const fs = require('fs');
const path = require('path');
const express = require('express');
const config = require('./config');
const rest_router = require('./rest/router');
const file_router = require('./files/router');
const db = require('./db');
const scraper = require('./scraper');
const return_types = require('./return_types');


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

app.get('/scan', function(req, res) {
  scraper.scan(config.folders[0]);
  return_types.ok(res, { msg: "Scanning started" });
});
