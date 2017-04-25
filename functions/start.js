var express = require('express');
var router = express.Router();
var http = require('http');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('./home/app.html');
});

module.exports = router;