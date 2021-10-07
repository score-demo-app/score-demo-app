var express = require('express');
var router = express.Router();

router.get('/entry', function(req, res){
    res.render('entry-form')
});