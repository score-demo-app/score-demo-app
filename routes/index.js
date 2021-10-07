var express = require('express');
var router = express.Router();

const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/entry', function(req, res){
    res.render('entry');
});
router.get('/search', function(req, res){
    res.render('search');
});

module.exports = router;
