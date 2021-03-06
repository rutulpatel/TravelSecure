var db  = require('../models');
var express = require('express');
var router  = express.Router();
var isAuthenticated = require("../config/middleware/isAuthenticated");


router.get('/', isAuthenticated, function(req, res) {
  res.render('trips/trips', {
  	layout: 'main-trips'
  });
});

router.post('/new', isAuthenticated, function(req, res) {

	// Add id from User onto req.body
	req.body.UserId = req.user.id;

  db.Trip.create(req.body).then(function(dbPost) {
    res.json(dbPost);
  });
});

module.exports = router;
