var express = require('express');
var router = express.Router();

//get homepage
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;